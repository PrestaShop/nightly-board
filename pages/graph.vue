<template>
  <div class="graph" v-resize="onResize" :class="{ isMobile }">
    <div class="center">
      <top-bar v-if="params && params.periods">
        <template v-slot:left>
          <div class="select">
            <p class="select-label">{{ params.periods.name }}</p>
            <v-select
              :items="params.periods.values"
              label="Version"
              :value="params.periods.values[0]"
              append-icon="keyboard_arrow_down"
              @change="updateBranch"
              solo
            ></v-select>
          </div>
        </template>
        <template v-slot:right>
          <div class="select">
            <p class="select-label">{{ params.versions.name }}</p>
            <v-select
              :items="params.versions.values"
              label="Version"
              :value="params.versions.values[0]"
              append-icon="keyboard_arrow_down"
              @change="updateVersion"
              solo
            ></v-select>
          </div>
        </template>
      </top-bar>

      <div class="chart-container">
        <h2 class="chart-title">Tests statistics</h2>

        <div class="chart-container-inside">
          <Chart
            :chart-data="this.graphDatasets"
            :options="{
              maintainAspectRatio: false,
              animation: null,
              scales: {
                xAxes: [
                  {
                    stacked: true
                  }
                ],
                yAxes: [
                  {
                    stacked: true
                  }
                ]
              }
            }"
            :height="500"
          />
        </div>
      </div>
    </div>
    <template v-if="!graph">
      <bullet-list-loader
        :speed="2"
        class="list-loader"
        :primary-color="$store.state.localConfig.isDark ? '#191A20' : '#f6f6f6'"
        :secondary-color="
          $store.state.localConfig.isDark ? '#191a20' : '#949494'
        "
      />
    </template>
  </div>
</template>

<script>
  import { BulletListLoader } from 'vue-content-loader'
  import TopBar from '~/components/reusable/TopBar'
  import Chart from '~/components/reusable/Chart'
  import URLS from '~/constants/urls'

  export default {
    components: {
      BulletListLoader,
      TopBar,
      Chart
    },
    data() {
      return {
        graph: {},
        versions: [],
        params: {},
        graphDatasets: {},
        isMobile: false
      }
    },
    methods: {
      onResize() {
        if (window.innerWidth < 769) {
          this.isMobile = true
        } else {
          this.isMobile = false
        }
      },
      updateBranch(value) {
        this.$store.commit('toggleGraphFilter', {
          value: {
            period: value
          }
        })

        this.setDatasets()
      },
      updateVersion(value) {
        this.$store.commit('toggleGraphFilter', {
          value: {
            version: value
          }
        })

        this.setDatasets()
      },
      async setDatasets() {
        const { data } = await this.$axios.get(
          `${this.$store.state.env.domain}${URLS.graph}?period=${this.$store.state.graph.period}&version=${this.$store.state.graph.version}`,
          {
            crossdomain: true
          }
        )

        this.graph = data

        const failed = this.graph.map(e => e.failures)
        const succ = this.graph.map(e => e.passes)
        const pass = this.graph.map(e => e.pending)
        const skipped = this.graph.map(e => e.skipped)

        const labels = this.graph.map(e =>
          this.$moment(e.start_date).format('DD/MM/YYYY')
        )

        const failures = {
          label: 'Failed',
          backgroundColor: '#D33F2E',
          data: failed,
          order: 2
        }

        const success = {
          label: 'Success',
          backgroundColor: '#6EDF8D',
          data: succ,
          order: 1
        }

        const passed = {
          label: 'Paused',
          backgroundColor: '#6EDF8D',
          data: pass,
          order: 1
        }

        const skippedShip = {
          label: 'Skipped',
          backgroundColor: '#62bfb5',
          data: skipped,
          order: 1
        }

        this.graphDatasets = {
          labels,
          datasets: [failures, success, passed, skippedShip]
        }
      }
    },
    async mounted() {
      if (this.$store.state.localConfig) {
        Object.assign(this, this.$store.state.localConfig)
      }

      try {
        const { data } = await this.$axios.get(
          `${this.$store.state.env.domain}${URLS.graphParameters}`,
          {
            crossdomain: true
          }
        )

        this.params = data
        this.params.versions.values = this.params.versions.values.map(e => {
          return { text: e.name, value: e.value }
        })
        this.params.periods.values = this.params.periods.values.map(e => {
          return { text: e.name, value: e.value }
        })

        this.$store.commit('toggleGraphFilter', {
          value: {
            period: this.params.periods.default,
            version: this.params.versions.default
          }
        })
      } catch (error) {
        console.log(error)
      }

      try {
        this.setDatasets()
      } catch (error) {
        console.log(error)
      }
      this.$store.commit('changePageTitle', `Graph`)

      this.$store.commit('changeDate', {
        startDate: null,
        endDate: null
      })

      this.$store.commit('resetReport')
    }
  }
</script>

<style lang="scss">
  .chart-container {
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    padding: 15px;
    overflow: scroll;
    transition: 0.4s ease-out;

    @at-root .dark & {
      background-color: $greyDark;
    }

    &-inside {
      min-width: 700px;
    }
  }

  .chart-title {
    color: #011638;
    font-size: 20px;
    font-weight: bold;
    line-height: 27px;
    text-align: center;
    margin-bottom: 20px;
  }

  .graph {
    padding: 0 50px;

    .icon-success {
      background: #c1f4d1;
    }
    .icon-error {
      background: #fbc6c3;
    }
    .icon-pending {
      background: #beeaf3;
    }

    .v-icon {
      width: 19px;
      height: 19px;
      border-radius: 50%;
      margin-right: 5px;
    }

    .select {
      display: flex;
      align-items: flex-start;

      &-label {
        margin: 0;
        margin-right: 10px;
        margin-top: 8px;
        color: #363a41;
        font-size: 14px;
        line-height: 19px;

        @at-root .dark & {
          color: white;
        }
      }

      .v-input {
        width: 200px;

        .v-icon {
          color: #363a41;
          font-size: 18px;

          @at-root .dark & {
            color: white;
          }
        }

        &__slot {
          border: 1px solid #b7ced3;
          border-radius: 4px 4px 0 0;
          background-color: #ffffff;
          min-height: initial;
          box-shadow: none !important;
          border-radius: 4px !important;

          @at-root .dark & {
            border: 1px solid lighten($greyDark, 7%);
            background: $greyDark;
          }
        }

        .v-select {
          &__selection {
            color: #363a41;
            font-family: 'Open Sans';
            font-size: 14px;
            line-height: 19px;

            @at-root .dark & {
              color: white;
            }
          }
        }
      }
    }
  }

  .v-menu__content {
    border-radius: 4px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    background-color: #f0fcfd;
    border: 1px solid #b7ced3;

    @at-root .dark & {
      border: 1px solid lighten($greyDark, 7%);
      background-color: $greyDark !important;
    }

    .v-list {
      padding: 0;

      @at-root .dark & {
        background-color: $greyDark !important;
      }

      > div {
        &:not(:first-child) {
          border-top: 1px solid #b7ced3;

          @at-root .dark & {
            border-top: 1px solid lighten($greyDark, 7%);
          }
        }
      }

      &__tile {
        height: 37px;

        &:hover {
          background-color: #f0fcfd !important;

          @at-root .dark & {
            background-color: lighten($greyDark, 7%) !important;
          }
        }
      }

      &__tile__title {
        color: #011640;
        font-size: 14px;
        font-weight: 600;

        @at-root .dark & {
          color: white;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .graph {
      padding: 10px;

      .select {
        flex-wrap: wrap;
        padding: 0 5px;

        .v-input {
          width: 100%;
        }

        &-label {
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
