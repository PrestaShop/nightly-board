<template>
  <div class="error-page">
    <div class="error-notfound" v-if="error.statusCode === 404">
      <div ref="lavContainer" :style="style"></div>
    </div>

    <h1 v-else>An error occurred</h1>
    <nuxt-link to="/" class="back">Go to home page</nuxt-link>
  </div>
</template>

<script>
  import Lottie from 'lottie-web'
  import * as animationData from './404.json'

  export default {
    props: ['error'],
    layout: 'blog', // you can set a custom layout for the error page
    data() {
      return {
        style: {
          width: '100%',
          height: '500px',
          overflow: 'hidden',
          margin: '0 auto'
        }
      }
    },
    mounted() {
      this.anim = Lottie.loadAnimation({
        container: this.$refs.lavContainer,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: animationData.default
      })
      this.$emit('animCreated', this.anim)
    }
  }
</script>

<style lang="scss">
  .error-page {
    text-align: center;
    color: $primary;

    .back {
      color: $primary;
      text-decoration: none;
      font-size: 20px;
      font-weight: 600;

      @at-root .dark & {
        color: white;
      }
    }
  }
</style>
