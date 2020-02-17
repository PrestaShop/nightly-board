<template>
  <transition-group
    name="list"
    tag="ul"
    class="navigation"
    :class="{ hasPadding: padding }"
    appear
  >
    <li :key="suite.id" v-for="suite in suites" class="navigation-item">
      <p
        @click="dispatchEvent(suite)"
        :class="{ hasFailed: suite.totalFailures }"
        class="navigation-title"
        v-scroll-to="'#suite-' + suite.id"
      >
        {{ suite.title }}
      </p>

      <report-navigation
        :items="suite.suites"
        v-if="suite.suites"
        :padding="true"
        :parent="suite"
      />
    </li>
  </transition-group>
</template>

<script>
  import ReportNavigation from '~/components/reusable/ReportNavigation'

  export default {
    name: 'ReportNavigation',
    components: {
      ReportNavigation
    },
    props: {
      items: {
        type: Object.JSON,
        default: {
          function() {
            return []
          }
        }
      },
      padding: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        suites: this.items,
        testsOpened: []
      }
    },
    methods: {
      dispatchEvent(suite) {
        const event = new CustomEvent('scrollTo', {
          detail: { suite }
        })

        this.$emit('toggle')

        document.dispatchEvent(event)
      }
    }
  }
</script>

<style lang="scss">
  .navigation {
    padding-left: 0;

    .list-enter-active,
    .list-leave-active {
      opacity: 1;
      transform: translateY(0);
      transition: 0.12s ease-out;

      @for $i from 1 to 50 {
        &:nth-child(#{$i}) {
          transition-delay: $i * 0.05s;
        }
      }
    }

    .list-enter /* .fade-leave-active below version 2.1.8 */ {
      transform: translateY(-20px);
      opacity: 0;
    }

    &.hasPadding {
      padding-left: 10px;

      .navigation-title {
        color: #363a41;
        font-size: 14px;
        line-height: 19px;
        font-weight: normal;
      }
    }

    &-item {
      list-style-type: none;
    }

    &-title {
      color: $primary;
      font-size: 14px;
      font-weight: bold;
      line-height: 19px;
      cursor: pointer;
      transition: 0.4s ease-out;
      margin-bottom: 5px;

      &:hover {
        opacity: 0.6;
      }

      &.hasFailed {
        color: $red;
      }
    }
  }
</style>
