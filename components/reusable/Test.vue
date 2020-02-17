<template>
  <p class="error-message">
    {{ content }}
  </p>
</template>

<script>
  export default {
    name: 'Test',
    props: {
      test: {
        type: Object.JSON,
        default: {}
      }
    },
    data() {
      return {
        content: this.test.error_message
      }
    }
  }
</script>

<style lang="scss">
  .error-message {
    font-weight: bold;
    color: red;
    background: rgba(grey, 0.1);
    padding: 10px;
  }
</style>
