import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import FontAwesome from '@/plugins/FontAwesome'

// import { initializeApp } from 'firebase/app'
// import firebaseConfig from '@/config/firebase'
// import firebase from '@/config/firebase'

import firebase from '@/helpers/firebase'
import firebaseConfig from '@/config/firebase'

// const app = initializeApp(firebaseConfig)
firebase.initializeApp(firebaseConfig)

const forumApp = createApp(App)

forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesome)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)

requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.mount('#app')
