<template>
  <div class="header" v-resize="onResize" :class="{ isMobile }">
    <MenuResponsive v-if="isMobile" />
    <ps-logo v-if="!isMobile" />
    <Menu v-if="!isMobile" />
    <h1>{{ pageTitle }}</h1>
    <div class="dates" v-if="!isMobile">
      <p class="start-date" v-if="reportDates">
        Start date : {{ reportDates.startDate }}
      </p>
      <p class="end-date" v-if="reportDates">
        End date : {{ reportDates.endDate }}
      </p>
    </div>
  </div>
</template>

<script>
  import PsLogo from './Logo'
  import Menu from './Menu'
  import MenuResponsive from './MenuResponsive'

  export default {
    components: {
      PsLogo,
      Menu,
      MenuResponsive
    },
    data() {
      return {
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
      }
    },
    computed: {
      pageTitle() {
        return this.$store.state.pageTitle
          ? this.$store.state.pageTitle
          : this.title
      },
      reportDates() {
        return this.$store.state.startDate &&
          this.$store.state.pageTitle !== 'Nightly reports'
          ? {
              startDate: this.$store.state.startDate,
              endDate: this.$store.state.endDate
            }
          : null
      }
    },
    props: {
      title: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss">
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    width: 100%;
    background: $primary;
    box-shadow: 0 0 10px 0 rgba(black, 0.2);
    z-index: 10;
    min-height: 50px;
    transition: 0.4s ease-out;

    @at-root .dark & {
      background: $primaryDark;
    }

    &.isMobile {
      padding: 0 15px;
    }

    h1 {
      color: white;
      font-size: 20px;
      font-weight: bold;
      width: 100%;
      max-width: 430px;
      text-align: center;
    }

    .dates {
      width: 100%;
      max-width: 475px;
      display: flex;
      padding-right: 20px;

      > p {
        font-size: 16px;
        line-height: 22px;
        color: white;
        margin-bottom: 0;

        &:first-child {
          margin-right: 30px;
        }
      }
    }
  }
</style>
