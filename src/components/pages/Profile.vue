<template>
  <div class="container">
    <div class="flex-grid">
      <div class="col-3 push-top">

        <UserProfileCard v-if="!edit" :user="user"/>
        <UserProfileCardEditor v-else :user="user" />

      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.username }} recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="user.Posts" />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'PageProfile',
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({ user: 'authUser' })
  }
}
</script>

<style lang="scss" scoped></style>
