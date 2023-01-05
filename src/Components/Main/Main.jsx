import React from "react";
import style from "./Main.module.css";
import { useState } from "react";
import { controller } from "./controllers";
import Bird from "./Bird";
import { useEffect } from "react";

const bird = new Bird();

export default function Main() {
  const [birdPosition, setBirdPosition] = useState(0);

  useEffect(() => {
    let timeID;

    if (!(birdPosition > 550)) {
      timeID = setInterval(() => {
        if (bird.lift === 0) {
          bird.y += bird.gravity * bird.dificulty * 2;
        } else {
          bird.y -= bird.lift;
          bird.lift--;
        }

        setBirdPosition(bird.y);
      }, 24);
    }

    return () => {
      clearInterval(timeID);
    };
  });

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => controller(e, bird)}
      className={style.container}
    >
      <div className={style.fpsCount}>FPS: {60}</div>
      <div className={style.bird} style={{ top: birdPosition }}></div>
      <div className={style.structure}>d</div>
    </div>
  );
}
