<script setup>
import { useGameStore } from '@/store/game.js';
const { game, start, stop } = useGameStore();

const c = game.player.newCharacter({ stats: { hp: 500, str: 10 } });
c.equipItem({ name: 'Wild Head', modifiers: [{ stat: 'str', type: 'F', amount: 5}] }, 'head');
c.equipItem({ name: 'Wild Head', modifiers: [{ stat: 'str', type: 'P', amount: 0.1}] }, 'head');
</script>

<template>
  <div class="page">
    <div v-for="(stat, statName) in c.statManager.stats" :key="statName">
      {{ statName }}: <span v-if="stat.current">{{ stat.current }} / </span>{{ stat.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  padding: 1rem;
  background-color: rgba(36, 36, 36, 0.9);
  color: rgba(255, 255, 255, 0.87);
}
</style>
