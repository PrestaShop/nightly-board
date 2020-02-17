<template>
  <div class="topBar">
    <slot name="left"></slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style lang="scss">
  .topBar {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    padding: 0;
  }
</style>
