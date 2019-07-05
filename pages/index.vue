<template>
  <v-container fluid>
    <ps-logo />

    <div class="files">
      <v-data-table
        :items="files"
        :headers="headers"
        :pagination.sync="pagination"
      >
        <template v-slot:no-data>
          <v-alert
            :value="true"
            :color="color.error"
            icon="warning"
          >
            Sorry, nothing to display here :(
          </v-alert>
        </template>

        <template
          slot="items"
          slot-scope="props"
        >
          <tr :class="getRowClass(props)">
            <td>
              <template v-if="props.item.stats">
                <v-icon
                  :color="color.error"
                  v-if="hasErrors(props)"
                >
                  warning
                </v-icon>
                <v-icon
                  :color="color.success"
                  v-else
                >
                  check
                </v-icon>
              </template>
            </td>
            <td>{{ props.item.date }}</td>
            <td>{{ props.item.version }}</td>
            <td>{{ props.item.branch }}</td>
            <td align="center">
              <template v-if="props.item.stats">
                <v-chip
                  :color="color.primary"
                  text-color="white"
                >
                  <strong>
                    {{ props.item.stats.passes }}
                    /
                    {{ props.item.stats.tests }}
                  </strong>
                </v-chip>
              </template>
            </td>
            <td align="center">
              <template v-if="props.item.stats">
                <v-chip
                  :color="color.error"
                  text-color="white"
                  v-if="hasErrors(props)"
                >
                  <strong>
                    {{ props.item.stats.failures }}
                  </strong>
                </v-chip>
                <v-chip
                  :color="color.success"
                  text-color="white"
                  v-else
                >
                  <strong>0</strong>
                </v-chip>
              </template>
            </td>
            <td class="download-reports">
              <a
                :href="downloadLink(props.item, props.index)"
                target="_blank"
                :class="{'lg-and-up': !$vuetify.breakpoint.lgAndUp}"
              >
                <template v-if="$vuetify.breakpoint.lgAndUp">
                  Download
                </template>
                <template v-else>
                  <v-icon
                    right
                  >
                    save_alt
                  </v-icon>
                </template>
              </a>

              <a
                :href="detailsLink(props.item, props.index)"
                target="_blank"
                v-if="props.item.stats"
                :class="{'lg-and-up': !$vuetify.breakpoint.lgAndUp}"
              >
                <template v-if="$vuetify.breakpoint.lgAndUp">
                  View Report
                </template>
                <template v-else>
                  <v-icon>
                    visibility
                  </v-icon>
                </template>
              </a>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
  import PsLogo from '~/components/Logo.vue';

  const STORAGE_URL_API = 'https://www.googleapis.com/storage/v1/b/prestashop-core-nightly/o';
  const STORAGE_URL = 'https://storage.googleapis.com/prestashop-core-nightly';

  export default {
    components: {
      PsLogo,
    },
    data() {
      return {
        ignoredBranches: ['1.7.6.x'],
        color: {
          primary: '#251B5B',
          error: '#F44336',
          success: '#58C85D',
        },
        data: {},
        files: [],
        pagination: {
          descending: true,
          page: 1,
          rowsPerPage: -1,
          sortBy: 'date',
        },
        headers: [
          {
            value: 'icons',
            sortable: false,
            width: 40,
          },
          {
            value: 'date',
            text: 'Date',
            width: 250,
          },
          {
            value: 'version',
            text: 'Version',
            width: 150,
          },
          {
            value: 'branch',
            text: 'Branch',
          },
          {
            value: 'stats',
            text: 'Total passes / total tests',
            sortable: false,
            align: 'center',
            width: 250,
          },
          {
            value: 'stats.failures',
            text: 'Tests failures',
            sortable: false,
            align: 'center',
            width: 150,
          },
          {
            value: 'actions',
            sortable: false,
            width: 250,
          },
        ],
      };
    },
    async mounted() {
      const regex = new RegExp(/^(\d{4}-\d{2}-\d{2})-(.*)-prestashop_(.*)\.zip$/i);
      const {data} = await this.$axios.get(STORAGE_URL_API);
      this.data = data;
      this.data.items.forEach(async (file) => {
        // Yeah it is a nightly build
        const matches = file.name.match(regex);
        if (matches) {
          this.files.push({
            name: file.name,
            date: matches[1],
            branch: matches[2],
            version: matches[3],
            stats: this.ignoredBranches.includes(matches[2]) ? null : await this.getStats(`${matches[1]}-${matches[2]}-stats.json`),
            file,
          });
        }
      });

      this.pagination.rowsPerPage = this.$vuetify.breakpoint.lgAndUp ? -1 : 5;
    },
    methods: {
      /**
       * Check if report has errors
       */
      hasErrors(props) {
        return props.item.stats.errors !== 0;
      },
      /**
       * Get data table row class
       */
      getRowClass(props) {
        if (props.item.stats === null) {
          return '';
        }

        if (this.hasErrors(props)) {
          return 'error';
        }

        return 'success';
      },
      /**
       * Find report file by name
       */
      findReportFileByName(name) {
        const lookingForName = `reports/${name}`;
        return this.data.items.find(file => file.name === lookingForName);
      },
      /**
       * Get stats for a specific report
       */
      async getStats(name) {
        const file = this.findReportFileByName(name);
        if (file === undefined) {
          return null;
        }

        const {data} = await this.$axios.get(file.mediaLink);
        return data;
      },
      /**
       * Details link
       */
      detailsLink(item) {
        const file = this.findReportFileByName(`${item.date}-${item.branch}.html`);
        if (file === undefined) {
          return null;
        }

        return `${STORAGE_URL}/${file.name}`;
      },
      /**
       * Link to download archive
       */
      downloadLink(item) {
        return `${STORAGE_URL}/${item.name}`;
      },
    },
  };
</script>

<style lang="scss">
  $primary: #251B5B;

  .container {
    padding: 24px 0;
  }

  .files {
    padding-top: 15px;
  }

  .theme--light.v-table,
  table.v-table {
    thead {
      th {
        background-color: $primary;
      }
    }
    tbody {
      tr {
        &:not(:last-child) {
          border: none;
        }
        &.error {
          background-color: rgba(244, 67, 54, .1) !important;
          border: none;
          &:hover {
            background-color: rgba(244, 67, 54, .2) !important;
          }
        }
        &.success {
          background-color: rgba(88, 200, 93, .1)  !important;
          border: none;
          &:hover {
            background-color: rgba(88, 200, 93, .2) !important;
          }
        }

        td {
          color: $primary;
          font-family: "Open Sans";
          font-size: 14px;
          font-weight:bold;
          line-height: 60px;
          white-space: nowrap;

          a {
            color: $primary;
            font-size: 14px;
            display: inline-block;
            &:first-child {
              margin-right: 20px;
            }
            &:hover {
              font-weight: normal;
            }
            &.lg-and-up {
              text-decoration: none;
            }
          }
          &.download-reports {
            .v-icon {
              &:hover {
                color: $primary;
              }
              &:first-child {
                margin-right: 20px;
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
    color: #fff;
    font-family: "Open Sans";
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 0.94px;
    line-height: 20px;
  }

  .theme--light.v-datatable thead th.column.sortable .v-icon,
  .theme--light.v-datatable thead th.column.sortable.active .v-icon {
    color: #fff;
  }
</style>
