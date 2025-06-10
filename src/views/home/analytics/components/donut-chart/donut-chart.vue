<template>
  <div id="chart">
    <apexchart
      type="donut"
      width="380"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: {
    type: string
    count: number
  }[] | null
}>()

const series = computed(() => {
  return props.data?.map(item => item.count) || []
})

const labels = computed(() => {
  return props.data?.map(item => item.type) || []
})

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    width: 380
  },
  labels: labels.value,
  colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 270,
      donut: {
        size: '65%'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    position: 'right',
    formatter: function(val: string, opts: { w: { globals: { series: number[] } }; seriesIndex: number }) {
      return `${val} - ${opts.w.globals.series[opts.seriesIndex]}`
    },
    labels: {
    colors: 'var(--foreground)'
  }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}))
</script>

<style scoped>
#chart {
  width: 100%;
  min-height: 300px;
}
.apexcharts-legend-text{
  color: var(--color-foreground);
}
</style>
