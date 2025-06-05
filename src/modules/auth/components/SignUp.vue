<template>
  <form @submit="onSubmit" class="space-y-4 bg-white p-6 rounded-lg">
    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="firstname">
        <FormItem>
          <FormLabel class="required-field">Nombre</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Tu nombre" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lastname">
        <FormItem>
          <FormLabel class="required-field">Apellido</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Tu apellido" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

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

    <FormField v-slot="{ componentField }" name="confirmPassword">
      <FormItem>
        <FormLabel class="required-field">Confirmar Contraseña</FormLabel>
        <FormControl>
          <Input type="password" placeholder="••••••" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full gradient-button">
      Registrarse
    </Button>

    <div class="text-center mt-4 text-sm">
      ¿Ya tienes una cuenta?
      <button
        type="button"
        class="text-primary underline hover:text-primary/80"
        @click="$emit('toggle-view')"
      >
        Inicia sesión
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
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

const formSchema = toTypedSchema(
  z.object({
    firstname: z.string().min(1, 'El nombre es requerido'),
    lastname: z.string().min(1, 'El apellido es requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'La confirmación debe coincidir')
  }).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await authDAO.register(
      values.firstname,
      values.lastname,
      values.email,
      values.password
    )
    console.log('Registration successful:', response)
    // TODO: Handle successful registration
  } catch (error) {
    console.error('Registration failed:', error)
    // TODO: Handle registration error
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
