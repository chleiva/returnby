// Fireworks Animation using HTML5 Canvas
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to match viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fireworks configuration
const particleCount = 100;
const particleSize = 2;
const explosionRadius = 80;
const gravity = 0.05;
const friction = 0.99;
const colors = ['#ff0000', '#ffcc00', '#ffffff', '#ff6600', '#ff00ff', '#00ffff'];

// Particle class
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
        this.velocity.y += gravity;
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        return this.alpha > 0;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Firework class
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    update() {
        const remainingParticles = [];
        for (const particle of this.particles) {
            if (particle.update()) {
                remainingParticles.push(particle);
            }
        }
        this.particles = remainingParticles;
        return this.particles.length > 0;
    }

    draw() {
        for (const particle of this.particles) {
            particle.draw();
        }
    }
}

// Animation state
let fireworks = [];
let animationId;

// Create initial fireworks
function init() {
    for (let i = 0; i < 3; i++) {
        fireworks.push(new Firework());
    }
}

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(10, 10, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const remainingFireworks = [];
    for (const firework of fireworks) {
        if (firework.update()) {
            remainingFireworks.push(firework);
        }
    }
    fireworks = remainingFireworks;

    // Add new fireworks randomly
    if (Math.random() < 0.05) {
        fireworks.push(new Firework());
    }

    for (const firework of fireworks) {
        firework.draw();
    }

    animationId = requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start animation on page load
window.addEventListener('load', () => {
    init();
    animate();
});