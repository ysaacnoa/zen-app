import { z } from 'zod';
import { ProgressStatus } from './progress-status.enum';
import { ChallengeType } from './challenge.model';

export enum ChallengeCompletionType {
  CLICK = 'CLICK',
  FORM = 'FORM',
  AUDIO = 'AUDIO',
  TIMER = 'TIMER',
  TEXT = 'TEXT',
}

// Tipos de metadata para cada challenge completion
type ClickCompletionMetadata = object;
interface FormCompletionMetadata {
  answers: {
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
  }[];
}
interface AudioCompletionMetadata {
  audio: string;
  duration: number;
  sampleRate: number | null;
}
interface TimerCompletionMetadata {
  timeMetrics: {
    completionRatio: number;
    startTime: string;
    endTime: string;
  };
  performance: {
    consistencyScore: number;
    distractions: number;
  };
}
interface TextCompletionMetadata {
  answers: {
    answer: string;
  }[];
}

interface IChallengeCompletionBase {
  id: string;
  userId: string;
  challengeId: string;
  status: ProgressStatus;
  completedAt: string | null;
  createdAt: string;
  currentCompletions: number;
  metadata?: object;
  type: ChallengeType;
}

abstract class ChallengeCompletionBase implements IChallengeCompletionBase {
  public id: string;
  public userId: string;
  public challengeId: string;
  public status: ProgressStatus;
  public completedAt: string | null;
  public createdAt: string;
  public currentCompletions: number;
  protected _metadata: object = {};
  public completionDate: string | null = null;
  public type: ChallengeType;

  public get metadata(): object {
    return this._metadata;
  }
  public set metadata(value: object) {
    this._metadata = value;
  }

  constructor(challengeCompletion: IChallengeCompletionBase) {
    this.id = challengeCompletion.id;
    this.userId = challengeCompletion.userId;
    this.challengeId = challengeCompletion.challengeId;
    this.status = challengeCompletion.status;
    this.completedAt = challengeCompletion.completedAt;
    this.createdAt = challengeCompletion.createdAt;
    this.currentCompletions = challengeCompletion.currentCompletions;
    this.type = challengeCompletion.type;
  }
}

export class ClickChallengeCompletion extends ChallengeCompletionBase {
  constructor(data: IChallengeCompletionBase) {
    super(data);
  }

  get metadata(): ClickCompletionMetadata {
    return this._metadata as ClickCompletionMetadata;
  }
}

export class FormChallengeCompletion extends ChallengeCompletionBase {
  constructor(data: IChallengeCompletionBase) {
    super(data);
  }

  get metadata(): FormCompletionMetadata {
    return this._metadata as FormCompletionMetadata;
  }
}

export class AudioChallengeCompletion extends ChallengeCompletionBase {
  constructor(data: IChallengeCompletionBase) {
    super(data);
  }

  get metadata(): AudioCompletionMetadata {
    return this._metadata as AudioCompletionMetadata;
  }
}

export class TimerChallengeCompletion extends ChallengeCompletionBase {
  constructor(data: IChallengeCompletionBase) {
    super(data);
  }

  get metadata(): TimerCompletionMetadata {
    return this._metadata as TimerCompletionMetadata;
  }
}

export class TextChallengeCompletion extends ChallengeCompletionBase {
  constructor(data: IChallengeCompletionBase) {
    super(data);
  }

  get metadata(): TextCompletionMetadata {
    return this._metadata as TextCompletionMetadata;
  }
}

export type ChallengeCompletion =
  | ClickChallengeCompletion
  | FormChallengeCompletion
  | AudioChallengeCompletion
  | TimerChallengeCompletion
  | TextChallengeCompletion;

// Schema de validación Zod
export const challengeCompletionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  status: z.nativeEnum(ProgressStatus),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  currentCompletions: z.number(),
  metadata: z.array(z.unknown()),
  type: z.nativeEnum(ChallengeType),
});

export interface ChallengeCompletionFactory {
  createCompletion(data: z.infer<typeof challengeCompletionSchema>): ChallengeCompletion;
}

export class ConcreteChallengeCompletionFactory implements ChallengeCompletionFactory {
  private completionConstructors = {
    [ChallengeType.CLICK]: ClickChallengeCompletion,
    [ChallengeType.FORM]: FormChallengeCompletion,
    [ChallengeType.AUDIO]: AudioChallengeCompletion,
    [ChallengeType.TIMER]: TimerChallengeCompletion,
    [ChallengeType.TEXT]: TextChallengeCompletion,
  };

  createCompletion(data: z.infer<typeof challengeCompletionSchema>): ChallengeCompletion {
    const CompletionClass = this.completionConstructors[data.type];
    if (!CompletionClass) {
      throw new Error(`Unknown challenge completion type: ${data.type}`);
    }
    console.debug('[COMPLATION CLASS]', new CompletionClass({
      ...data,
      metadata: data.metadata ?? {},
    }))
    return new CompletionClass({
      ...data,
      metadata: data.metadata ?? {},
    });
  }
}
