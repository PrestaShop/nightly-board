<template>
  <transition-group tag="ul" name="list" class="suites" appear>
    <li
      :key="suite.id"
      v-for="suite in suites"
      :id="'suite-' + suite.id"
      class="suites-item"
      :class="{
        titleMargin:
          (!$store.state.testsOpened.includes(suite.id) && suite.hasSuites) ||
          (!$store.state.searchOpened.includes(suite.id) && suite.hasSuites)
      }"
    >
      <div class="suite">
        <div
          class="suite-topbar"
          @click="
            $store.commit('toggleTests', {
              suite: suite,
              show: false
            })
          "
        >
          <p :class="{ hasFailed: suite.totalFailures }" class="suites-title">
            {{ suite.title }}
          </p>

          <div class="suite-infos">
            <p class="suite-time">
              <v-icon size="18">timer</v-icon>
              {{ $moment.duration(suite.duration).asSeconds() }}s
            </p>

            <p class="suite-assignment">
              <v-icon size="18">assignment</v-icon>
              {{
                suites.tests && suite.tests.length > 0
                  ? suite.tests.length
                  : suite.tests
                  ? Object.keys(suite.tests).length
                  : 0
              }}
            </p>

            <p class="suite-passed">
              <v-icon size="18">check</v-icon>
              {{ suite.totalPasses }}
            </p>

            <p class="suite-pending" v-if="suite.totalPending !== 0">
              <v-icon size="18">pause</v-icon>
              {{ suite.totalPending }}
            </p>

            <p class="suite-failed" v-if="suite.totalFailures !== 0">
              <v-icon size="18">close</v-icon>
              {{ suite.totalFailures }}
            </p>

            <v-icon
              v-if="
                !$store.state.testsOpened.includes(suite.id) &&
                  !$store.state.searchOpened.includes(suite.id) &&
                  isChild
              "
              color="#759299"
            >
              keyboard_arrow_down
            </v-icon>
            <v-icon
              v-if="
                ($store.state.testsOpened.includes(suite.id) ||
                  $store.state.searchOpened.includes(suite.id)) &&
                  isChild
              "
            >
              keyboard_arrow_up
            </v-icon>
          </div>
        </div>

        <tests
          :items="suite.tests"
          v-if="
            ($store.state.testsOpened.includes(suite.id) ||
              $store.state.searchOpened.includes(suite.id)) &&
              suite.hasTests &&
              ((suite.tests && suite.tests.length > 0) ||
                (Object.keys(suite.tests) &&
                  Object.keys(suite.tests).length > 0))
          "
        />

        <suites
          :items="suite.suites"
          :is-child="true"
          v-if="
            ($store.state.testsOpened.includes(suite.id) && suite.hasSuites) ||
              ($store.state.searchOpened.includes(suite.id) && suite.hasSuites)
          "
          :parent="suite"
          class="childs"
        />
      </div>
    </li>
  </transition-group>
</template>

<script>
  import Tests from '~/components/reusable/Tests'
  import Suites from '~/components/reusable/Suites'

  export default {
    name: 'Suites',
    components: {
      Tests,
      Suites
    },
    props: {
      items: {
        type: Object.JSON,
        default: {}
      },
      parent: {
        type: Object,
        default: () => {}
      },
      isChild: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        suites: this.items,
        testsOpened: [],
        memo: []
      }
    },
    methods: {
      findParents(suite) {
        /* eslint-disable */
        const findNode = (id, currentNode) => {
          if (id == currentNode.id) {
            this.$store.commit('toggleTests', {
              show: true,
              suite: currentNode
            })

            if (currentNode.parent_id) {
              findNode(currentNode.parent_id, {
                id: 0,
                suites: this.suites
              })

              return true
            }
          } else {
            for (var index in currentNode.suites) {
              var node = currentNode.suites[index]

              if (node.id == id) {
                this.$store.commit('toggleTests', { show: true, suite: node })
                if (node.parent_id) {
                  findNode(node.parent_id, {
                    id: 0,
                    suites: this.suites
                  })
                }
                return true
              }
              findNode(id, node)
            }
            return 'No Node Present'
          }
        }

        findNode(suite.parent_id, { id: 0, suites: this.suites })
      }
    },
    mounted() {
      document.addEventListener('scrollTo', event => {
        if (event.detail.suite.parent_id) {
          this.findParents(event.detail.suite)
        }

        this.$store.commit('toggleTests', {
          show: true,
          suite: event.detail.suite
        })
      })

      this.testsOpened = this.$store.state.testsOpened
    }
  }
</script>

<style lang="scss">
  .suites {
    padding-left: 0;

    &.childs {
      margin-top: 15px;

      .suites {
        &-item {
          box-shadow: none;
          margin: 0;
          padding: 5px;
          border: 1px solid darken(white, 20%);

          &:not(:last-child) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
          }

          &:not(:first-child) {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
        }

        &-title {
          color: #4c4f57;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 0;
          padding-left: 5px;

          .v-icon {
            display: none;
          }
        }
      }
    }

    .list-enter-active,
    .list-leave-active {
      opacity: 1;
      transform: translateX(0);
      transition: 0.12s ease-out;

      @for $i from 1 to 50 {
        &:nth-child(#{$i}) {
          transition-delay: $i * 0.05s;
        }
      }
    }

    .list-enter /* .fade-leave-active below version 2.1.8 */ {
      transform: translateX(-20px);
      opacity: 0;
    }

    &-item {
      list-style-type: none;
      border-radius: 5px;
      background-color: #ffffff;
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
      padding: 15px 19px;
      margin-bottom: 15px;

      &.titleMargin {
        .suites-title {
          margin-bottom: 0;
        }
      }
    }

    &-title {
      color: $primary;
      font-size: 20px;
      font-weight: bold;
      line-height: 27px;
      margin-bottom: 10px;

      &.hasFailed {
        color: $red;
      }
    }
  }

  .suite {
    &-infos {
      display: flex;

      p {
        color: #8ba7ad;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        margin: 0 5px;

        &.suite-passed {
          &,
          .v-icon {
            color: $green;
          }
        }

        &.suite-failed {
          &,
          .v-icon {
            color: $red;
          }
        }

        &.suite-pending {
          &,
          .v-icon {
            color: $blue;
          }
        }

        .v-icon {
          color: #8ba7ad;
          margin-right: 2px;
        }
      }
    }

    &-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: 0.4s ease-out;

      &:hover {
        opacity: 0.6;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .suites {
      padding: 0;

      &.childs {
        padding: 0;
      }

      .suite {
        &-topbar {
          align-items: flex-start;
        }

        &-time {
          display: none;
        }

        &-infos {
          margin-top: 5px;

          .v-icon {
            width: 14px;
            font-size: 14px !important;
          }
        }

        &-time {
          margin-left: 0;
        }
      }

      &-title {
        font-size: 16px;
      }

      &-item {
        padding: 5px 10px;
        padding-bottom: 10px;
      }
    }
  }
</style>
