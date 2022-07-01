<template>
  <div>
    <h1>Not Found</h1>
    <router-link :to="{ name: 'Home'}">Read some cool threads</router-link>
  </div>
</template>

<script>

export default {
  name: 'PageNotFound',

  created () {
    this.$emit('ready')
  }
}

</script>

<style lang='scss' scoped></style>
