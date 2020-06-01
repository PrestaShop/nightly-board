<template>
  <v-layout v-resize="onResize">
    <top-bar>
      <template v-slot:left>
        <div class="select">
          <p class="select-label">Campaign</p>
          <v-select
            :items="['sanity', 'functional', 'e2e', 'regression']"
            label="All"
            :value="['sanity', 'functional', 'e2e', 'regression']"
            append-icon="keyboard_arrow_down"
            @change="updateBranch"
            solo
          ></v-select>
        </div>
        <div class="select">
          <p class="select-label">Browser</p>
          <v-select
            :items="['chromium', 'edge', 'firefox']"
            label="All"
            :value="['chromium', 'edge', 'firefox']"
            append-icon="keyboard_arrow_down"
            @change="updateBranch"
            solo
          ></v-select>
        </div>
        <div class="select">
          <p class="select-label">Version</p>
          <v-select
            :items="['develop', '1.7.7.x']"
            label="All"
            :value="['develop', '1.7.7.x']"
            append-icon="keyboard_arrow_down"
            @change="updateBranch"
            solo
          ></v-select>
        </div>
      </template>
    </top-bar>

    <v-container class="container-home" :class="{ isMobile: isMobile }">
      <div class="files">
        <div class="mobile-line mobile-head" v-if="isMobile">
          <div class="mobile-line-left"></div>
          <div class="mobile-line-right"><p>Infos</p></div>
        </div>
        <v-data-table
          :items="files"
          :headers="isMobile ? [] : headers"
          :pagination.sync="pagination"
          :rows-per-page-items="[20, 50, { text: 'All', value: -1 }]"
          :footer-props="{
            showFirstLastPage: true,
            firstIcon: 'mdi-arrow-collapse-left',
            lastIcon: 'mdi-arrow-collapse-right',
            prevIcon: 'mdi-minus',
            nextIcon: 'mdi-plus'
          }"
        >
          <template v-slot:no-data>
            <content-loader
              :speed="0.8"
              class="list-loader"
              :primary-color="
                $store.state.localConfig.isDark ? '#191A20' : '#dedede'
              "
              :secondary-color="
                $store.state.localConfig.isDark ? '#31333f' : '#bdbdbd'
              "
            >
              <rect x="0" y="0" rx="3" ry="3" width="100%" height="10" />
              <rect x="0" y="20" rx="3" ry="3" width="100%" height="10" />
              <rect x="0" y="40" rx="3" ry="3" width="100%" height="10" />
              <rect x="0" y="60" rx="3" ry="3" width="100%" height="10" />
              <rect x="0" y="80" rx="3" ry="3" width="100%" height="10" />
              <rect x="0" y="100" rx="3" ry="3" width="100%" height="10" />
              <rect x="0" y="120" rx="3" ry="3" width="100%" height="10" />
            </content-loader>
          </template>

          <template slot="items" slot-scope="props">
            <tr v-if="!isMobile">
              <td>
                <nuxt-link
                  :to="'/report/' + props.item.id"
                  v-if="props.item.suites"
                  :class="{ 'lg-and-up': !$vuetify.breakpoint.lgAndUp }"
                >
                  <template>
                    <v-icon size="19">visibility</v-icon>
                  </template>
                </nuxt-link>
                <p class="lowdisplay" v-else>
                  No tests found
                </p>
              </td>
              <td>
                <template v-if="props.suites">
                  <v-icon
                    :color="$vuetify.theme.themes.light.color.red"
                    v-if="hasErrors(props)"
                  >
                    warning
                  </v-icon>
                  <v-icon
                    :color="$vuetify.theme.themes.light.color.green"
                    v-else
                  >
                    check
                  </v-icon>
                </template>
              </td>
              <td :class="{ lowdisplay: !props.item.suites }">
                {{ props.item.date }}
              </td>
              <td class="version" :class="{ lowdisplay: !props.item.suites }">
                {{ props.item.version }}
              </td>
              <td :class="{ lowdisplay: !props.item.suites }" class="campaign">
                {{ props.item.campaign }}
              </td>
              <td>
                <template v-if="props.item.duration">
                  {{ $moment(props.item.start_date).format('LTS') }} -
                  {{ $moment(props.item.end_date).format('LTS') }}
                  ({{ $moment.utc(props.item.duration).format('H') }}h{{
                    $moment.utc(props.item.duration).format('mm')
                  }}m{{ $moment.utc(props.item.duration).format('ss') }}s)
                </template>
              </td>
              <td class="browser">
                <font-awesome-icon
                  v-if="props.item.browser === 'firefox'"
                  :icon="['fab', 'firefox']"
                  :style="{ fontSize: '19px', color: '#6E939A' }"
                />
                <font-awesome-icon
                  v-if="props.item.browser === 'edge'"
                  :icon="['fab', 'edge']"
                  :style="{ fontSize: '19px', color: '#6E939A' }"
                />
                <font-awesome-icon
                  v-if="props.item.browser === 'chromium'"
                  :icon="['fab', 'chrome']"
                  :style="{ fontSize: '19px', color: '#6E939A' }"
                />
              </td>
              <td class="no-padding">
                <template
                  v-if="props.item.suites && props.item.tests.passed !== 0"
                >
                  <v-chip
                    color="transparent"
                    :text-color="$vuetify.theme.themes.light.color.green"
                    class="success-chip"
                  >
                    <v-icon
                      size="15"
                      :color="$vuetify.theme.themes.light.color.green"
                    >
                      check
                    </v-icon>
                    <strong>
                      {{ props.item.tests.passed }}
                    </strong>
                  </v-chip>
                </template>

                <template
                  v-if="props.item.tests && props.item.tests.failed !== 0"
                >
                  <v-chip
                    color="transparent"
                    v-if="hasErrors(props)"
                    class="failed-chip"
                    :text-color="$vuetify.theme.themes.light.color.red"
                  >
                    <v-icon
                      size="15"
                      :color="$vuetify.theme.themes.light.color.red"
                    >
                      close
                    </v-icon>
                    <strong>
                      {{ props.item.tests.failed }}
                    </strong>
                  </v-chip>
                </template>

                <template
                  v-if="props.item.tests && props.item.tests.pending !== 0"
                >
                  <v-chip
                    color="transparent"
                    v-if="hasPendings(props)"
                    class="pending-chip"
                    :text-color="$vuetify.theme.themes.light.color.blue"
                  >
                    <v-icon
                      size="15"
                      :color="$vuetify.theme.themes.light.color.blue"
                    >
                      pause
                    </v-icon>
                    <strong>
                      {{ props.item.tests.pending }}
                    </strong>
                  </v-chip>
                </template>

                <template
                  v-if="props.item.tests && props.item.tests.skipped !== 0"
                >
                  <v-chip
                    color="transparent"
                    class="skipped-chip"
                    :text-color="$vuetify.theme.themes.light.color.skipped"
                  >
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
                    <strong>
                      {{ props.item.tests.skipped }}
                    </strong>
                  </v-chip>
                </template>
              </td>
              <td class="variance">
                <div class="variance-item">
                  <p class="variance-text">{{ props.item.fixed_since_last }}</p>
                </div>
                <div class="variance-item">
                  <p class="variance-text">{{ props.item.equal_since_last }}</p>
                </div>
                <div class="variance-item">
                  <p class="variance-text">
                    {{ props.item.broken_since_last }}
                  </p>
                </div>
              </td>
              <td class="download-reports">
                <a
                  :href="props.item.download"
                  target="_blank"
                  :class="{ 'lg-and-up': !$vuetify.breakpoint.lgAndUp }"
                >
                  <template v-if="$vuetify.breakpoint.lgAndUp">
                    <v-icon size="19">cloud_download</v-icon>
                  </template>
                  <template v-else>
                    <v-icon right>
                      cloud_download
                    </v-icon>
                  </template>
                </a>
              </td>
            </tr>
            <tr class="mobile-line" v-if="isMobile">
              <td>
                <div class="mobile-line-left">
                  <nuxt-link
                    :to="'/report/' + props.item.id"
                    v-if="props.item.suites"
                    :class="{ 'lg-and-up': !$vuetify.breakpoint.lgAndUp }"
                  >
                    <template>
                      <v-icon size="19">visibility</v-icon>
                    </template>
                  </nuxt-link>
                </div>
                <div class="mobile-line-right">
                  <ul>
                    <li>{{ props.item.date }}</li>
                    <li>{{ props.item.version }}</li>
                    <li v-if="props.item.duration">
                      ({{ $moment.utc(props.item.duration).format('H') }}h{{
                        $moment.utc(props.item.duration).format('mm')
                      }}m{{ $moment.utc(props.item.duration).format('ss') }}s)
                    </li>
                    <li>
                      <template
                        v-if="
                          props.item.suites && props.item.tests.passed !== 0
                        "
                      >
                        <v-chip
                          color="transparent"
                          :text-color="$vuetify.theme.themes.light.color.green"
                          class="success-chip"
                        >
                          <v-icon
                            size="15"
                            :color="$vuetify.theme.themes.light.color.green"
                          >
                            check
                          </v-icon>
                          <strong>
                            {{ props.item.tests.passed }}
                          </strong>
                        </v-chip>
                      </template>

                      <template
                        v-if="props.item.tests && props.item.tests.failed !== 0"
                      >
                        <v-chip
                          color="transparent"
                          v-if="hasErrors(props)"
                          class="failed-chip"
                          :text-color="$vuetify.theme.themes.light.color.red"
                        >
                          <v-icon
                            size="15"
                            :color="$vuetify.theme.themes.light.color.red"
                          >
                            close
                          </v-icon>
                          <strong>
                            {{ props.item.tests.failed }}
                          </strong>
                        </v-chip>
                      </template>

                      <template
                        v-if="
                          props.item.tests && props.item.tests.pending !== 0
                        "
                      >
                        <v-chip
                          color="transparent"
                          v-if="hasPendings(props)"
                          class="pending-chip"
                          :text-color="$vuetify.theme.themes.light.color.blue"
                        >
                          <v-icon
                            size="15"
                            :color="$vuetify.theme.themes.light.color.blue"
                          >
                            pause
                          </v-icon>
                          <strong>
                            {{ props.item.tests.pending }}
                          </strong>
                        </v-chip>
                      </template>

                      <template
                        v-if="
                          props.item.tests && props.item.tests.skipped !== 0
                        "
                      >
                        <v-chip
                          color="transparent"
                          class="skipped-chip"
                          :text-color="
                            $vuetify.theme.themes.light.color.skipped
                          "
                        >
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
                                <path
                                  d="M27,29H17V0h10V29z M27,44H17v-8h10V44z"
                                />
                              </g>
                            </svg>
                          </div>
                          <strong>
                            {{ props.item.tests.skipped }}
                          </strong>
                        </v-chip>
                      </template>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-container>
  </v-layout>
</template>

<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { ContentLoader } from 'vue-content-loader'
  import URLS from '~/constants/urls'
  import TopBar from '~/components/reusable/TopBar'

  export default {
    components: {
      ContentLoader,
      FontAwesomeIcon,
      TopBar
    },
    computed: {
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
    },
    data() {
      return {
        ignoredBranches: [],
        data: {},
        isMobile: false,
        files: [],
        pagination: {
          descending: true,
          page: 1,
          rowsPerPage: 20,
          sortBy: 'date'
        },
        headers: [
          {
            value: 'show',
            text: 'View report',
            sortable: false,
            width: 100
          },
          {
            value: 'icons',
            sortable: false,
            width: 40
          },
          {
            value: 'date',
            text: 'Date',
            width: 250
          },
          {
            value: 'version',
            text: 'Version',
            width: 150
          },
          {
            value: 'campaign',
            text: 'Campaign',
            width: 150
          },
          {
            value: 'duration',
            text: 'Duration',
            width: 200
          },
          {
            value: 'stats',
            text: 'Browser',
            sortable: false,
            width: 100
          },
          {
            value: 'stats',
            text: 'Content',
            sortable: false,
            width: 200
          },
          {
            value: 'variance',
            text: 'Variance',
            sortable: false,
            width: 200
          },
          {
            value: 'actions',
            text: 'Download build',
            sortable: false,
            width: 150
          }
        ]
      }
    },
    async mounted() {
      const { data } = await this.$axios.get(
        `${this.$store.state.env.domain}${URLS.reports}`,
        {
          crossdomain: true
        }
      )

      if (this.isMobile) {
        this.files = data.filter(e => e.id)
      } else {
        this.files = data
      }

      this.$store.commit('resetReport')
      this.$store.commit('changePageTitle', 'Nightly reports')
    },
    methods: {
      onResize() {
        if (window.innerWidth < 769) {
          this.isMobile = true
        } else {
          this.isMobile = false
        }
      },
      /**
       * Check if report has errors
       */
      hasErrors(props) {
        return props.item.tests.failed !== 0
      },
      /**
       * Check if report has errors
       */
      hasPendings(props) {
        return props.item.tests.pending !== 0
      },
      hasSkipped(props) {
        return props.item.tests.skipped !== 0
      },
      /**
       * Get stats for a specific report
       */
      async getStats(name) {
        const file = this.findReportFileByName(name)
        if (file === undefined) {
          return null
        }

        const { data } = await this.$axios.get(file.mediaLink)
        return data
      }
    }
  }
</script>

<style lang="scss">
  @mixin showLink {
    color: #464b54;
    font-family: 'Open Sans';
    font-size: 14px;
    line-height: 19px;
    font-weight: normal;
    text-decoration: none;
    padding: 0 5px;
    font-weight: 600;
    transition: 0.4s ease-out;

    @at-root .dark & {
      &,
      i {
        color: #a5a5a5;
      }

      &:hover {
        &,
        i {
          color: darken(white, 7%);
        }
      }
    }

    i {
      transition: 0.4s ease-out;
    }

    &:hover {
      color: $primary;
      padding-right: 0;

      i {
        color: $primary;
      }

      span {
        text-decoration: underline;
      }
    }
  }

  .layout {
    flex-direction: column;

    .select {
      display: flex;
      align-items: flex-start;

      label {
        color: #363a41;

        @at-root .dark & {
          color: white;
        }
      }

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

        .v-icon,
        .v-icon.primary--text {
          color: #363a41 !important;
          font-size: 18px;

          @at-root .dark & {
            color: white !important;
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

  .lowdisplay {
    opacity: 0.5;
    margin: 0;
  }

  .mobile {
    &-line {
      display: flex;
      border-bottom: 1px solid darken(white, 5%);

      @at-root .dark & {
        border-bottom: 1px solid #363636;
      }

      &-left {
        width: 40%;
      }

      &-right {
        width: 60%;

        p {
          color: $primary;
          font-size: 14px;
          font-weight: bold;
          margin: 10px 0;

          @at-root .dark & {
            color: white;
          }
        }
      }
    }
  }

  .dark .theme--light.v-table.v-datatable {
    .v-datatable__actions,
    & {
      background-color: $greyDark;

      &,
      .v-icon,
      .v-select__selection,
      .v-input {
        color: white !important;
      }
    }
  }

  .theme--light.v-table,
  table.v-table {
    transition: 0.4s ease-out;

    thead {
      th.text-xs-left {
        text-align: center !important;
      }
    }

    .list-loader {
      margin: 20px 0;
    }

    .v-datatable__actions {
      transition: 0.4s ease-out;
    }

    tbody {
      .mobile {
        &-line {
          &:not(:last-child) {
            border-bottom: 1px solid darken(white, 5%);

            @at-root .dark & {
              border-bottom: 1px solid #363636;
            }
          }

          td {
            display: flex;
            height: auto !important;
            padding: 10px;
            width: 100%;
          }

          &-left {
            width: 40%;
            a {
              @include showLink;
            }
          }

          &-right {
            width: 60%;

            ul {
              padding-left: 0;

              li {
                list-style-type: none;
                span {
                  margin-top: 0;
                  margin-bottom: 0;

                  &:last-child {
                    margin-right: 0;
                  }
                }

                &:not(:last-child) {
                  margin-bottom: 10px;
                }
              }
            }
          }
        }
      }

      tr {
        &:hover:not(.v-datatable__expand-row) {
          background: none;
        }
        &:not(:last-child) {
          border: none;
        }

        &:first-child {
          border-color: rgba(0, 0, 0, 0.12);
        }

        td {
          color: #464b54;
          font-family: 'Open Sans';
          font-size: 14px;
          line-height: 19px;
          font-weight: normal;
          white-space: nowrap;
          text-align: center;

          &.variance {
            display: flex;
            align-items: center;
            justify-content: center;

            .variance-item {
              margin: 0 7.5px;
            }

            .variance-text {
              color: #464b54;
              font-size: 14px;
              font-weight: bold;
              line-height: 19px;
              margin-bottom: 0;

              @at-root .dark & {
                color: white;
              }
            }
          }

          &.browser {
            @at-root .dark & {
              svg {
                color: white !important;
              }
            }
          }

          &.version,
          &.campaign {
            font-weight: 700;
          }

          &:first-child {
            .v-icon {
              color: #6e939a;
            }
          }

          &.no-padding {
            padding: 0;
          }

          @at-root .dark & {
            color: white;
          }

          .v-chip {
            margin-right: 15px;
            margin-left: 0;

            .v-chip__content {
              padding: 0;
            }

            .icon-skipped {
              @at-root .dark & svg {
                fill: $greyDark !important;
              }
            }
            i {
              width: 19px;
              height: 19px;
              border-radius: 50%;
              margin-right: 5px;

              @at-root .dark &.v-icon {
                color: $greyDark !important;
              }
            }

            &.success-chip i {
              background: #c1f4d1;
            }
            &.failed-chip i {
              background: #fbc6c3;
            }
            &.pending-chip i {
              background: #beeaf3;
            }

            &.skipped-chip {
              @at-root .dark & {
                color: $skippedBg !important;
              }
            }
          }
          a {
            @include showLink;
          }
          &.download-reports {
            .v-icon {
              &:hover {
                color: $primary;
              }
            }
          }
        }
      }
    }
  }

  .theme--light.v-table thead th,
  .theme--light.v-datatable thead th.column.sortable:hover,
  .theme--light.v-datatable thead th.column.sortable.active {
    color: $primary;
    font-family: 'Open Sans';
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;

    @at-root .dark & {
      color: white;
    }
  }

  .theme--light.v-datatable thead th.column.sortable .v-icon,
  .theme--light.v-datatable thead th.column.sortable.active .v-icon {
    color: $primary;

    @at-root .dark & {
      color: white;
    }
  }

  .layout {
    padding: 0 30px;
  }

  .container-home {
    width: calc(100% - 10px);
    max-width: 100%;
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    background: $white;
    overflow: hidden;

    &.isMobile {
      margin: 0 10px;

      thead {
        display: none;
      }
    }

    @at-root .dark & {
      background: $greyDark;
    }
  }
</style>
