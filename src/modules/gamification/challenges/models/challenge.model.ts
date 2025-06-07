export enum ChallengeType {
  CLICK = 'CLICK',
  FORM = 'FORM',
  AUDIO = 'AUDIO',
  TIMER = 'TIMER',
  TEXT = 'TEXT'
}

type ClickChallengeMetadata = object

interface FormChallengeMetadata {
  questions: string[]
}

interface AudioChallengeMetadata {
  prompt: string
}

interface TimerChallengeMetadata {
  seconds: number
}

interface TextChallengeMetadata {
  prompt: string
}

interface IChallengeBase {
  id: string
  title: string
  rewardXp: number
  createdAt: string
  updatedAt: string
  instructions: string
  requiredCompletions: number
  type: ChallengeType
  completionCount: number
  userId: string
  metadata?: object
}

abstract class ChallengeBase implements IChallengeBase {
  public get metadata(): object {
    return this._metadata
  }
  public set metadata(value: object) {
    this._metadata = value
  }
  constructor(
    public id: string,
    public title: string,
    public rewardXp: number,
    public createdAt: string,
    public updatedAt: string,
    public instructions: string,
    public requiredCompletions: number,
    public type: ChallengeType,
    public completionCount: number,
    public userId: string,
    protected _metadata: object = {}
  ) {}
}

export class ClickChallenge extends ChallengeBase {

  constructor(data: Omit<IChallengeBase, 'type'>) {
    super(
      data.id,
      data.title,
      data.rewardXp,
      data.createdAt,
      data.updatedAt,
      data.instructions,
      data.requiredCompletions,
      ChallengeType.CLICK,
      data.completionCount,
      data.userId,
      data.metadata ?? {}
    );
  }

  get metadata(): ClickChallengeMetadata {
    return this._metadata as ClickChallengeMetadata;
  }
}

export class FormChallenge extends ChallengeBase {

  constructor(data: Omit<IChallengeBase, 'type'>) {
    super(
      data.id,
      data.title,
      data.rewardXp,
      data.createdAt,
      data.updatedAt,
      data.instructions,
      data.requiredCompletions,
      ChallengeType.FORM,
      data.completionCount,
      data.userId,
      data.metadata ?? {}
    );
  }

  get metadata(): FormChallengeMetadata {
    return this._metadata as FormChallengeMetadata;
  }
}

export class AudioChallenge extends ChallengeBase {
  constructor(data: Omit<IChallengeBase, 'type'>) {
    super(
      data.id,
      data.title,
      data.rewardXp,
      data.createdAt,
      data.updatedAt,
      data.instructions,
      data.requiredCompletions,
      ChallengeType.AUDIO,
      data.completionCount,
      data.userId,
      data.metadata ?? {}
    );

  }

  get metadata(): AudioChallengeMetadata {
    return this._metadata as AudioChallengeMetadata;
  }
}

export class TimerChallenge extends ChallengeBase {

  constructor(data: Omit<IChallengeBase, 'type'>) {
    super(
      data.id,
      data.title,
      data.rewardXp,
      data.createdAt,
      data.updatedAt,
      data.instructions,
      data.requiredCompletions,
      ChallengeType.TIMER,
      data.completionCount,
      data.userId,
      data.metadata ?? {}
    );
  }

  get metadata(): TimerChallengeMetadata {
    return this._metadata as TimerChallengeMetadata;
  }
}

export class TextChallenge extends ChallengeBase {

  constructor(data: Omit<IChallengeBase, 'type'>) {
    super(
      data.id,
      data.title,
      data.rewardXp,
      data.createdAt,
      data.updatedAt,
      data.instructions,
      data.requiredCompletions,
      ChallengeType.TEXT,
      data.completionCount,
      data.userId,
      data.metadata ?? {}
    );
  }

  get metadata(): TextChallengeMetadata {
    return this._metadata as TextChallengeMetadata;
  }
}

export type Challenge =
  | ClickChallenge
  | FormChallenge
  | AudioChallenge
  | TimerChallenge
  | TextChallenge

export interface ChallengeFactory {
  createChallenge(data: IChallengeBase): Challenge
}

export class ConcreteChallengeFactory implements ChallengeFactory {
  createChallenge(data: IChallengeBase): Challenge {
    // Parse metadata from instructions based on type
    const baseData = {
      ...data,
      metadata: data.metadata
    };
    switch(data.type) {
      case ChallengeType.CLICK:
        return new ClickChallenge(baseData);
      case ChallengeType.FORM:
        return new FormChallenge(baseData);
      case ChallengeType.AUDIO:
        return new AudioChallenge(baseData);
      case ChallengeType.TIMER:
        return new TimerChallenge(baseData);
      case ChallengeType.TEXT:
        return new TextChallenge(baseData);
      default:
        throw new Error(`Unknown challenge type: ${data.type}`);
    }
  }
}
