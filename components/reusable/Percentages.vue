<template>
  <div class="percentages" :style="styles">
    <div class="percentages-success"></div>
    <div class="percentages-pending"></div>
    <div class="percentages-passed"></div>
    <div class="percentages-failed"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        total: this.passed + this.success + this.failed + this.pendings,
        percents: {}
      }
    },
    computed: {
      styles() {
        return {
          '--passed-width': `${(this.passed / this.total) * 100}%`,
          '--success-width': `${(this.success / this.total) * 100}%`,
          '--failed-width': `${(this.failed / this.total) * 100}%`,
          '--pendings-width': `${(this.pendings / this.total) * 100}%`
        }
      }
    },
    mounted() {
      this.percents = {
        percentPassed: (this.passed / this.total) * 100,
        percentSuccess: (this.success / this.total) * 100,
        percentFailed: (this.failed / this.total) * 100,
        percentPendings: (this.pendings / this.total) * 100
      }
    },
    props: {
      passed: {
        type: Number,
        default: 0
      },
      success: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      },
      pendings: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="scss">
  .percentages {
    border-radius: 4px;
    overflow: hidden;
    height: 15px;
    width: 80px;
    margin: 10px 5px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    opacity: 0.7;

    > div {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        color: white;
        display: block;
        font-weight: 700;
        text-align: center;
        font-size: 10px;
        margin: 0;
      }
    }

    &-success {
      background: #53d572;
      width: var(--success-width);
    }

    &-pending {
      background: $blue;
      width: var(--pendings-width);
    }

    &-failed {
      background: #f44336;
      width: var(--failed-width);
    }

    &-passed {
      background: darken($skippedBg, 10%);
      width: var(--passed-width);
    }
  }
</style>
