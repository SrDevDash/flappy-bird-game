import React from "react";
import style from "./Main.module.css";
import { useState } from "react";
import { controller } from "./controllers";
import Bird from "./Bird";
import { useEffect } from "react";
import GameManager from "./GameManager";

const bird = new Bird();
const gameManager = new GameManager();
const GAME_HEIGTH = 600;

export default function Main() {
  const [birdPosition, setBirdPosition] = useState(0);
  const [points, setPoints] = useState(0);
  const [structure, setStructure] = useState(gameManager.structures);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    let timeID;

    birdPosition > 550 && setIsGameStarted(false);

    if (isGameStarted) {
      timeID = setInterval(() => {
        setPoints(points + 1);

        if (bird.lift === 0) {
          bird.y += bird.gravity * bird.dificulty * 2 + bird.velocity;
          bird.velocity += 0.1;
        } else {
          bird.velocity = 0;
          bird.y -= bird.lift;
          bird.lift--;
        }

        gameManager.structures.forEach((structure) => {
          structure.x -= gameManager.velocity;
          if (structure.x < 160 && structure.x > 20) {
            const height = structure.height;
            let touch = false;
            if (structure.style.bottom) {
              // bird = 60 px / 2 = 30px
              // gameHeigtht = 600 px
              // structure height = ?

              touch = height > GAME_HEIGTH - birdPosition - 60;
            } else {
              touch = birdPosition + 60 < height;
            }
            touch && setIsGameStarted(false);
          }
        });
        setBirdPosition(bird.y);
      }, 24);
    }

    return () => {
      clearInterval(timeID);
    };
  });

  useEffect(() => {
    let spawnID;

    if (isGameStarted) {
      spawnID = setInterval(() => {
        gameManager.spawnStructure();
        gameManager.clearStructure();

        setStructure(gameManager.structures);
      }, gameManager.spawnTime);
      return () => {
        clearInterval(spawnID);
      };
    }
  }, [gameManager.structures.length, isGameStarted]);

  const handleReStart = (e) => {
    bird.y = 200;
    setBirdPosition(bird.y);
    setIsGameStarted(true);
    gameManager.clearAllStructure();
    setStructure(gameManager.structures);
    setPoints(0);
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => controller(e, bird)}
      className={style.container}
    >
      {!isGameStarted && (
        <div className={style.startOrGameOver}>PRESS START</div>
      )}

      <button
        style={{ position: "absolute", top: "-30px" }}
        onClick={handleReStart}
      >
        START
      </button>
      <div className={style.fpsCount}>FPS: {60}</div>
      <div className={style.points}>Points: {points}</div>

      <div className={style.bird} style={{ top: birdPosition }}></div>
      {structure.map((structure, id) => (
        <div key={id} style={{ ...structure.style, left: structure.x }}></div>
      ))}
    </div>
  );
}
