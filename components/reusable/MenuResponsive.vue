<template>
  <div class="menuResponsive">
    <div class="toggleMenu" @click="toggleSidebar">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div
      class="overlay"
      :class="{ opened: sidebar }"
      @click="toggleSidebar"
    ></div>
    <div class="responsiveSidebar" :class="{ opened: sidebar }">
      <v-icon @click="toggleSidebar" class="close">close</v-icon>

      <Menu @toggle="toggleSidebar" :column="true" />

      <filters
        :is-responsive="true"
        @titleclick="toggleState('showFilters')"
        :show-filters="showFilters"
      />

      <div class="responsiveNav" v-if="$store.state.report">
        <h2 @click="toggleState('showNav')">
          Navigation
          <v-icon v-if="showNav">keyboard_arrow_down</v-icon>
          <v-icon v-else>keyboard_arrow_up</v-icon>
        </h2>
        <report-navigation-container v-if="showNav">
          <report-navigation
            :items="$store.state.report.suites_data"
            v-if="$store.state.report && $store.state.report.suites_data"
            @toggle="toggleSidebar"
          />

          <template v-if="!$store.state.report.suites_data">
            <bullet-list-loader :speed="999" class="list-loader" />
          </template>
        </report-navigation-container>
      </div>
    </div>
  </div>
</template>

<script>
  import { BulletListLoader } from 'vue-content-loader'
  import MenuItems from '~/constants/menu.json'
  import Menu from '~/components/reusable/Menu'
  import Filters from '~/components/reusable/Filters'
  import ReportNavigation from '~/components/reusable/ReportNavigation'
  import ReportNavigationContainer from '~/components/container/ReportNavigationContainer'

  export default {
    components: {
      Menu,
      Filters,
      BulletListLoader,
      ReportNavigation,
      ReportNavigationContainer
    },
    data() {
      return {
        items: MenuItems,
        sidebar: false,
        showNav: true,
        showFilters: true
      }
    },
    methods: {
      toggleSidebar() {
        this.sidebar = !this.sidebar
      },
      toggleState(state) {
        this[state] = !this[state]
      }
    }
  }
</script>

<style lang="scss">
  .menuResponsive {
    .toggleMenu {
      display: flex;
      flex-direction: column;
      align-items: space-between;
      justify-content: space-between;
      width: 20px;
      height: 16px;
      position: relative;
      z-index: 1;

      span {
        height: 2px;
        width: 100%;
        background: white;
      }
    }

    .overlay {
      background: rgba(0, 0, 0, 0.4);
      position: fixed;
      left: 0;
      top: 0;
      transition: 0.4s ease-out;
      height: 100vh;
      width: 100vw;
      opacity: 0;
      z-index: 10;
      pointer-events: none;

      &.opened {
        opacity: 1;
        pointer-events: all;
      }
    }

    .responsiveSidebar {
      max-width: 300px;
      background: white;
      position: fixed;
      left: 0;
      top: 0;
      transform: translateX(-100%);
      transition: 0.4s ease-out;
      height: 100vh;
      width: 100vw;
      z-index: 11;
      padding-top: 40px;
      box-sizing: border-box;

      .responsiveNav {
        padding: 0 15px;

        > h2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      h2 {
        margin-bottom: 10px;

        &.toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .filters {
        padding: 10px 15px;

        .filter {
          margin-bottom: 5px;
        }

        .filter-label {
          color: #363a41;
          font-size: 14px;

          i {
            vertical-align: middle;
          }
        }
      }

      .menu {
        &-item {
          width: 100%;

          i {
            display: none;
          }

          a {
            padding: 10px 15px;
            display: block;
            border-bottom: 1px solid darken(white, 15%);
          }
        }
      }

      .close {
        position: absolute;
        top: 10px;
        right: 10px;
      }

      &.opened {
        transform: translateX(0);
      }
    }
  }
</style>
