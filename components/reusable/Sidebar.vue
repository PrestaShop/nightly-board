<template>
  <div class="sidebar" :class="opened">
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
  .sidebar {
    padding: 15px 19px;
    max-width: 270px;
    background: $white;
    width: 100%;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    height: 100vh;
    position: fixed;
    top: 60px;
    left: 0;
    transition: 0.4s ease-out;

    @at-root .dark & {
      background: $greyDark;
    }
  }
</style>
