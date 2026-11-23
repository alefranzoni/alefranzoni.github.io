
document.addEventListener('DOMContentLoaded', () => {
    initBentoSpotlight();
    initParticleCanvas();
});

function initBentoSpotlight() {
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();

            card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
        });
    });
}

function initParticleCanvas() {
    const canvas = document.getElementById('particles-canvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        particles = createParticles(width, height);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles(ctx, particles, width, height);

    // Actualiza las dimensiones cuando cambie el tamaño
    window.addEventListener('resize', () => {
        particles = createParticles(width, height);
    });
}

function createParticles(width, height) {
    const particleCount = Math.min(55, Math.floor((width * height) / 24000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 1.6 + 0.6,
            color: Math.random() > 0.5
                ? 'rgba(99, 102, 241, 0.45)'
                : 'rgba(6, 182, 212, 0.4)'
        });
    }

    return particles;
}

function animateParticles(ctx, particles, width, height) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        drawParticle(ctx, particle);

        for (let j = i + 1; j < particles.length; j++) {
            drawParticleConnection(ctx, particle, particles[j]);
        }
    });

    requestAnimationFrame(() => {
        animateParticles(ctx, particles, width, height);
    });
}

function drawParticle(ctx, particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
}

function drawParticleConnection(ctx, particle, otherParticle) {
    const dx = particle.x - otherParticle.x;
    const dy = particle.y - otherParticle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 130;

    if (distance >= maxDistance) return;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(129, 140, 248, ${0.1 * (1 - distance / maxDistance)})`;
    ctx.lineWidth = 0.7;
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(otherParticle.x, otherParticle.y);
    ctx.stroke();
}