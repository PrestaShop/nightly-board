<template>
  <v-app>
    <v-content>
      <Header :title="title" />
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  import Header from '~/components/reusable/Header'

  export default {
    components: {
      Header
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
    }
  }
</script>

<style lang="scss">
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
  }

  h2 {
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    color: $primary;
    margin-bottom: 15px;
  }
</style>
