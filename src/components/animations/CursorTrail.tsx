import { useEffect, useRef, useCallback } from "react";

/* ─── types ─── */
interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  shape: "diamond" | "star" | "circle" | "cross";
}

/* Brand sparkle palette */
const COLORS = ["#0098da", "#c9ebfb", "#f58634", "#0098da", "#c9ebfb"];

const SHAPES: Sparkle["shape"][] = ["diamond", "star", "circle", "cross"];

/* ─── draw helpers ─── */
function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.6, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.6, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
  }
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(size, 0);
  ctx.moveTo(0, -size);
  ctx.lineTo(0, size);
  ctx.stroke();
  ctx.restore();
}

function drawSparkle(ctx: CanvasRenderingContext2D, s: Sparkle) {
  ctx.save();
  ctx.globalAlpha = s.opacity * s.life;
  ctx.fillStyle = s.color;
  ctx.strokeStyle = s.color;

  switch (s.shape) {
    case "diamond":
      drawDiamond(ctx, s.x, s.y, s.size, s.rotation);
      break;
    case "star":
      drawStar(ctx, s.x, s.y, s.size, s.rotation);
      break;
    case "cross":
      drawCross(ctx, s.x, s.y, s.size, s.rotation);
      break;
    case "circle":
    default:
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}

/* ─── component ─── */
const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const timerRef = useRef(0);

  const createSparkle = useCallback(
    (x: number, y: number, overrides?: Partial<Sparkle>): Sparkle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.2 + 0.3;
      return {
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        size: Math.random() * 6 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        ...overrides,
      };
    },
    [],
  );

  const createExplosion = useCallback(
    (x: number, y: number) => {
      const count = 40 + Math.floor(Math.random() * 25);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 6 + 2;
        sparklesRef.current.push(
          createSparkle(x, y, {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 8 + 1,
            opacity: 1,
            decay: Math.random() * 0.02 + 0.015,
          }),
        );
      }
    },
    [createSparkle],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (sparklesRef.current.length < 400) {
        for (let i = 0; i < 5; i++) {
          sparklesRef.current.push(createSparkle(e.clientX, e.clientY));
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      createExplosion(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timerRef.current++;

      if (mouseRef.current.x > 0 && sparklesRef.current.length < 500) {
        for (let j = 0; j < 2; j++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 50 + 8;
          sparklesRef.current.push(
            createSparkle(
              mouseRef.current.x + Math.cos(angle) * radius,
              mouseRef.current.y + Math.sin(angle) * radius,
              {
                size: Math.random() * 4 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                decay: Math.random() * 0.01 + 0.005,
                vx: Math.cos(angle) * 0.5,
                vy: Math.sin(angle) * 0.5 - 0.2,
              },
            ),
          );
        }
      }

      sparklesRef.current = sparklesRef.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.vy -= 0.01;
        s.life -= s.decay;
        s.rotation += s.rotationSpeed;
        s.size *= 0.997;

        if (s.life > 0) {
          drawSparkle(ctx, s);
          return true;
        }
        return false;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [createSparkle, createExplosion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 hidden md:block"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default CursorTrail;
