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
  import * as animationDataDark from './404-dark.json'

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
        },
        anim: null
      }
    },
    mounted() {
      const anim = Lottie.loadAnimation({
        container: this.$refs.lavContainer,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: this.$store.state.localConfig.isDark
          ? animationDataDark.default
          : animationData.default
      })
      this.$emit('animCreated', this.anim)

      anim.addEventListener('enterFrame', function(animation) {
        if (animation.currentTime > anim.totalFrames - 17) {
          anim.pause()
        }
      })
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
