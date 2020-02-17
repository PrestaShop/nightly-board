<template>
  <ul class="selectors">
    <li
      :key="item.id"
      v-for="item in items"
      :class="{ active: item.active }"
      class="selectors-item"
      @click="select(item)"
    >
      <p :to="item.route" class="selectors-link">
        {{ item.name }}
      </p>
    </li>
  </ul>
</template>

<script>
  const today = new Date()

  export default {
    data() {
      return {
        items: [
          {
            id: 1,
            name: 'Last month',
            data: today.getMonth(),
            active: true
          },
          {
            id: 2,
            name: '2 Last months',
            data: today.getMonth() - 1,
            active: false
          },
          {
            id: 3,
            name: 'Last year',
            data: today.getYear(),
            active: false
          }
        ]
      }
    },
    computed: {
      time: {
        get() {
          return this.$store.state.localConfig.time
        },
        set(value) {
          this.$store.commit('toggleGraphFilter', {
            value,
            type: 'time'
          })
        }
      }
    },
    methods: {
      select(item) {
        this.items.map(e => {
          if (e.id !== item.id) {
            e.active = false
          } else {
            e.active = true

            this.$store.commit('toggleGraphFilter', {
              value: e.data,
              type: 'time'
            })
          }
          return e
        })
      }
    }
  }
</script>

<style lang="scss">
  .selectors {
    display: flex;
    align-items: center;
    padding: 0;

    &-item {
      list-style-type: none;
      box-sizing: border-box;
      background-color: #ffffff;
      border-top: 1px solid #b7ced3;
      border-bottom: 1px solid #b7ced3;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.4s ease-out;
      cursor: pointer;
      color: #363a41;

      &:hover {
        background: lighten($primary, 10%);
        color: white;
      }

      &.active {
        background: $primary;
        color: white;
      }

      &:last-child {
        border: 1px solid #b7ced3;
        border-radius: 0 4px 4px 0;
      }

      &:first-child {
        border: 1px solid #b7ced3;
        border-radius: 4px 0 0 4px;
      }
    }

    &-link {
      font-family: 'Open Sans';
      font-size: 14px;
      line-height: 19px;
      margin-bottom: 0;
      padding: 7px 15px;
    }
  }
</style>
