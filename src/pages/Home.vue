<script setup>
import { useGameStore } from '@/store/game.js';
import { Character } from '@/game/models/Character/Character.js';

const { game, timeScale } = useGameStore();
const { battleManager } = game;

const test = () => {
  // Create test characters
  const playerChar = new Character({ name: 'Bopsky', stats: { hp: 100 } });
  const goblin = new Character({ name: 'Goblin King', stats: { hp: 100 } });

  // Create teams
  const playerTeam = { name: 'Player', characters: [playerChar] };
  const enemyTeam = { name: 'Goblins', characters: [goblin] };

  // Start battle
  battleManager.start([playerTeam, enemyTeam]);
}
</script>

<template>
  <div class="page">
    <div><input type="number" v-model="game.timeScale" /> {{ timeScale }}</div>
    <div><button @click="test">Test</button></div>
    <template v-if="game.battleManager?.battle?.teams">
      <div>Active? {{ game.battleManager.battle.isActive }}</div>
      <div style="display: flex; gap: 0 1rem;">
        <div v-for="team in game.battleManager.battle.teams">
          <h3>{{  team.name  }}</h3>
          <div v-for="member in team.members">
            <span>{{ member.name }} [{{ member.level }}]</span>&nbsp;
            <span>{{ member.getStat('hp') }} / {{ member.getStatMax('hp') }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.page {
  padding: 1rem;
  background-color: rgba(36, 36, 36, 0.9);
  color: rgba(255, 255, 255, 0.87);
}
</style>
