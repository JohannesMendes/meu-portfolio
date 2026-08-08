/**
 * ClickSpark — versão Vanilla JS (sem React, sem dependências)
 * Baseado no componente ClickSpark.jsx do react-bits
 *
 * Cria um canvas fixo cobrindo a página inteira e desenha "faíscas"
 * que se espalham a partir do ponto de clique.
 *
 * USO:
 *   1. Importe este arquivo com <script src="click-spark.js"></script>
 *      (ou <script type="module"> se preferir usar o export)
 *   2. Ele já se inicializa sozinho e escuta cliques em todo o document.
 *   3. Para customizar, edite o objeto DEFAULT_OPTIONS abaixo,
 *      ou chame manualmente: ClickSpark.init({ sparkColor: '#ff0000' })
 */

(function () {
  const DEFAULT_OPTIONS = {
    sparkColor: '#fff',
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
    easing: 'ease-out', // 'linear' | 'ease-in' | 'ease-in-out' | 'ease-out'
    extraScale: 1.0
  };

  let canvas = null;
  let ctx = null;
  let sparks = [];
  let animationId = null;
  let resizeTimeout = null;
  let currentOptions = { ...DEFAULT_OPTIONS };
  let initialized = false;

  function easeFunc(t) {
    switch (currentOptions.easing) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: // ease-out
        return t * (2 - t);
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  }

  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparks = sparks.filter(spark => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= currentOptions.duration) {
        return false;
      }

      const progress = elapsed / currentOptions.duration;
      const eased = easeFunc(progress);

      const distance = eased * currentOptions.sparkRadius * currentOptions.extraScale;
      const lineLength = currentOptions.sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = currentOptions.sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    animationId = requestAnimationFrame(draw);
  }

  function handleClick(e) {
    // Evita disparar o efeito quando o clique for dentro de campos de
    // formulário, links, etc. Remova esse "if" se quiser o efeito em tudo.
    // if (e.target.closest('a, button, input, textarea, select')) return;

    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    const newSparks = Array.from({ length: currentOptions.sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / currentOptions.sparkCount,
      startTime: now
    }));

    sparks.push(...newSparks);
  }

  function init(options = {}) {
    if (initialized) return; // evita inicializar duas vezes
    currentOptions = { ...DEFAULT_OPTIONS, ...options };

    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // não bloqueia cliques na página
    canvas.style.userSelect = 'none';
    canvas.style.zIndex = '9999'; // ajuste se precisar ficar atrás de algo
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClick);

    animationId = requestAnimationFrame(draw);
    initialized = true;
  }

  function destroy() {
    if (!initialized) return;
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleClick);
    clearTimeout(resizeTimeout);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    canvas = null;
    ctx = null;
    sparks = [];
    initialized = false;
  }

  // Inicializa automaticamente assim que o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

  // Expõe API global para customização/controle manual
  window.ClickSpark = { init, destroy };
})();
