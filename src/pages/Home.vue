<script setup>
import { useGameStore } from '@/store/game.js';
const { game, start, stop } = useGameStore();

const c = game.player.newCharacter({ stats: { hp: 500, str: 10 } });
const WildHead1 = {
  name: 'Wild Head (1)',
  slot: 'head',
  modifiers: [
    { stat: 'str', type: 'F', amount: 5},
    { stat: 'str', type: 'P', amount: 0.2},
  ]
}
const WildHead2 = {
  name: 'Wild Head (2)',
  slot: 'head',
  modifiers: [
    { stat: 'str', type: 'M', amount: 1.3}
  ]
}
c.equipItem(WildHead1);
c.equipItem(WildHead2);
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
