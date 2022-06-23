import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/pages/Home.vue'
import ThreadShow from '@/components/pages/ThreadShow.vue'
import ThreadCreate from '@/components/pages/ThreadCreate.vue'
import ThreadEdit from '@/components/ThreadEdit.vue'
import NotFound from '@/components/pages/NotFound.vue'

import sourceData from '@/data.json'
import Forum from '@/components/pages/Forum.vue'
import Category from '@/components/pages/Category.vue'
import Profile from '@/components/pages/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    name: 'Profile',
    path: '/me',
    component: Profile,
    meta: { toTop: true, smoothScroll: true }
  },
  {
    name: 'ProfileEdit',
    path: '/me/edit',
    component: Profile,
    props: { edit: true }
  },
  {
    name: 'Category',
    path: '/category/:id',
    component: Category,
    props: true
  },
  {
    name: 'Forum',
    path: '/forum/:id',
    component: Forum,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true,
    beforeEnter: (to, from, next) => {
      const threadExists = sourceData.threads.find(thread => thread.id === to.params.id)

      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          // preserve existing query and hash
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
    props: true
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}

    if (to.meta.toTop) scroll.top = 0

    if (to.meta.smoothScroll) scroll.behavior = 'smooth'

    return scroll
  }
})
