<template>
  <ul class="tests">
    <li
      :key="test.id"
      v-for="test in tests"
      class="tests-item"
      :class="{ failed: test.state === 'failed' }"
    >
      <div
        class="tests-topbar"
        @click="toggleTests(test)"
        :class="{ hasFailed: test.state === 'failed' }"
      >
        <p :class="{ hasFailed: test.state === 'failed' }">
          <v-icon
            v-if="test.state === 'passed'"
            :color="$vuetify.theme.themes.light.color.green"
            class="icon-success"
            size="15"
          >
            check
          </v-icon>
          <v-icon
            v-if="test.state === 'pending'"
            :color="$vuetify.theme.themes.light.color.blue"
            class="icon-pending"
            size="15"
          >
            pause
          </v-icon>
          <v-icon
            v-if="test.state === 'failed'"
            :color="$vuetify.theme.themes.light.color.red"
            class="icon-error"
            size="15"
          >
            close
          </v-icon>
          {{ test.title }}
        </p>

        <span>
          <v-icon size="18">timer</v-icon>
          {{ $moment.duration(test.duration).asSeconds() }}s
        </span>
      </div>

      <p class="tests-stacktrace" v-if="testsOpened.includes(test.id)">
        {{ test.stack_trace }}
      </p>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      items: {
        type: Object.JSON,
        default: {}
      }
    },
    data() {
      return {
        tests: this.items,
        testsOpened: []
      }
    },
    mounted() {
      console.log(this.items)
    },
    methods: {
      toggleTests(test) {
        if (!this.testsOpened.includes(test.id)) {
          this.testsOpened.push(test.id)
        } else {
          const indexToDelete = this.testsOpened.indexOf(test.id)
          this.testsOpened = [
            ...this.testsOpened.slice(0, indexToDelete),
            ...this.testsOpened.slice(indexToDelete + 1)
          ]
        }
      }
    }
  }
</script>

<style lang="scss">
  .tests {
    margin-top: 5px;
    background: lighten($blue, 47%);
    border-radius: 4px;
    padding: 5px 0;

    .icon-success {
      background: #c1f4d1;
    }
    .icon-error {
      background: #fbc6c3;
    }
    .icon-pending {
      background: #beeaf3;
    }

    .v-icon {
      width: 19px;
      height: 19px;
      border-radius: 50%;
      margin-right: 5px;
    }

    &-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;

      &.hasFailed {
        transition: 0.4s ease-out;
        cursor: pointer;
        border-left: 2px solid transparent;

        &:hover {
          opacity: 0.7;
          border-left: 2px solid $red;
        }
      }
    }

    &-stacktrace {
      padding: 10px 20px;
      font-size: 14px !important;
    }

    &-item {
      list-style-type: none;

      span {
        font-size: 14px;
        display: flex;
        align-items: center;

        &,
        .v-icon {
          color: #8ba7ad;
        }
      }

      p {
        margin: 5px 0;
        font-size: 15px;
      }

      &.failed {
        p {
          color: $red;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .tests {
      &-item {
        span {
          display: none;
        }
      }
    }
  }
</style>
