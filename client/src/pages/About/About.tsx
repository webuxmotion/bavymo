import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';
import styles from './About.module.scss';

// -----------------------------
// Types
// -----------------------------
type Point = {
  x: number;
  y: number;
  _x: number;
  _y: number;
};

type Line = Point[];

let lines: Line[] = [];

let linesNumber = 4;
let vertices = 100;
let color = "rgba(180, 212, 255, 1)";
let radius = 200;
let time = 0;

for (let i = 0; i < linesNumber; i++) {
  lines[i] = [];

  for (let j = 0; j <= vertices; j++) {
    let point = {
      x: Math.cos(j / vertices * Math.PI * 2),
      y: Math.sin(j / vertices * Math.PI * 2),
      _x: 0,
      _y: 0,
    };

    point._x = point.x;
    point._y = point.y;

    lines[i].push(point);
  }
}


function About() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const noise2D = createNoise2D();

    const canvas = canvasRef.current;
    if (!canvas) return; // ← Guard clause: stop if canvas is null

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // ← Guard clause: stop if context failed

    const halfX = window.innerWidth / 2;
    const halfY = window.innerHeight / 2;

    const circle = {
      x: 50,
      y: 50,
      dx: 2,
      dy: 2,
      radius: 30,
      color,
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawCircle = () => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.closePath();
    };

    let noise;

    const updateLines = () => {
      lines.forEach((_, idx) => {
        for (let i = 0; i <= vertices; i++) {
          noise = noise2D(lines[idx][i]._x / 2 + time * 0.002, lines[idx][i]._y / 2 + time * 0.002);

          lines[idx][i].x = lines[idx][i]._x * radius * (1 - idx / 12) + noise * radius / 5;
          lines[idx][i].y = lines[idx][i]._y * radius * (1 - idx / 6) + noise * radius / 5;
        }
      });
    }

    const drawLines = () => {
      lines.forEach(line => {
        for (let i = 1; i <= vertices; i++) {
          ctx.beginPath();

          ctx.moveTo(halfX + line[i - 1].x, halfY + line[i - 1].y);
          ctx.lineTo(halfX + line[i].x, halfY + line[i].y);

          ctx.stroke();
        }
      });
    }

    const updateCircle = () => {
      circle.x += circle.dx;
      circle.y += circle.dy;

      if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0) {
        circle.dx *= -1;
      }
      if (circle.y + circle.radius > canvas.height || circle.y - circle.radius < 0) {
        circle.dy *= -1;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      updateLines();
      drawLines();
      drawCircle();
      updateCircle();
      time++;
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className={styles.homePage}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default About;