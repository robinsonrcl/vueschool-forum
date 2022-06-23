<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >, <AppDate :timestamp="thread.publishedAt" />
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
      >
        {{ thread.repliesCount }} replies by {{ thread.contributorsCount }} contributor
      </span>
    </p>
    <PostList :posts="threadPosts" />

    <PostEditor @save="addPost" />
  </div>
</template>

<script>
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import AppDate from '../AppDate.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  name: 'PageThreadShow',

  components: {
    PostList,
    PostEditor,
    AppDate
  },

  props: {
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter((post) => post.threadId === this.id)
    }
  },

  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }

      this.$store.dispatch('createPost', post)
    }
  },

  created () {
    firebase
      .firestore()
      .collection('threads')
      .doc(this.id)
      .onSnapshot((doc) => {
        const thread = { ...doc.data(), id: doc.id }
        this.$store.commit('setThread', { thread })

        firebase
          .firestore()
          .collection('users')
          .doc(thread.userId)
          .onSnapshot((doc) => {
            const user = { ...doc.data(), id: doc.id }
            this.$store.commit('setUser', { user })
          })

        thread.posts.forEach((postId) => {
          firebase
            .firestore()
            .collection('posts')
            .doc(postId)
            .onSnapshot((doc) => {
              const post = { ...doc.data(), id: doc.id }

              firebase
                .firestore()
                .collection('users')
                .doc(post.userId)
                .onSnapshot((doc) => {
                  const user = { ...doc.data(), id: doc.id }
                  this.$store.commit('setUser', { user })
                  this.$store.commit('setPost', { post })
                })
            })
        })
      })
  }
}
</script>

<style lang="scss" scoped></style>
