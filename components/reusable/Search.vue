<template>
  <div class="search">
    <input
      type="text"
      name="search"
      id="search"
      placeholder="Rechercher"
      v-model="search"
    />

    <div class="icon">
      <v-icon size="22" color="#759299">
        search
      </v-icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Search',
    data() {
      return {
        timeoutId: null
      }
    },
    methods: {
      debounce(search, debounceDuration = 300) {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId)
        }
        this.timeoutId = setTimeout(() => {
          this.$store.commit('updateSearch', search)

          this.$store.commit('getSuites', { params: this.$route.params })
        }, debounceDuration)
      }
    },
    computed: {
      search: {
        get() {
          return this.$store.state.search
        },
        set(value) {
          this.debounce(value, 500)
        }
      }
    }
  }
</script>

<style lang="scss">
  .search {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 33px;
    margin-bottom: 20px;

    @media screen and (max-width: 768px) {
      padding: 0 10px;
    }

    input {
      box-sizing: border-box;
      max-width: 425px;
      width: 100%;
      height: 100%;
      border: 1px solid #b3c7cd;
      border-radius: 4px;
      background-color: #ffffff;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
      padding: 0 10px;
      font-size: 14px;

      @at-root .dark & {
        background-color: $greyDark;
        border: 1px solid lighten($greyDark, 5%);
        border-right: 0;
        color: white;
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 49px;
      border: 1px solid #b3c7cd;
      border-radius: 0 3px 3px 0;
      background-color: #f6f6f6;

      @at-root .dark & {
        background-color: transparent;
        border: 1px solid lighten($greyDark, 5%);

        .v-icon {
          color: white !important;
        }
      }

      .v-icon {
        margin-right: 0;
      }
    }
  }
</style>
