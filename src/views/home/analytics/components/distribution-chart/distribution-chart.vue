<template>
  <div id="chart" class="w-full">
    <apexchart
      type="area"
      :width="width"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { AnalyticsDistribution } from '@/modules/analytics/models/analytics-distribution.model'

const props = defineProps<{
  data: AnalyticsDistribution | null
}>()

const width = ref(900);
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

// Transform data for chart series
const series = computed(() => {
  if (!props.data) return []

  // Group by challenge type
  const typeMap = new Map<string, {name: string, data: {x: string, y: number}[]}>()

  props.data.forEach(day => {
    day.types.forEach(type => {
      if (!typeMap.has(type.type)) {
        typeMap.set(type.type, {
          name: type.type,
          data: []
        })
      }
      typeMap.get(type.type)?.data.push({
        x: day.date,
        y: type.count
      })
    })
  })

  const seriesData = Array.from(typeMap.values())
  console.log('Chart series data:', seriesData)
  return seriesData
})

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: false
      }
    }
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'datetime',
    labels: {
      show: true,
      hideOverlappingLabels:false,
      trim: false,
      format: 'dd MMM',
      style: {
        colors: 'var(--foreground)'
      }
    },
  },
  tooltip: {
    fillSeriesColor: true,
    x: {
      format: 'dd MMM yyyy'
    },
    theme: isDark.value ? 'dark' : 'light'
  },
  colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    }
  },
  legend: {
    labels: {
      colors: 'var(--foreground)'
    }
  },
  selection: {
    fill: { color: 'var(--background)'}
  },
  yaxis: {
    title: {
      text: 'Completados',
      style: {
        color: 'var(--foreground)'
      }
    },
    labels: {
      style: {
        colors: 'var(--foreground)'
      }
    },
  },
}))
</script>

<style scoped>
#chart {
  width: 100%;
}
</style>
