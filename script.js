// Fondo animado tipo red con partículas conectadas
const canvas = document.getElementById("bg-animation");

if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const PARTICLE_COUNT = 70;
    const MAX_DISTANCE = 150;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6
        });
    }

    const mouse = { x: null, y: null };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Partícula
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,114,206,0.4)";
            ctx.fill();

            // Conexiones entre partículas cercanas
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DISTANCE) {
                    const alpha = 1 - dist / MAX_DISTANCE;
                    ctx.strokeStyle = `rgba(0,114,206,${alpha * 0.25})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Efecto ligero con el mouse
            if (mouse.x !== null) {
                const dxm = p.x - mouse.x;
                const dym = p.y - mouse.y;
                const distMouse = Math.sqrt(dxm * dxm + dym * dym);
                if (distMouse < 200) {
                    p.x += dxm * 0.003;
                    p.y += dym * 0.003;
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Consola CSH
const input = document.getElementById("input");
const output = document.getElementById("output");

if (input && output) {
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            const cmd = input.value.trim();
            let res = "Comando no reconocido. Escribe 'help' para ver opciones.";

            if (cmd === "help") res = "about | events | join | clear";
            if (cmd === "about") res = "CSH - Comunidad de Ciberseguridad en UTEC.";
            if (cmd === "events") res = "Revisa la sección de eventos para próximos meetups y charlas.";
            if (cmd === "join") res = "Ve a la sección 'Únete' y postula al capítulo.";
            if (cmd === "clear") { output.innerHTML = ""; input.value = ""; return; }

            output.innerHTML += `<div>&gt; ${cmd}</div><div>${res}</div>`;
            output.scrollTop = output.scrollHeight;
            input.value = "";
        }
    });
}

// Animación de aparición de secciones al hacer scroll
const sections = document.querySelectorAll(".hero, .section-card");

if ("IntersectionObserver" in window && sections.length) {
    sections.forEach((sec) => sec.classList.add("reveal"));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    sections.forEach((sec) => observer.observe(sec));
} else {
    sections.forEach((sec) => sec.classList.add("visible"));
}

// Animación escalonada para hijos del grid (Misión/Visión)
document.querySelectorAll("#sobre .grid-2 > div").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`;
});

const sobreSection = document.getElementById("sobre");
if (sobreSection && "IntersectionObserver" in window) {
    const gridObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll(".grid-2 > div").forEach((el) => {
                        el.style.opacity = "1";
                        el.style.transform = "translateY(0)";
                    });
                }
            });
        },
        { threshold: 0.2 }
    );
    gridObserver.observe(sobreSection);
}

// Carrusel infinito del equipo
const teamTrack = document.querySelector(".team-track");
if (teamTrack) {
    const members = teamTrack.querySelectorAll(".member");
    members.forEach((m) => {
        const clone = m.cloneNode(true);
        clone.classList.add("member-clone");
        teamTrack.appendChild(clone);
    });
}

// Footer profesional con año dinámico
const footerText = document.getElementById("footer-text");
if (footerText) {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const yearLabel = currentYear > startYear ? `${startYear}–${currentYear}` : `${currentYear}`;
    footerText.textContent = `© ${yearLabel} CSH — Todos los derechos reservados.`;
}