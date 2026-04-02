(function () {
  const canvas = document.getElementById("lorenz-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Lorenz parameters
  const sigma = 10, rho = 28, beta = 8 / 3;
  const dt = 0.005;
  const maxPoints = 3000;
  const points = [];

  let x = 0.1, y = 0, z = 0;
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function getColor() {
    const isDark = document.body.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark";
    return isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";
  }

  function project(x, y, z) {
    // Scale and center the attractor on screen
    const scale = Math.min(canvas.width, canvas.height) / 40;
    return {
      px: canvas.width / 2 + (x - 0) * scale * 0.6,
      py: canvas.height / 2 - (z - 25) * scale * 0.6,
    };
  }

  function step() {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    x += dx; y += dy; z += dz;
    points.push({ x, y, z });
    if (points.length > maxPoints) points.shift();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getColor();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 1; i < points.length; i++) {
      const a = project(points[i - 1].x, points[i - 1].y, points[i - 1].z);
      const b = project(points[i].x, points[i].y, points[i].z);
      if (i === 1) ctx.moveTo(a.px, a.py);
      ctx.lineTo(b.px, b.py);
    }
    ctx.stroke();
  }

  function loop() {
    for (let i = 0; i < 2; i++) step(); // advance multiple steps per frame
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  loop();

  // Watch for light/dark mode toggle
  const observer = new MutationObserver(() => draw());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
})();
