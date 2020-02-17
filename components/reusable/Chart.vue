<script>
  import { Bar } from 'vue-chartjs'

  export default {
    extends: Bar,
    props: {
      chartData: {
        type: Object.JSON,
        default: {}
      },
      options: {
        type: Object.JSON,
        default: {}
      }
    },
    mounted() {
      this.renderChart(this.chartData, this.options)
    },
    watch: {
      chartData() {
        const gradientFailed = this.$refs.canvas
          .getContext('2d')
          .createLinearGradient(0, 0, 0, 200)

        gradientFailed.addColorStop(1, 'rgba(210,72,54,1)')
        gradientFailed.addColorStop(0, 'rgba(251,165,154,1)')

        const gradientSuccess = this.$refs.canvas
          .getContext('2d')
          .createLinearGradient(0, 0, 0, 450)

        gradientSuccess.addColorStop(1, 'rgba(105,223,137,1)')
        gradientSuccess.addColorStop(0, 'rgba(186,253,210,1)')

        const gradientPending = this.$refs.canvas
          .getContext('2d')
          .createLinearGradient(0, 0, 0, 450)

        gradientPending.addColorStop(1, 'rgba(58,204,226,1)')
        gradientPending.addColorStop(0, 'rgba(142,234,250,1)')

        this.chartData.datasets[0].backgroundColor = gradientFailed
        this.chartData.datasets[1].backgroundColor = gradientSuccess
        this.chartData.datasets[2].backgroundColor = gradientPending

        /* eslint-disable */
        this.renderChart(this.chartData, this.options)
      }
    }
  }
</script>

<style></style>
