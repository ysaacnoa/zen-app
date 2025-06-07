<template>
  <div class="text-challenge">
    <form @submit="onSubmit" class="space-y-4">
      <FormField v-slot="{ componentField }" name="response">
        <FormItem>
          <FormLabel>{{ textChallenge.metadata.prompt }}</FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              :maxlength="maxLength"
              rows="4"
              class="response-input"
              placeholder="Type your response here..."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" class="w-full bg-gradient">
        Submit Response
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TextChallenge, } from '@/modules/gamification/challenges/models/challenge.model'
import * as z from 'zod'
import { ref } from 'vue'
import { useForm } from 'vee-validate'

const { challenge } = defineProps<{
  challenge: object
}>()

const maxLength = 500
const textChallenge = ref(challenge as TextChallenge)

const formSchema = toTypedSchema(z.object({
  response: z.string()
    .min(1, 'Response is required')
    .max(maxLength, `Response must be less than ${maxLength} characters`)
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit((values) => {
  console.log('Challenge response:', values.response)
  return Promise.resolve()
})
</script>

<style scoped>
@import './text-challenge.css';
</style>
