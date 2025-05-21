<template>
  <Form @submit="onSubmit">
    <div class="gad7-form">
      <div v-if="currentStep <= 3">
        <div class="progress-container">
          <div class="progress-steps">
            <div
              v-for="step in 3"
              :key="step"
              :class="['step', { 'active': step <= currentStep, 'completed': step < currentStep }]"
            >
              <div class="step-number">{{ step }}</div>
              <div class="step-label">Paso {{ step }}</div>
            </div>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercentage }"
            ></div>
          </div>
        </div>

        <div class="question-group">
          <h3 class="font-extrabold">{{ currentQuestions.title }}</h3>
          <div v-for="(question, index) in currentQuestions.questions" :key="index" class="question-card">
            <FormField v-slot="{ componentField }" :name="`answers.${question.id}`">
              <FormItem>
                <FormLabel>{{ question.text }}</FormLabel>
                <FormControl>
                  <RadioGroup
                    v-bind="componentField"
                    class="options-grid"
                    @update:modelValue="(val: string) => selectAnswer(question.id, val)"
                  >
                    <div
                      v-for="(option, optIndex) in options"
                      :key="optIndex"
                      class="option-item"
                      @click="selectAnswer(question.id, option.value)"
                    >
                      <RadioGroupItem
                        :value="option.value"
                        :id="`${question.id}-${optIndex}`"
                        class="radio-group-item"
                      />
                      <Label :for="`${question.id}-${optIndex}`">
                        {{ option.label }}
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="navigation">
          <Button v-if="currentStep > 1" @click="prevStep" variant="outline" type="button">
            Anterior
          </Button>
          <Button
            type="submit"
            :disabled="!canContinue"
            class="next-button"
          >
            {{ currentStep === 3 ? 'Ver resultados' : 'Siguiente' }}
          </Button>
        </div>
      </div>

      <div v-else class="results">
        <Card class="result-card">
          <CardHeader>
            <CardTitle>Resultado de tu evaluación</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="score-display">
              <h2>Puntaje total: {{ totalScore }}</h2>
              <p class="result-message">{{ resultMessage }}</p>
              <pre class="results-data">{{ formResults }}</pre>
            </div>
            <Button @click="resetForm" class="restart-button" type="button">
              Volver a empezar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

interface Question {
  id: string
  text: string
}

interface StepGroup {
  title: string
  questions: Question[]
}

const questions: Question[] = [
  { id: 'q1', text: '¿Se ha sentido nervioso, ansioso o al límite?' },
  { id: 'q2', text: '¿Ha sido incapaz de parar o controlar su preocupación?' },
  { id: 'q3', text: '¿Se ha preocupado demasiado por diferentes cosas?' },
  { id: 'q4', text: '¿Ha tenido dificultad para relajarse?' },
  { id: 'q5', text: '¿Se ha sentido tan inquieto que le ha resultado difícil quedarse quieto?' },
  { id: 'q6', text: '¿Se ha irritado o molestado fácilmente?' },
  { id: 'q7', text: '¿Ha sentido miedo como si algo terrible fuera a pasar?' }
]

const stepGroups: StepGroup[] = [
  {
    title: 'Preocupación y tensión general',
    questions: [questions[0], questions[1], questions[2]]
  },
  {
    title: 'Dificultad para relajarse',
    questions: [questions[3], questions[4]]
  },
  {
    title: 'Irritabilidad y temor',
    questions: [questions[5], questions[6]]
  }
]

interface Option {
  value: number
  label: string
}

const options: Option[] = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Varios días' },
  { value: 2, label: 'Más de la mitad' },
  { value: 3, label: 'Casi todos' }
]

const currentStep = ref(1)
const formResults = ref('')
const { setFieldValue, values: form } = useForm({
  initialValues: {
    answers: {} as Record<string, number | undefined>
  }
})

const currentQuestions = computed(() => stepGroups[currentStep.value - 1])
const progressPercentage = computed(() => `${(currentStep.value / 3) * 100}%`)

const canContinue = computed(() => {
  return currentQuestions.value.questions.every(q =>
    form.answers[q.id] !== undefined
  )
})

const totalScore = computed(() => {
  return Object.values(form.answers).reduce((sum: number, score: number | undefined) =>
    sum + (score || 0), 0)
})

const resultMessage = computed(() => {
  const score = totalScore.value
  if (score <= 4) return 'Ansiedad mínima'
  if (score <= 9) return 'Ansiedad leve'
  if (score <= 14) return 'Ansiedad moderada'
  return 'Ansiedad grave'
})

function selectAnswer(questionId: string, value: number | string) {
  setFieldValue(`answers.${questionId}`, Number(value))
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

function prevStep() {
  currentStep.value--
}

function resetForm() {
  currentStep.value = 1
  formResults.value = ''
  Object.keys(form.answers).forEach(key => {
    setFieldValue(`answers.${key}`, undefined)
  })
}

function showResults() {
  const results = getFormResults()
  formResults.value = JSON.stringify(results, null, 2)
  currentStep.value = 4 // Saltar directamente al paso de resultados
}

function getFormResults() {
  return {
    userId: 'uuid-del-usuario', // Simulado por ahora
    fecha: new Date().toISOString().split('T')[0],
    gad7: {
      ...form.answers,
      total: totalScore.value
    }
  }
}

function onSubmit() {
  if (currentStep.value === 3) {
    showResults()
  } else {
    nextStep()
  }
}
</script>

<style scoped>
@import './gad7-form.css';
</style>
