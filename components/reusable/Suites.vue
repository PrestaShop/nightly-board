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
          (!$store.state.searchOpened.includes(suite.id) && suite.hasSuites),
        hasFailed:
          suite && suite.childrenData && suite.childrenData.totalFailures !== 0,
        hasPendings:
          suite && suite.childrenData && suite.childrenData.totalPending !== 0,
        hasSkipped:
          suite && suite.childrenData && suite.childrenData.totalSkipped !== 0
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
          :class="{ isChild }"
        >
          <p
            :class="{
              hasFailed:
                suite &&
                suite.childrenData &&
                suite.childrenData.totalFailures !== 0,
              hasPendings:
                suite &&
                suite.childrenData &&
                suite.childrenData.totalPending !== 0,
              hasSkipped:
                suite &&
                suite.childrenData &&
                suite.childrenData.totalSkipped !== 0
            }"
            class="suites-title"
          >
            <v-icon size="18" :color="$vuetify.theme.themes.light.primary">
              library_books
            </v-icon>

            {{ suite.title }}
          </p>

          <div class="suite-infos" v-if="!isChild">
            <p class="suite-time" v-if="suite.duration">
              <v-icon size="18">timer</v-icon>
              {{ $moment.duration(suite.duration).asSeconds() }}s
            </p>

            <p class="suite-passed" v-if="suite.childrenData.totalPasses !== 0">
              <v-icon size="18">check</v-icon>
              {{ suite.childrenData.totalPasses }}
            </p>

            <p
              class="suite-pending"
              v-if="suite.childrenData.totalPending !== 0"
            >
              <v-icon size="18">pause</v-icon>
              {{ suite.childrenData.totalPending }}
            </p>

            <p
              class="suite-failed"
              v-if="suite.childrenData.totalFailures !== 0"
            >
              <v-icon size="18">close</v-icon>
              {{ suite.childrenData.totalFailures }}
            </p>

            <p
              class="suite-skipped"
              v-if="suite.childrenData.totalSkipped !== 0"
            >
              <span class="icon-skipped">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width="44px"
                  height="44px"
                  viewBox="0 0 44 44"
                  enable-background="new 0 0 44 44"
                  xml:space="preserve"
                >
                  <g>
                    <path d="M27,29H17V0h10V29z M27,44H17v-8h10V44z" />
                  </g>
                </svg>
              </span>
              {{ suite.childrenData.totalSkipped }}
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

          <div class="suite-infos" v-if="isChild">
            <p class="suite-time" v-if="suite.duration">
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

            <p class="suite-passed" v-if="suite.totalPasses !== 0">
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

            <p class="suite-skipped" v-if="suite.totalSkipped !== 0">
              <span class="icon-skipped">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width="44px"
                  height="44px"
                  viewBox="0 0 44 44"
                  enable-background="new 0 0 44 44"
                  xml:space="preserve"
                >
                  <g>
                    <path d="M27,29H17V0h10V29z M27,44H17v-8h10V44z" />
                  </g>
                </svg>
              </span>
              {{ suite.totalSkipped }}
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
              suite.tests &&
              suite.tests.length > 0 &&
              suite.hasTests
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

          @at-root .dark & {
            border: 1px solid #363636;
          }

          &.hasSkipped {
            background: lighten($skipped, 40%);
          }

          &.hasPendings {
            background: lighten($blue, 40%);
          }

          &.hasFailed {
            background: lighten($red, 40%);
          }

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
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 0;
          padding-left: 5px;

          @at-root .dark & {
            color: white;
          }

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
      transition: 0.4s ease-out;

      @at-root .dark & {
        background-color: $greyDark;
      }

      &.hasSkipped {
        background: lighten($skipped, 30%);

        @at-root .dark & {
          background-color: #285d57;
        }
      }

      &.hasPendings {
        background: lighten($blue, 47%);

        @at-root .dark & {
          background-color: #1b4365;
        }
      }

      &.hasFailed {
        background: lighten($red, 36%);

        @at-root .dark & {
          background-color: #422222;
        }
      }

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

      @at-root .dark & {
        color: white;
      }

      .v-icon {
        display: inline-block;
        vertical-align: middle;

        @at-root .dark & {
          color: white !important;
        }
      }

      &.hasSkipped {
        color: lighten($skipped, 1%);

        @at-root .dark & {
          color: lighten($skipped, 10%);
        }
      }

      &.hasPendings {
        color: lighten($blue, 10%);

        @at-root .dark & {
          color: lighten($blue, 10%);
        }
      }

      &.hasFailed {
        color: lighten($red, 10%);

        @at-root .dark & {
          color: lighten($red, 10%);
        }
      }
    }
  }

  .suite {
    &-infos {
      display: flex;

      > .v-icon {
        @at-root .dark & {
          color: #8ba7ad;
        }
      }

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

        &.suite-skipped {
          .icon-skipped {
            background: none;
            margin-right: 2px;
            width: 12px;
          }
          &,
          svg {
            color: $skipped;
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
      transition: 0.4s ease-out;
      cursor: pointer;

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
