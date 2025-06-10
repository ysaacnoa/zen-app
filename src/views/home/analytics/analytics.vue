<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else class="analytics-dashboard grid gap-4 p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card class="analytic-card">
        <CardHeader>
          <CardTitle
            >✅
            <span class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              >Completados</span
            >
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats?.completed || 0 }}</div>
          <div class="text-sm text-muted-foreground">de {{ stats?.total || 0 }} total</div>
        </CardContent>
      </Card>

      <Card class="analytic-card">
        <CardHeader>
          <CardTitle>
            ⏳
            <span class="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent"
              >En progreso</span
            >
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats?.inProgress || 0 }}</div>
        </CardContent>
      </Card>

      <Card class="analytic-card">
        <CardHeader>
          <CardTitle
            >📈
            <span
              class="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"
              >Tasa de completado</span
            ></CardTitle
          >
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats?.completionRate?.toFixed(2) || '0.00' }}%</div>
        </CardContent>
      </Card>

      <Card class="analytic-card">
        <CardHeader>
          <CardTitle
            >⏰
            <span class="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent"
              >Pendientes</span
            >
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats?.pending || 0 }}</div>
        </CardContent>
      </Card>

      <Card class="analytic-card">
        <CardHeader>
          <CardTitle
            >📊
            <span class="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent"
              >Total</span
            >
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats?.total || 0 }}</div>
        </CardContent>
      </Card>

      <Card class="analytic-card">
        <CardHeader>
          <CardTitle
            >🚀
            <span class="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
              >Tasa de progreso</span
            >
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats?.progressRate?.toFixed(2) || '0.00' }}%</div>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card class="analytic-card md:col-span-2">
        <CardHeader>
          <CardTitle>Completion Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <distribution-chart :data="distribution" />
        </CardContent>
      </Card>
      <Card class="analytic-card">
        <CardHeader>
          <CardTitle>📊 Tipos de Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <donnut-chart :data="types" />
        </CardContent>
      </Card>
      <Card class="analytic-card">
        <CardHeader>
          <CardTitle>Challenge Types Count</CardTitle>
        </CardHeader>
        <CardContent>
          <bar-chart :data="types ?? []" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AnalyticsDashboard',
});
import { ref, onMounted } from 'vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DonnutChart from './components/donut-chart';
import DistributionChart from './components/distribution-chart';
import BarChart from './components/bar-chart';
import AnalyticsDao from '@/modules/analytics/dao/analytics.dao';
import type { AnalyticsStats } from '@/modules/analytics/models/analytics-stats.model';
import type { AnalyticsTypes } from '@/modules/analytics/models/analytics-types.model';
import type { AnalyticsDistribution } from '@/modules/analytics/models/analytics-distribution.model';
import { useUserStore } from '@/modules/user/stores/user.store';

interface TrendChartData {
  date: string;
  completions: number;
}

const userStore = useUserStore();
const isLoading = ref(true);
const stats = ref<AnalyticsStats | null>(null);
const types = ref<AnalyticsTypes | null>(null);
const trends = ref<TrendChartData[] | null>(null);
const distribution = ref<AnalyticsDistribution | null>(null);

onMounted(async () => {
  try {
    await userStore.ensureProfile();
    isLoading.value = true;
    const [statsData, typesData, trendsData, distributionData] = await Promise.all([
      AnalyticsDao.getStats(userStore.profile?.id ?? ''),
      AnalyticsDao.getTypes(userStore.profile?.id ?? ''),
      AnalyticsDao.getTrends(userStore.profile?.id ?? ''),
      AnalyticsDao.getDistribution(userStore.profile?.id ?? ''),
    ]);

    stats.value = statsData;
    if (typesData) {
      types.value = typesData;
    }

    console.log('Stats data:', statsData);
    console.log('Types data:', typesData);
    console.log('Raw trends data:', trendsData);

    // Transform trends data for the chart
    const dailyTrends = trendsData?.reduce(
      (acc, trend) => {
        const date = trend.completedAt.toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    trends.value = dailyTrends
      ? Object.entries(dailyTrends).map(([date, completions]) => ({
          date,
          completions,
        }))
      : null;

    distribution.value = distributionData;

    console.log('Processed trends:', trends.value);
  } catch (error) {
    console.error('Error fetching analytics:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.analytics-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.chart-container {
  min-height: 300px;
  width: 100%;
}

.analytic-card {
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
  isolation: isolate;
  color: var(--color-foreground);
}

.analytic-card:hover {
  transform: translateY(-5px);
}
</style>
