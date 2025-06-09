<template>
  <div class="text-foreground form-challenge">
    <form @submit="onSubmit" class="space-y-4">
      <div v-for="(question, index) in formChallenge.metadata.questions" :key="index">
        <FormField v-slot="{ componentField }" :name="`q${index + 1}`">
          <FormItem>
            <FormLabel>{{ question }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="text"
                required
                class="response-input"
                :placeholder="`Answer for: ${question}`"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <Button type="submit" class="w-full bg-gradient">
        Submit Answers
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormChallenge } from '@/modules/gamification/challenges/models/challenge.model'
import * as z from 'zod'
import { ref } from 'vue'
import { useForm } from 'vee-validate'

const props = defineProps<{
  challenge: object
}>()

const formChallenge = ref(props.challenge as FormChallenge)

// Create validation schema with named fields
const formSchema = toTypedSchema(z.object({
  q1: z.string().min(1, 'Answer is required').max(500),
  q2: z.string().min(1, 'Answer is required').max(500),
  q3: z.string().min(1, 'Answer is required').max(500),
  q4: z.string().min(1, 'Answer is required').max(500)
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

interface FormValues {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

const emit = defineEmits<{
  (e: 'open-complete-challenge', payload: object): void
}>()

const onSubmit = handleSubmit<void>((values: FormValues) => {
  console.log('Form answers:', values)

  const payload = {
    answer1: values.q1,
    answer2: values.q2,
    answer3: values.q3,
    answer4: values.q4
  }

  emit('open-complete-challenge', payload)
  return Promise.resolve()
})
</script>

<style scoped>
@import './form-challenge.css';
</style>
