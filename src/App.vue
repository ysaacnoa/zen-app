<template>
  <div class="app-container">
    <!-- Background Component -->
    <component :is="currentBackgroundComponent">
      <!-- Main Content -->
      <div class="app-content">
        <BackgroundSelector v-model="selectedBackground" :options="backgroundOptions" />
        <router-view />
      </div>
    </component>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  ref,
  type ComputedRef,
  type Ref,
} from 'vue';
import LandingPage from '@/views/landing';
import BackgroundSelector from '@/components/background-selector';
import { BackgroundName, BackgroundType } from './modules/background/constants';
export default defineComponent({
  name: 'App',
  components: {
    LandingPage,
    BackgroundSelector,
    [BackgroundName.BUBBLES]: defineAsyncComponent(
      () => import('@/modules/background/components/bg-bubbles'),
    ),
    [BackgroundName.GRADIENT]: defineAsyncComponent(
      () => import('@/modules/background/components/bg-gradient'),
    ),
    [BackgroundName.MOUSE]: defineAsyncComponent(
      () => import('@/modules/background/components/bg-mouse'),
    ),
    [BackgroundName.MESH]: defineAsyncComponent(
      () => import('@/modules/background/components/bg-mesh'),
    ),
    [BackgroundName.MOTES]: defineAsyncComponent(
      () => import('@/modules/background/components/bg-motes'),
    ),
    [BackgroundName.BLURRED]: defineAsyncComponent(
      () => import('@/modules/background/components/bg-blurred'),
    ),
    [BackgroundName.CURSOR]: defineAsyncComponent(
      () => import('@/modules/background/components/bg-cursor'),
    ),
  },
  setup(): {
    selectedBackground: Ref<BackgroundType>;
    backgroundOptions: BackgroundType[];
    currentBackgroundComponent: ComputedRef<BackgroundName>;
    isAppStarted: Ref<boolean>;
  } {
    const selectedBackground = ref(BackgroundType.BUBBLES);
    const isAppStarted = ref(true); // Always show app content since routing handles it
    const backgroundOptions = Object.values(BackgroundType);

    const backgroundComponentMap: Record<BackgroundType, BackgroundName> = {
      [BackgroundType.BUBBLES]: BackgroundName.BUBBLES,
      [BackgroundType.GRADIENT]: BackgroundName.GRADIENT,
      [BackgroundType.MOUSE]: BackgroundName.MOUSE,
      [BackgroundType.MESH]: BackgroundName.MESH,
      [BackgroundType.MOTES]: BackgroundName.MOTES,
      [BackgroundType.BLURRED]: BackgroundName.BLURRED,
      [BackgroundType.CURSOR]: BackgroundName.CURSOR,
    };

    const currentBackgroundComponent = computed(() => {
      return backgroundComponentMap[selectedBackground.value];
    });

    return {
      selectedBackground,
      backgroundOptions,
      currentBackgroundComponent,
      isAppStarted,
    };
  },
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-content {
  pointer-events: auto;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
