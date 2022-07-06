<template>
  <img :src="src || '/user-placeholder.png'" />
</template>

<script>
export default {
  name: 'AppAvatarImg',
  created () {},
  data () {
    return {}
  },
  props: {
    src: { type: String }
  },
  methods: {}
}
</script>

<style scoped>
  img {
    object-fit: cover;
  }
</style>
