<script setup>
import { useGameStore } from '@/store/game.js';
const { game } = useGameStore();
</script>

<template>
  <div class="page">
    {{ game }}
  </div>
</template>

<style scoped lang="scss">
.page {
  padding: 1rem;
  background-color: rgba(36, 36, 36, 0.9);
  color: rgba(255, 255, 255, 0.87);
}
</style>

