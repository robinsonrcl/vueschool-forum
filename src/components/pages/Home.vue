<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories='categories' />
</template>

<script>
import CategoryList from '@/components/CategoryList.vue'
import { mapActions } from 'vuex'

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

  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },

  async created () {
    const categories = await this.fetchAllCategories()
    const forumIds = categories.map(category => category.forums).flat()
    this.fetchForums({ ids: forumIds })
    console.log('before create', this.categories)
  }

}
</script>

<style lang="scss" scoped></style>
