import './Playground.css';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useAtom } from 'jotai';
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Render,
  World,
} from 'matter-js';

import { scoreAtom } from '../atoms/scoreAtom';

const Playground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine] = useState(Engine.create());
  const [score, setScore] = useAtom(scoreAtom);
  const [bestScore, setBestScore] = useState<number>(0);
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const userLang = navigator.language;
    setLanguage(userLang.startsWith("ko") ? "ko" : "en");
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const render = Render.create({
      element: canvasRef.current.parentElement!,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 800,
        height: 400,
        background: "white",
        wireframes: false,
      },
    });

    const ground = Bodies.rectangle(400, 390, 1600, 20, { isStatic: true });
    const player = Bodies.rectangle(100, 300, 40, 40);

    World.add(engine.world, [ground, player]);

    Events.on(engine, "collisionStart", (event) => {
      // Add collision events if needed
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp" && Math.abs(player.velocity.y) < 1e-2) {
        Body.applyForce(player, player.position, { x: 0, y: -0.05 });
      }
    });

    const update = () => {
      if (player.position.x > 400) {
        Composite.translate(engine.world, { x: -5, y: 0 });
      }
    };

    Render.run(render);
    Engine.run(engine);

    const runner = setInterval(() => {
      Engine.update(engine, 1000 / 60);
      update();
    }, 1000 / 60);

    return () => {
      clearInterval(runner);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [engine]);

  return (
    <div className="playground-container">
      <h1 className="game-title">
        {language === "ko" ? "[횡스크롤 게임]" : "[Side-Scrolling Game]"}
      </h1>
      <p className="instructions">
        {language === "ko"
          ? "점프하려면 위 화살표 키를 누르세요!"
          : "Press the Up Arrow key to jump!"}
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
          <span>Best:</span> {bestScore}
        </p>
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Playground;
