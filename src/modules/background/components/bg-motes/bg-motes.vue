<template>
  <div class="bg-position motes">
    <section class="mote" id="up"></section>
    <section class="mote" id="down"></section>
    <section class="mote" id="left"></section>
    <section class="mote" id="right"></section>
  </div>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BackgroundName } from '../../constants';

export default defineComponent({
  name: BackgroundName.MOTES,
});
</script>

<style>
@import './bg-motes.css';
</style>
