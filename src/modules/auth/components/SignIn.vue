<template>
  <form @submit="onSubmit" class="space-y-4 bg-white p-6 rounded-lg">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel class="required-field">Email</FormLabel>
        <FormControl>
          <Input type="email" placeholder="tu@email.com" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel class="required-field">Contraseña</FormLabel>
        <FormControl>
          <Input type="password" placeholder="••••••" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full gradient-button">
      Iniciar sesión
    </Button>

    <div class="text-center mt-4 text-sm">
      ¿No tienes una cuenta?
      <button
        type="button"
        class="text-primary underline hover:text-primary/80"
        @click="$emit('toggle-view')"
      >
        Regístrate
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { authDAO } from '../dao/auth.dao'

const router = useRouter()
const emit = defineEmits(['close', 'toggle-view'])

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await authDAO.login(values.email, values.password)
    console.log('Login successful:', response)
    emit('close')
    await nextTick()
    router.push('/forms')
  } catch (error) {
    console.error('Login failed:', error)
  }
})
</script>

<style scoped>
.required-field::after {
  content: '*';
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.gradient-button {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
}
</style>
