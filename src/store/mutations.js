import { docToResource, upsert } from '@/helpers'

export default {
  setItem (state, { resource, item }) {
    upsert(state[resource].items, docToResource(item))
  },

  appendUnsubscribe (state, { unsubscribe }) {
    state.setAuthUserUnsubscribe = unsubscribe
  },

  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  }

}
