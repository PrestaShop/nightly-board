<template>
  <div class="infosbar" :class="opened">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        opened: true
      }
    }
  }
</script>

<style lang="scss">
  .infosbar {
    max-width: 150px;
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 60px;
    right: 30px;
    padding-top: 70px;
  }
</style>
