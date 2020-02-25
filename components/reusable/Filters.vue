<template>
  <div class="filters">
    <h2 @click="$emit('titleclick')" :class="{ toggle: isResponsive }">
      Filters
      <v-icon v-if="showFilters && isResponsive">keyboard_arrow_down</v-icon>
      <v-icon v-if="!showFilters && isResponsive">keyboard_arrow_up</v-icon>
    </h2>

    <div class="filters-childs" v-if="!isResponsive || showFilters">
      <div class="filter">
        <div class="filter-label">
          <v-icon
            size="16"
            :color="$vuetify.theme.themes.light.color.green"
            class="icon-success"
          >
            check
          </v-icon>
          <span>Show Passed</span>
        </div>
        <v-switch v-model="isShowSuccess" class="ma-2"></v-switch>
      </div>
      <div class="filter">
        <div class="filter-label">
          <v-icon
            size="16"
            :color="$vuetify.theme.themes.light.color.red"
            class="icon-error"
          >
            close
          </v-icon>
          <span>Show Failed</span>
        </div>
        <v-switch v-model="isShowFailed" class="ma-2"></v-switch>
      </div>
      <div class="filter">
        <div class="filter-label">
          <v-icon
            size="16"
            :color="$vuetify.theme.themes.light.color.blue"
            class="icon-pending"
          >
            pause
          </v-icon>
          <span>Show Pending</span>
        </div>
        <v-switch v-model="isShowPending" class="ma-2"></v-switch>
      </div>
      <!-- <div class="filter">
        <div class="filter-label">
          <v-icon size="16" color="#B3C7CD">
            nights_stay
          </v-icon>
          <span>Dark mode</span>
        </div>
        <v-switch v-model="isDark" class="ma-2"></v-switch>
      </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {}
    },
    props: {
      showFilters: {
        default: true,
        type: Boolean
      },
      isResponsive: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isShowSuccess: {
        get() {
          return this.$store.state.localConfig.isShowSuccess
        },
        set(value) {
          this.$store.commit('changeLocalConfig', {
            isShowSuccess: value
          })

          this.$store.commit('getSuites', {
            params: this.$route.params
          })
        }
      },
      isShowFailed: {
        get() {
          return this.$store.state.localConfig.isShowFailed
        },
        set(value) {
          this.$store.commit('changeLocalConfig', {
            isShowFailed: value
          })

          this.$store.commit('getSuites', {
            params: this.$route.params
          })
        }
      },
      isShowPending: {
        get() {
          return this.$store.state.localConfig.isShowPending
        },
        set(value) {
          this.$store.commit('changeLocalConfig', {
            isShowPending: value
          })

          this.$store.commit('getSuites', {
            params: this.$route.params
          })
        }
      },
      isDark: {
        get() {
          return this.$store.state.localConfig.isDark
        },
        set(value) {
          this.$store.commit('changeLocalConfig', {
            isDark: value
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .filters {
    .icon-success {
      background: #c1f4d1;
    }
    .icon-error {
      background: #fbc6c3;
    }
    .icon-pending {
      background: #beeaf3;
    }

    .separator {
      height: 1px;
      border: 1px solid #e1e7e9;
      margin-left: -19px;
      width: calc(100% + 38px);
      margin-top: 5px;
      margin-bottom: 15px;
    }

    .v-icon {
      width: 19px;
      height: 19px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .filter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      .v-messages {
        display: none;
      }

      .v-input {
        flex: 0 0 auto;
        margin: 0 !important;
        padding-top: 0;
        height: 28px;

        input[type='checkbox']:checked ~ .v-input--switch__track {
          background-color: #53d572;
        }

        &--selection-controls__input {
          margin-right: 0;
        }

        &--switch.v-input--is-dirty .v-input--switch__thumb {
          transform: translate(15px, 0);
        }

        &--selection-controls__ripple {
          display: none;
        }

        &--switch__track {
          height: 19px;
          width: 35px;
          border-radius: 1000px;
          opacity: 1;
          background-color: $lowgray;
        }

        &--switch__thumb {
          height: 15.2px;
          width: 15.56px;
          background-color: #ffffff;
          top: calc(50% - 5px);
          left: 4px;
          box-shadow: none;
        }
      }

      .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
        margin-bottom: 0;
      }
    }
  }
</style>
