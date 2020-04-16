<template>
  <div class="reportDetails" v-resize="onResize">
    <sidebar v-if="!isMobile">
      <filters />
      <div class="separator"></div>

      <h2>Navigation</h2>
      <report-navigation-container
        v-if="report && report.suites_data && report.suites_data.length !== 0"
      >
        <report-navigation :items="report.suites_data" />

        <template v-if="!report.suites_data">
          <bullet-list-loader
            :speed="999"
            class="list-loader"
            :primary-color="
              $store.state.localConfig.isDark ? '#191A20' : '#f6f6f6'
            "
            :secondary-color="
              $store.state.localConfig.isDark ? '#191a20' : '#949494'
            "
          />
        </template>
      </report-navigation-container>
    </sidebar>

    <div class="center">
      <search />

      <p
        class="not-found"
        v-if="report && report.suites_data && report.suites_data.length <= 0"
      >
        No results found. Try another search ?
      </p>

      <suites :items="report.suites_data" v-if="report && report.suites_data" />
    </div>
    <template v-if="!report.suites_data">
      <bullet-list-loader
        :speed="10"
        class="list-loader"
        :primary-color="$store.state.localConfig.isDark ? '#191A20' : '#f6f6f6'"
        :secondary-color="
          $store.state.localConfig.isDark ? '#191a20' : '#949494'
        "
      />
    </template>

    <infos-bar>
      <h2 v-if="!isMobile">Infos</h2>
      <ul class="infos">
        <li>
          <v-icon size="16">local_offer</v-icon>
          {{ report.version }}
        </li>
        <li v-if="!isMobile">
          <v-icon size="16">timer</v-icon>
          {{ $moment.duration(report.duration).hours() }}h{{
            $moment.duration(report.duration).minutes()
          }}m{{ $moment.duration(report.duration).seconds() }}s
        </li>
        <li v-if="!isMobile">
          <v-icon size="16">library_books</v-icon>
          {{ report.suites }}
        </li>
        <li v-if="!isMobile">
          <v-icon size="16">assignment</v-icon>
          {{ report.tests }}
        </li>
        <li>
          <v-icon
            size="16"
            :color="$vuetify.theme.themes.light.color.green"
            class="icon-success"
          >
            check
          </v-icon>

          {{ report.passes }}
        </li>
        <li>
          <v-icon
            size="16"
            :color="$vuetify.theme.themes.light.color.red"
            class="icon-error"
          >
            close
          </v-icon>
          {{ report.failures }}
        </li>
        <li>
          <v-icon
            size="16"
            :color="$vuetify.theme.themes.light.color.blue"
            class="icon-pending"
          >
            pause
          </v-icon>
          {{ report.pending }}
        </li>
        <li>
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
          {{ report.skipped }}
        </li>
      </ul>
    </infos-bar>
  </div>
</template>

<script>
  import { BulletListLoader } from 'vue-content-loader'
  import Suites from '~/components/reusable/Suites'
  import Sidebar from '~/components/reusable/Sidebar'
  import InfosBar from '~/components/reusable/InfosBar'
  import ReportNavigation from '~/components/reusable/ReportNavigation'
  import Search from '~/components/reusable/Search'
  import Filters from '~/components/reusable/Filters'
  import ReportNavigationContainer from '~/components/container/ReportNavigationContainer'

  export default {
    components: {
      Suites,
      BulletListLoader,
      Sidebar,
      InfosBar,
      ReportNavigation,
      ReportNavigationContainer,
      Search,
      Filters
    },
    data() {
      return {
        isMobile: false
      }
    },
    computed: {
      report: {
        get() {
          if (!this.$store.state.report) {
            /* eslint-disable-next-line */
            this.$router.push('/')
          }

          return this.$store.state.report
        },
        set(value) {
          this.$store.commit('changeReport', {
            report: value
          })
        }
      }
    },
    validate({ params }) {
      // Must be a number
      return /^\d+$/.test(params.id)
    },
    methods: {
      onResize() {
        if (window.innerWidth < 769) {
          this.isMobile = true
        } else {
          this.isMobile = false
        }
      }
    },
    async mounted() {
      if (this.$store.state.localConfig) {
        Object.assign(this, this.$store.state.localConfig)
      }

      this.$store.commit('updateSearch', ``)

      this.$store.commit('getSuites', { params: this.$route.params })
    }
  }
</script>

<style lang="scss">
  .reportDetails {
    padding: 0 290px;
    padding-right: 210px;

    .not-found {
      color: $primary;
      font-size: 20px;
      font-weight: bold;
      text-align: center;

      @at-root .dark & {
        color: white;
      }
    }

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
        border: 1px solid #363636;
      }
    }

    .v-icon {
      width: 19px;
      height: 19px;
      border-radius: 50%;
      margin-right: 5px;
    }

    .infos {
      padding: 0;
      margin-bottom: 15px;

      i {
        color: #759299;
      }

      li {
        list-style-type: none;
        color: #363a41;
        font-weight: 14px;
        margin-bottom: 10px;
        font-size: 14px;

        @at-root .dark & {
          color: #a5a5a5;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .reportDetails {
      padding: 0 10px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column-reverse;

      .infosbar {
        position: initial;
        padding: 0;
        height: auto;
        top: initial;
        right: initial;
        max-width: inherit;

        .infos {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;

          .v-icon {
            font-size: 13px !important;
            width: 17px;
            height: 17px;
            margin-right: 0;
          }

          li {
            margin: 0 5px;
            color: #363a41;
            font-size: 12px;

            @at-root .dark & {
              color: white;
            }
          }
        }
      }
    }
  }
</style>
