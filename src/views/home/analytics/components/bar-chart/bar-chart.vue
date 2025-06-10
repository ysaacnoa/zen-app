<template>
  <div id="chart">
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsTypes } from '@/modules/analytics/models/analytics-types.model'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  data: {
    type: Array as PropType<AnalyticsTypes>,
    required: true
  }
})

const isDark = ref(false);
const updateTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark');
};
updateTheme();

const observer = new MutationObserver(updateTheme);

onMounted(() => {
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  observer.disconnect();
});

const series = computed(() => [{
  name: 'Count',
  data: props.data.map(item => item.count)
}])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350
  },
  toolbar: {
    show: false,
    tools: {
        download: false,
        selection: false,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: false
      }
  },
  tooltip: {
    fillSeriesColor: true,
    theme: isDark.value ? 'dark' : 'light',
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: false
    }
  },
  dataLabels: {
    enabled: true
  },
  yaxis: {
    labels: {
      style: {
        colors: 'var(--foreground)'
      }
    },
  },
  xaxis: {
    categories: props.data.map(item => item.type),
    labels: {
      style: {
        colors: 'var(--foreground)'
      }
    },
  }
}))
</script>

<style scoped>
#chart {
  width: 100%;
}
</style>