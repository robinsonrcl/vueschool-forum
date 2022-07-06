import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { findById } from '@/helpers'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/components/pages/Home')
  },

  {
    path: '/me',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Profile" */ '@/components/pages/Profile'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },

  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import(/* webpackChunkName: "ProfileEdit" */ '@/components/pages/Profile'),
    props: { edit: true },
    meta: { requiresAuth: true }
  },

  {
    path: '/category/:id',
    name: 'Category',
    component: () => import(/* webpackChunkName: "Category" */ '@/components/pages/Category'),
    props: true
  },

  {
    path: '/forum/:id',
    name: 'Forum',
    component: () => import(/* webpackChunkName: "Forum" */ '@/components/pages/Forum'),
    props: true
  },

  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: () => import(/* webpackChunkName: "ThreadShow" */ '@/components/pages/ThreadShow'),
    props: true,

    async beforeEnter (to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })

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
    component: () => import(/* webpackChunkName: "ThreadCreate" */ '@/components/pages/ThreadCreate'),
    props: true,
    meta: { requiresAuth: true }
  },

  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import(/* webpackChunkName: "ThreadEdit" */ '@/components/ThreadEdit'),
    props: true,
    meta: { requiresAuth: true }
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Register" */ '@/components/pages/Register'),
    meta: { requiresGuest: true }
  },

  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "SigIn" */ '@/components/pages/SignIn'),
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
    component: () => import(/* webpackChunkName: "NotFound" */ '@/components/pages/NotFound')
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

router.afterEach(() => {
  store.dispatch('clearItems', { modules: ['categories', 'forums', 'posts', 'threads'] })
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
