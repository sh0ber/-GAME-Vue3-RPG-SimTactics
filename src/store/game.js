import { onUnmounted } from 'vue';
import { defineStore } from "pinia";
import { FPS } from '@/game/config.js';
import { Game } from "@/game/Game.js";

export const useGameStore = defineStore("game", () => {
  const game = new Game();
  const tickStep = 1 / FPS;

  let lastTime;
  let loopId = null;

  function loop(now) {
    const delta = ((now - lastTime) / 1000);
    lastTime = now;
    let scaledDelta = delta * game.timeScale;
    
    // Fixed-step to allow ticks & fast-forward
    while (scaledDelta >= tickStep) {
      game.update(tickStep);
      scaledDelta -= tickStep;
    }
    // Also process sub-tick remainder to guard against temporal drift
    if (scaledDelta > 0) {
      game.update(scaledDelta);
    }

    loopId = requestAnimationFrame(loop);
  }

  function start() {
    if (loopId === null) {
      lastTime = performance.now();
      loopId = requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (loopId !== null) {
      cancelAnimationFrame(loopId);
      loopId = null;
    }
  }
  
  // Handle tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // The user has switched tabs, so stop the rAF loop
      stop();
    } else {
      // The user has returned to the tab, so restart the loop
      // The delta calculation will automatically handle the catch-up
      start();
    }
  });

  onUnmounted(() => {
    stop();
  });

  return {
    game,
    start,
    stop,
  };
});