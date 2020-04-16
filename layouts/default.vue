<template>
  <v-app>
    <v-content>
      <Header :title="title" />
      <nuxt />
      <v-btn
        @click="toggleDark"
        color="#011638"
        class="night-button"
        dark
        small
        fixed
        bottom
        right
        fab
      >
        <v-icon v-if="$store.state.localConfig.isDark">flash_on</v-icon>
        <v-icon v-else>nights_stay</v-icon>
      </v-btn>
    </v-content>
  </v-app>
</template>

<script>
  import Header from '~/components/reusable/Header'

  export default {
    components: {
      Header
    },
    methods: {
      toggleDark() {
        this.$store.commit('changeLocalConfig', {
          isDark: !this.$store.state.localConfig.isDark
        })
      }
    },
    data() {
      return {
        title: 'Nightly Board'
      }
    },
    beforeMount() {
      const localConfig = JSON.parse(localStorage.getItem('localConfig'))

      if (localConfig) {
        this.$store.commit('changeLocalConfig', localConfig)
      }
    },
    head() {
      return {
        bodyAttrs: {
          class: this.$store.state.localConfig.isDark ? 'dark' : 'light'
        }
      }
    }
  }
</script>

<style lang="scss">
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.25s;
  }
  .page-enter,
  .page-leave-to {
    opacity: 0;
  }

  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  body {
    padding-top: 60px;
    transition: 0.4s ease-out;

    &.dark {
      background: $backgroundDark;

      #app.theme--light.application {
        background: $backgroundDark;
      }

      .night-button {
        background: $greyDark !important;
      }
    }
  }

  .night-button {
    @media screen and (max-width: 768px) {
      left: 20px;
      right: inherit;
    }
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  .button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
  }

  .button--green:hover {
    color: #fff;
    background-color: #3b8070;
  }

  .button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
  }

  .button--grey:hover {
    color: #fff;
    background-color: #35495e;
  }

  .container {
    padding: 0;
  }

  #app.theme--light.application {
    background: #f6f6f6;
    padding: 20px 0;
    transition: 0.4s ease-out;
  }

  h2 {
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    color: $primary;
    margin-bottom: 15px;

    @at-root .dark & {
      color: white;
    }
  }

  .icon-skipped {
    background: $skippedBg;
    font-weight: bold;
    line-height: 10px;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;

    svg {
      fill: $skipped;
      width: 10px;
      height: 10px;
    }
  }
</style>
