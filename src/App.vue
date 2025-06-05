<template>
  <div class="app-container">
    <!-- Background Component -->
    <div class="app-background">
      <component :is="currentBackgroundComponent" />
    </div>

    <!-- Main Content -->
    <div class="app-content">
      <BackgroundSelector
        v-model="selectedBackground"
        :options="backgroundOptions"
      />
      <router-view />
    </div>
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
      [BackgroundType.CURSOR]: BackgroundName.CURSOR
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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

</style>
