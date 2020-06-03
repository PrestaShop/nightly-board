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

  @media screen and (max-width: 767px) {
    .topBar {
      flex-wrap: wrap;
    }

    .layout {
      .select {
        flex-wrap: wrap;

        .v-text-field__details {
          display: none;
        }

        .select-label {
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
