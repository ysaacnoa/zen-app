import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import LandingView from '@/views/landing/landing.vue'
import FormsView from '@/views/forms/forms.vue'
import { authDAO } from '@/modules/auth/dao/auth.dao'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/landing'
    },
    {
      path: '/landing',
      name: 'landing',
      component: LandingView,
      meta: { requiresAuth: false }
    },
    {
      path: '/forms',
      name: 'forms',
      component: FormsView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to: RouteLocationNormalized) => {
  if (to.meta.requiresAuth && !authDAO.isAuthenticated()) {
    return { name: 'landing' }
  }
})

export { router }
