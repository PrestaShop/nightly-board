<template>
  <b-container fluid>
    <div>
      <ps-logo />
      <ps-title />
      <p>
        Sorting By: <b>{{ sortBy }}</b><br>
        Sort Direction: <b>{{ sortDesc ? 'Descending' : 'Ascending' }}</b>
      </p>

      <div class="files">
        <b-table
          striped
          hover
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items="files"
          :fields="fields"
        >
          <template
            slot="actions"
            slot-scope="cell"
          >
            <b-btn
              size="sm"
              variant="primary"
              @click.stop="download(cell.item, cell.index)"
            >
              Download
            </b-btn>
            <b-btn
              size="sm"
              variant="success"
              @click.stop="details(cell.item, cell.index)"
              v-if="cell.item.stats"
            >
              View Report
            </b-btn>
          </template>
        </b-table>
      </div>
    </div>
  </b-container>
</template>

<script>
  import PsLogo from '~/components/Logo.vue';
  import PsTitle from '~/components/Title.vue';

  const STORAGE_URL_API = 'https://www.googleapis.com/storage/v1/b/prestashop-core-nightly/o';
  const STORAGE_URL = 'https://storage.googleapis.com/prestashop-core-nightly';

  export default {
    components: {
      PsLogo,
      PsTitle,
    },
    data() {
      return {
        data: {},
        files: [],
        sortBy: 'date',
        sortDesc: true,
        fields: [
          {
            key: 'date',
            sortable: true,
            sortDirection: 'asc',
          },
          {
            key: 'name',
            sortable: true,
          },
          {
            key: 'version',
            sortable: true,
          },
          {
            key: 'branch',
            sortable: true,
          },
          {
            key: 'stats.tests',
            label: 'Total tests',
            sortable: false,
            class: 'text-center',
          },
          {
            key: 'stats.passes',
            label: 'Tests passes',
            sortable: false,
            class: 'text-center',
          },
          {
            key: 'stats.failures',
            label: 'Tests failures',
            sortable: false,
            class: 'text-center',
          },
          {
            key: 'stats.skipped',
            label: 'Tests skipped',
            sortable: false,
            class: 'text-center',
          },
          {
            key: 'actions',
            label: '',
            sortable: false,
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
    },
  };
</script>

<style>
  .files {
    padding-top: 15px;
  }
</style>
