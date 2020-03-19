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

      <div class="filter">
        <div class="filter-label">
          <div class="icon-skipped">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="44px"
              height="44px"
              viewBox="0 0 44 44"
              enable-background="new 0 0 44 44"
              xml:space="preserve"
            >
              <g>
                <path d="M27,29H17V0h10V29z M27,44H17v-8h10V44z" />
              </g>
            </svg>
          </div>
          <span>Show Skipped</span>
        </div>
        <v-switch v-model="isShowSkipped" class="ma-2"></v-switch>
      </div>
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
      isShowSkipped: {
        get() {
          return this.$store.state.localConfig.isShowSkipped
        },
        set(value) {
          this.$store.commit('changeLocalConfig', {
            isShowSkipped: value
          })

          this.$store.commit('getSuites', {
            params: this.$route.params
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .icon-skipped {
    background: #daf2f0;
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
      width: 14px;
      height: 14px;
    }
  }

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
      border-top: 1px solid #e1e7e9;
      margin-left: -19px;
      width: calc(100% + 38px);
      margin-top: 5px;
      margin-bottom: 15px;

      @at-root .dark & {
        border-top: 1px solid #363636;
      }
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

      &-label {
        @at-root .dark & {
          color: darken(white, 25%);
        }
      }

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
          opacity: 0.4s ease-out;

          @at-root .dark & {
            background-color: lighten($greyDark, 7%);
          }
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
