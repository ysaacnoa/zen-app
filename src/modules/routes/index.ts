import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import LandingView from '@/views/landing/landing.vue'
import FormsView from '@/views/forms/forms.vue'
import HomeView from '@/views/home/home.vue'
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
      redirect: () => {
        return authDAO.isAuthenticated() ? '/home' : '/landing'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
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
  const isAuthenticated = authDAO.isAuthenticated()

  // Redirect to home if authenticated and trying to access landing
  if (to.name === 'landing' && isAuthenticated) {
    return { name: 'home' }
  }

  // Redirect to landing if trying to access protected route without auth
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'landing' }
  }
})

export { router }
