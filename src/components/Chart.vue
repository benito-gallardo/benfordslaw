<script>
import { Line, mixins, Bar } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  mixins: [reactiveProp, Line, Bar],
  data: () => ({
    options: {
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#fff',
            },
            gridLines: {
              borderColor: '#fff',
              color: 'rgba(255, 255, 255, 0.15)',
              display: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: '#fff',
            },
            gridLines: {
              borderColor: '#fff',
              display: false,
            },
          },
        ],
      },
      legend: {
        display: true,
        position: 'bottom',

        labels: {
          fontColor: '#fff',
          padding: 50,
          usePointStyle: true,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },
};
</script>
