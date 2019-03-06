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
                  right
                  v-if="props.item.stats.errors !== 0"
                >
                  warning
                </v-icon>
                <v-icon
                  :color="color.success"
                  right
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
                >
                  <strong>
                    {{ props.item.stats.failures }}
                  </strong>
                </v-chip>
              </template>
            </td>
            <td>
              <a
                href="#"
                @click.stop="download(props.item, props.index)"
              >
                Download
              </a>
              <a
                href="#"
                @click.stop="details(props.item, props.index)"
                v-if="props.item.stats"
              >
                View Report
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
            stats: await this.getStats(`${matches[1]}-${matches[2]}-stats.json`),
            file,
          });
        }
      });
    },
    methods: {
      getRowClass(props) {
        if (props.item.stats === null) {
          return '';
        }

        if (props.item.stats.errors !== 0) {
          return 'error';
        }

        return 'success';
      },
      findReportFileByName(name) {
        const lookingForName = `reports/${name}`;
        return this.data.items.find(file => file.name === lookingForName);
      },
      async getStats(name) {
        const file = this.findReportFileByName(name);
        if (file === undefined) {
          return null;
        }

        const {data} = await this.$axios.get(file.mediaLink);
        return data;
      },
      details(item) {
        const file = this.findReportFileByName(`${item.date}-${item.branch}.html`);
        if (file === undefined) {
          return null;
        }

        window.open(`${STORAGE_URL}/${file.name}`);
        return false;
      },
      download(item) {
        window.open(`${STORAGE_URL}/${item.name}`);
        return false;
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
          font-weight: 600;
          line-height: 22px;

          a {
            color: $primary;
            font-size: 14px;
            display: inline-block;
            &:first-child {
              margin-right: 20px;
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
