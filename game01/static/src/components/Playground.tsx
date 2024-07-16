import './Playground.css'; // CSS 파일을 추가합니다.

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useAtom } from 'jotai';
import {
  Bodies,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from 'matter-js';

import { scoreAtom } from '../atoms/scoreAtom';

const Playground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalScore = useRef<number>(0);
  const bestScore = useRef<number>(0);
  const [score, setScore] = useAtom(scoreAtom);
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const userLang = navigator.language;
    setLanguage(userLang.startsWith("ko") ? "ko" : "en");
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Engine.create();
    const render = Render.create({
      element: document.body,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 300,
        height: 400,
        background: "white",
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(160, 400, 400, 10, {
      isStatic: true,
      collisionFilter: {
        group: -1,
      },
      render: {
        fillStyle: "blue",
      },
    });

    const user = Bodies.circle(160, 380, 30, {
      label: "user",
      render: {
        sprite: {
          texture: "/bibidukbig.png",
          xScale: 0.1,
          yScale: 0.1,
        },
      },
    });

    const infiniteArr = Array.from({ length: 15000 }).map(() => {
      return Bodies.circle(Math.random() * 300, 0, 10, {
        label: "ball",
        restitution: 0.9,
        collisionFilter: {
          group: -1,
        },
        render: {
          sprite: {
            texture: "/poop.png",
            xScale: 0.05,
            yScale: 0.05,
          },
        },
      });
    });

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          resolve();
        }, ms);
      });

    const compositeArr: Matter.Body[] = [];

    const spreadBall = async (ball: Matter.Body) => {
      compositeArr.push(ball);
      World.add(engine.world, compositeArr);
      await wait(200);
      compositeArr.pop();
      World.remove(engine.world, compositeArr);
    };

    const event = async () => {
      for (const ball of infiniteArr) {
        await spreadBall(ball);
        totalScore.current = totalScore.current + 1;
        setScore(totalScore.current);
      }
    };

    Events.on(engine, "collisionStart", async function (event) {
      const isUserDead = event.pairs.some(
        (ev) =>
          (ev.bodyA.label === "user" && ev.bodyB.label === "ball") ||
          (ev.bodyA.label === "ball" && ev.bodyB.label === "user"),
      );

      if (isUserDead) {
        // 그림 주위에 빨간 테두리를 추가
        user.render.strokeStyle = "red";
        user.render.lineWidth = 5;

        if (bestScore.current < totalScore.current) {
          bestScore.current = totalScore.current;
        }

        totalScore.current = 0;
        await wait(1000);

        // 테두리를 제거
        user.render.strokeStyle = undefined;
        user.render.lineWidth = 0;
      }
    });

    World.add(engine.world, [floor, user]);
    const runner = Runner.run(engine);
    Render.run(render);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
    });
    World.add(engine.world, mouseConstraint);

    event();

    return () => {
      Runner.stop(runner);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [setScore]);

  return (
    <div className="playground-container">
      <h1 className="game-title">
        {language === "ko" ? "[몰란닥 피하기 게임]" : "[Molandak Dodge Game]"}
      </h1>
      <p className="instructions">
        {language === "ko"
          ? "마우스나 터치로 비비둑을 움직여주세요!"
          : "Move Bibiduk with your mouse or touch!"}
      </p>
      <p className="created">Created by Baeksu</p>
      <button
        className="refresh-button"
        onClick={() => window.location.reload()}
      >
        {language === "ko" ? "잘 안되면 새로고침" : "Refresh if not working"}
      </button>
      <div className="game-info">
        <p className="score">
          <span>Score:</span> {score}
        </p>
        <p className="best-score">
          <span>Best:</span> {bestScore.current}
        </p>
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Playground;
