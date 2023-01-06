import React from "react";
import style from "./Main.module.css";
import { useState } from "react";
import { controller } from "./controllers";
import { useEffect } from "react";

import Bird from "./Bird";
import GameManager from "./GameManager";
import { trainingData, changeData } from "./trainingData";
const brain = require("brain.js");

let net = new brain.NeuralNetwork({
  activation: "sigmoid", // activation function
  hiddenLayers: [6],
});

net.train(trainingData);

let dataToLearn = [];

let bird = new Bird();
const gameManager = new GameManager();
const GAME_HEIGTH = 600;

export default function Main() {
  const [birdPosition, setBirdPosition] = useState(0);
  const [points, setPoints] = useState(0);
  const [structure, setStructure] = useState(gameManager.structures);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [GEN, setGent] = useState(1);

  useEffect(() => {
    let timeID;

    birdPosition > 550 && handleGEN(false);

    if (isGameStarted) {
      timeID = setInterval(() => {
        setPoints(points + 1);
        if (gameManager.structures.length) {
          let input;
          if (gameManager.structures[0].style.bottom) {
            input = {
              birdHeight: GAME_HEIGTH - birdPosition - 70,
              obstacleHeight: gameManager.structures[0].height,
              obstaclebot: true,
              distance: gameManager.structures[0].x - 170,
              floorDistance: GAME_HEIGTH - birdPosition + 70,
              velocity: bird.velocity,
            };
          } else {
            input = {
              birdHeight: birdPosition + 70,
              obstacleHeight: gameManager.structures[0].height,
              obstaclebot: false,
              distance: gameManager.structures[0].x - 170,
              floorDistance: GAME_HEIGTH - birdPosition + 70,
              velocity: bird.velocity,
            };
          }

          const ia = net.run(input);
          const result = ia.jump > ia.down ? "w" : "s";
          const data = { input, output: {} };

          console.log(ia);

          result === "w"
            ? (data.output["jump"] = 1)
            : (data.output["down"] = 1);

          dataToLearn.push(data);

          gameManager.clearStructure();
          setStructure(gameManager.structures);
          controller({ key: result }, bird);
        }

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
            // touch && setIsGameStarted(false);
            touch && handleGEN();
          }
        });
        setBirdPosition(bird.y);
      }, 30);
    }

    return () => {
      clearInterval(timeID);
    };
  });

  useEffect(() => {
    let spawnID;

    if (isGameStarted) {
      setPoints(points + 1);
      spawnID = setInterval(() => {
        gameManager.spawnStructure();

        setStructure(gameManager.structures);
      }, gameManager.spawnTime);
      return () => {
        clearInterval(spawnID);
      };
    }
  }, [gameManager.structures.length, isGameStarted]);

  const handleReStart = (e) => {
    bird.y = 200;
    bird.velocity = 0;

    setBirdPosition(bird.y);
    setIsGameStarted(true);
    gameManager.clearAllStructure();
    setStructure(gameManager.structures);
    setPoints(0);

    gameManager.spawnStructure();
  };

  const handleGEN = (e) => {
    let lastpoint = 0;
    bird.y = 200;
    bird.velocity = 0;

    setBirdPosition(bird.y);
    setIsGameStarted(true);
    gameManager.clearAllStructure();
    setStructure(gameManager.structures);
    setPoints(0);

    gameManager.spawnStructure();

    // logic to create another bird

    setGent(GEN + 1);

    if (points > lastpoint) {
      net.train(changeData(dataToLearn));

      lastpoint = points;
    }

    dataToLearn = [];
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
        style={{ position: "absolute", top: "-30px", left: "300px" }}
        onClick={handleReStart}
      >
        START
      </button>
      <button
        style={{ position: "absolute", top: "-30px" }}
        onClick={handleGEN}
      >
        OTHER GEN
      </button>
      <div className={style.fpsCount}>GEN {GEN}</div>
      <div className={style.points}>Points: {points}</div>
      <div className={style.points}>Points: {points}</div>

      <div className={style.bird} style={{ top: birdPosition }}></div>
      {structure.map((structure, id) => (
        <div key={id} style={{ ...structure.style, left: structure.x }}></div>
      ))}
    </div>
  );
}
