<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        PrestaShop Nighly Board
      </h1>
      <p>
        Sorting By: <b>{{ sortBy }}</b>,
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
              type="primary"
              @click.stop="details(cell.item, cell.index)"
            >
              View
            </b-btn>
          </template>
        </b-table>
      </div>
    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue';

  export default {
    components: {
      Logo,
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
            key: 'report.passes',
            label: 'Tests passes',
            sortable: false,
          },
          {
            key: 'report.failures',
            label: 'Tests failures',
            sortable: false,
          },
          {
            key: 'report.skipped',
            label: 'Tests skipped',
            sortable: false,
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
      const {data} = await this.$axios.get('https://www.googleapis.com/storage/v1/b/prestashop-core-nightly/o');
      this.data = data;
      this.data.items.forEach((file) => {
        // Yeah it is a nightly build
        const matches = file.name.match(regex);
        if (matches) {
          this.files.push({
            name: file.name,
            date: matches[1],
            branch: matches[2],
            version: matches[3],
            file,
          });
        }
      });
    },
    methods: {
      details(item) {
        const lookingForName = `reports/${item.date}-${item.branch}.html`;
        console.log(lookingForName);
        this.data.forEach((file) => {
          if (file.name === lookingForName) {
            return file.name;
          }

          return false;
        });

        return false;
      },
    },
  };
</script>

<style>
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 30px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .files {
    padding-top: 15px;
  }
</style>
