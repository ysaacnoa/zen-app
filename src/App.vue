<template>
  <select v-model="selectedBackground">
    <option v-for="(background, index) in backgroundOptions" :key="index" :value="background">
      {{ background }}
    </option>
  </select>

  <div class="app-background">
    <component :is="currentBackgroundComponent" />
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
import { BackgroundName, BackgroundType } from './modules/background/constants';
export default defineComponent({
  name: 'App',
  components: {
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
  } {
    const selectedBackground = ref(BackgroundType.BUBBLES);
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
    };
  },
});
</script>

<style scoped>
select {
  position: relative;
  z-index: 10;
}
.app-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
