import { defineStore } from "pinia";
import { FPS } from '@/game/config.js';
import { Game } from "@/game/Game.js";

export const useGameStore = defineStore("game", () => {
  const game = new Game();

  const tickStep = 1 / FPS; // fixed timestep
  const timeScale = 1.0;

  let lastTime;
  let loopId = null;

  function loop() {
    const now = performance.now();
    const delta = ((now - lastTime) / 1000);
    lastTime = now;
    let scaledDelta = delta * timeScale;
    
    // Fixed-step to allow ticks & fast-forward
    while (scaledDelta >= tickStep) {
      game.update(tickStep);
      scaledDelta -= tickStep;
    }

    // Also process sub-tick remainder to guard against temporal drift
    if (scaledDelta > 0) {
      game.update(scaledDelta);
    }
  }

  function start() {
    lastTime = performance.now();
    loopId = setInterval(loop, tickStep * 1000);
  }

  function stop() {
    if (loopId !== null) {
      clearInterval(loopId);
      loopId = null;
    }
  }

  return {
    game,       // full simulation engine
    tickStep,
    timeScale,
    start,
    stop,
  };
});
