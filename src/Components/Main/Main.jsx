import React from "react";
import style from "./Main.module.css";
import { useState } from "react";
import { controller } from "./controllers";
import { useEffect } from "react";

import Bird from "./Bird";
import GameManager from "./GameManager";
import { changeData } from "./trainingData";
import classify from "./redIA";

let bird = new Bird();
const gameManager = new GameManager();
const GAME_HEIGTH = 600;
let resulto = true;
const dataToLearn = [];
let input;
let keyPressing = false;
let checkpoint = 0;

export default function Main() {
  const [birdPosition, setBirdPosition] = useState(0);
  const [points, setPoints] = useState(0);
  const [structure, setStructure] = useState(gameManager.structures);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [GEN, setGent] = useState(1);
  const [IA, setIA] = useState(true);

  useEffect(() => {
    let timeID;

    birdPosition > 550 && setIsGameStarted(false);

    if (isGameStarted) {
      timeID = setInterval(() => {
        setPoints(points + 1);
        if (gameManager.structures.length) {
          // get game data to IA
          if (gameManager.structures[0].style.bottom) {
            input = {
              birdHeight: Math.round(GAME_HEIGTH - birdPosition - 70),
              obstacleHeight: Math.round(gameManager.structures[0].height),
              obstaclebot: 1,
              distance: gameManager.structures[0].x - 170,
              floorDistance: Math.round(GAME_HEIGTH - birdPosition + 70),
            };
          } else {
            input = {
              birdHeight: Math.round(birdPosition + 70),
              obstacleHeight: Math.round(gameManager.structures[0].height),
              obstaclebot: 0,
              distance: gameManager.structures[0].x - 170,
              floorDistance: Math.round(GAME_HEIGTH - birdPosition + 70),
            };
          }

          gameManager.clearStructure();

          points > checkpoint && (keyPressing = false);

          if (!keyPressing) dataToLearn.push({ input, output: "Nothing" });

          setStructure(gameManager.structures);
          if (IA && resulto) {
            const IA_CHOOSE = classify(input);
            resulto = false;
            IA_CHOOSE.then((result) => {
              // el mayor de 3 numeros wtf
              const solution =
                result[0].confidence > result[1].confidence &&
                result[0].confidence > result[2].confidence
                  ? result[0]
                  : result[1].confidence > result[2].confidence
                  ? result[1]
                  : result[2];

              console.log("result", result);
              console.log("solution", solution);
              if (solution.label === "Jump") {
                controller({ key: "w" }, bird, dataToLearn, input);
              }
              if (solution.label === "Down") {
                controller({ key: "s" }, bird, dataToLearn, input);
              }

              resulto = true;
            }).catch((err) => console.log(`ERROR ${err}`));
          }

          setIsGameStarted(true);
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
            touch && setIsGameStarted(false);
            // touch && handleGEN();
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
    // let lastpoint = 0;
    bird.y = 200;
    bird.velocity = 0;

    setBirdPosition(bird.y);
    setIsGameStarted(true);
    gameManager.clearAllStructure();
    setStructure(gameManager.structures);
    //   setPoints(0);

    //   gameManager.spawnStructure();

    //   // logic to create another bird

    setGent(GEN + 1);

    //   if (points > lastpoint) {
    //     net.train(changeData(dataToLearn));

    //     lastpoint = points;
    //   }

    //   dataToLearn = [];
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        keyPressing = true;
        controller(e, bird, dataToLearn, input);
        checkpoint = points + 20;
      }}
      className={style.container}
    >
      {!isGameStarted && (
        <div className={style.startOrGameOver}>PRESS START</div>
      )}

      <button
        style={{ position: "absolute", top: "-30px", left: "0" }}
        onClick={() => {
          console.log(dataToLearn);
        }}
      >
        Get DATA
      </button>
      <button
        style={{ position: "absolute", top: "-30px", left: "300px" }}
        onClick={handleReStart}
      >
        START
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
