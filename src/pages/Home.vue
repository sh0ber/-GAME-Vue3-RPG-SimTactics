<script setup>
import { useGameStore } from '@/store/game.js';
const { game, start, stop } = useGameStore();

const c = game.player.newCharacter({ stats: { hp: 500, str: 10 } });
const WildHead1 = {
  name: 'Wild Head A',
  slot: 'head',
  modifiers: [
    { stat: 'str', type: 'F', amount: 5},
    { stat: 'str', type: 'P', amount: 0.2},
  ]
}
const WildHead2 = {
  name: 'Wild Head B',
  slot: 'head',
  modifiers: [
    { stat: 'str', type: 'F', amount: 1},
    { stat: 'str', type: 'M', amount: 1.4},
    { stat: 'str', type: 'M', amount: 1.1},
    { stat: 'dex', type: 'F', amount: 4},
    { stat: 'luk', type: 'F', amount: 4},
    { stat: 'crit', type: 'F', amount: 2},
  ]
}
c.equipItem(WildHead1);
c.equipItem(WildHead2);
</script>

<template>
  <div class="page">
    <div class="name">{{ c.name }}</div>
    <div v-for="(stat, statName) in c.statManager.stats" :key="statName">
      {{ statName }}: <span v-if="stat.current">{{ stat.current }} / </span>{{ stat.value }}
    </div>
    <div v-for="[slot, item] in c.equipment" :key="slot">
      {{ slot }}: {{ item.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  padding: 1rem;
  background-color: rgba(36, 36, 36, 0.9);
  color: rgba(255, 255, 255, 0.87);
}
.name {
  font-size: 12pt;
  font-weight: bold;
  background-image: linear-gradient(green, purple, maroon);
}
</style>
