<script setup>
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/store/game.js';
import { Character } from '@/game/models/Character/Character.js';
import { TeamManager } from '@/game/systems/Battle/TeamManager.js';

const { game, battle } = storeToRefs(useGameStore());

const test = () => {
  // Create test characters
  const playerChar = new Character({ name: 'Bopsky', stats: { hp: 100, str: 5 } });
  const goblin = new Character({ name: 'Goblin King', stats: { hp: 100 } });

  // Create team POJOs
  const playerTeam = new TeamManager({ name: 'Player', characters: [playerChar] });
  const enemyTeam = new TeamManager({ name: 'Goblins', characters: [goblin] });

  playerTeam.addRandomMember(2);
  enemyTeam.addRandomMember(2);
  
  // Start battle
  game.value.battleManager.start([playerTeam, enemyTeam]);
}
</script>

<template>
  <div class="page">
    <div><input type="number" v-model="game.timeScale" /> {{ game.timeScale }}</div>
    <div><button @click="test">Test</button></div>
    <template v-if="battle">
      <div style="display: flex; gap: 0 1rem;">
        <div v-for="team in battle.teams">
          <h3>{{  team.name  }}</h3>
          <div v-for="member in team.members"
            class="member no-select"
            :class="{ acting: member.id === battle.memberActing?.id }"
            @click="battle.handlePlayerAction(member, 'attack')"
          >
            <span>{{ member.name }} [{{ member.character.level }}]</span>&nbsp;
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
.member {
  cursor: pointer;
}
.member.acting {
  border: 1px solid lime;
}
</style>
