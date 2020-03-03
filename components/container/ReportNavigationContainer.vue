<template>
  <div class="reportNavigation-container">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'ReportNavigationContainer'
  }
</script>

<style lang="scss">
  .reportNavigation-container {
    overflow-y: scroll;
    max-height: 400px;
    border: 1px solid #eaeaea;
    margin: -5px;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 0 6px 0 #0000001c;

    @at-root .dark & {
      border: 1px solid #363636;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: #b7ced3;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 10px;
      transition: 0.4s ease-out;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #b7ced3;
    }
  }
</style>
