<template>
  <ul class="menu" :class="{ column }">
    <li
      :key="item.id"
      v-for="item in items"
      class="menu-item"
      @click="$emit('toggle')"
    >
      <nuxt-link :to="item.route" class="menu-link">
        {{ item.name }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
  import MenuItems from '~/constants/menu.json'

  export default {
    data() {
      return {
        items: MenuItems
      }
    },
    props: {
      column: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss">
  .menu {
    display: flex;
    align-items: center;
    padding: 0;

    &.column {
      flex-direction: column;
      align-items: flex-start;

      .menu {
        &-link {
          color: $primary;

          @at-root .dark & {
            color: white;
          }
        }
      }
    }

    &-item {
      list-style-type: none;
    }

    &-link {
      text-decoration: none;
      padding: 5px 10px;
      font-weight: bold;
      color: $primary;
      font-size: 16px;
      line-height: 22px;

      @at-root .dark & {
        color: white;
      }

      > * {
        vertical-align: middle;
        line-height: 22px;
        margin-top: -2px;
      }
    }
  }
</style>
