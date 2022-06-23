<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories='categories' />
</template>

<script>
import CategoryList from '@/components/CategoryList.vue'

export default {
  name: 'PageHome',

  components: {
    CategoryList
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  beforeCreate () {
    console.log('before create')
  },
  created () {
    console.log('created', this.categories)
  },
  beforeMount () {
    console.log('beforeMount', this.categories)
  }
}
</script>

<style lang="scss" scoped></style>
