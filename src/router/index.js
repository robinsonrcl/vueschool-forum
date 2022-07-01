import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/pages/Home.vue'
import ThreadShow from '@/components/pages/ThreadShow.vue'
import ThreadCreate from '@/components/pages/ThreadCreate.vue'
import ThreadEdit from '@/components/ThreadEdit.vue'
import NotFound from '@/components/pages/NotFound.vue'

import Forum from '@/components/pages/Forum.vue'
import Category from '@/components/pages/Category.vue'
import Profile from '@/components/pages/Profile.vue'
import store from '@/store'
import Register from '@/components/pages/Register.vue'
import SignIn from '@/components/pages/SignIn.vue'
import { findById } from '@/helpers'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },

  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true },
    meta: { requiresAuth: true }
  },

  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },

  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true
  },

  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true,

    async beforeEnter (to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id })

      const threadExists = findById(store.state.threads.items, to.params.id)

      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    }
  },

  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true,
    meta: { requiresAuth: true }
  },

  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
    meta: { requiresAuth: true }
  },

  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },

  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
    meta: { requiresGuest: true }
  },

  {
    path: '/logout',
    name: 'SignOut',

    async beforeEnter (to, from) {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}

    if (to.meta.toTop) scroll.top = 0

    if (to.meta.smoothScroll) scroll.behavior = 'smooth'

    return scroll
  }
})

router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnapshots')

  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } }
  }

  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})

export default router
