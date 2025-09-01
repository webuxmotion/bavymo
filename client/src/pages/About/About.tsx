import { useEffect, useRef } from 'react';
import styles from './About.module.scss';

function About() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // ← Guard clause: stop if canvas is null

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // ← Guard clause: stop if context failed

    const circle = {
      x: 50,
      y: 50,
      dx: 2,
      dy: 2,
      radius: 30,
      color: 'purple',
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
      drawCircle();
      updateCircle();
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