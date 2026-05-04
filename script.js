// ── Typewriter hero tagline ──
const heroTagline = document.getElementById("heroTagline");
if (heroTagline) {
    const text = "HACK OR BE HACKED";
    let i = 0;
    heroTagline.textContent = "";

    function typeChar() {
        if (i < text.length) {
            heroTagline.textContent += text[i];
            i++;
            setTimeout(typeChar, 70 + Math.random() * 40);
        } else {
            heroTagline.classList.add("typed");
        }
    }

    setTimeout(typeChar, 600);
}

// ── Modal PDF ──
const pdfModal      = document.getElementById("pdfModal");
const pdfModalFrame = document.getElementById("pdfModalFrame");
const pdfModalTitle = document.getElementById("pdfModalTitle");
const pdfModalClose = document.getElementById("pdfModalClose");

function openPdfModal(src, title) {
    if (!pdfModal) return;
    pdfModalTitle.textContent = title || "Documento PDF";
    pdfModalFrame.src = src;
    pdfModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePdfModal() {
    if (!pdfModal) return;
    pdfModal.classList.remove("active");
    setTimeout(() => { pdfModalFrame.src = ""; }, 300);
    document.body.style.overflow = "";
}

if (pdfModal) {
    pdfModalClose.addEventListener("click", closePdfModal);
    pdfModal.addEventListener("click", (e) => {
        if (e.target === pdfModal) closePdfModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && pdfModal.classList.contains("active")) closePdfModal();
    });
    document.querySelectorAll("[data-pdf]").forEach((btn) => {
        btn.addEventListener("click", () => openPdfModal(btn.dataset.pdf, btn.dataset.title));
    });
}

// ── Fondo animado (partículas conectadas) ──
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
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,114,206,0.4)";
            ctx.fill();

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

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// ── Carrusel 3D de Eventos ──
const events3d = document.getElementById("events3d");

if (events3d) {
    const TOTAL = 4;
    const STEP = 360 / TOTAL;
    let angle = 0;
    let targetAngle = 0;
    let autoMode = true;
    let paused = false;
    const AUTO_SPEED = 0.15;

    const scene = document.getElementById("eventsScene");
    const dots = document.querySelectorAll("#evDots .dot");

    function lerp(a, b, t) { return a + (b - a) * t; }

    function updateDots() {
        const normalized = (((-angle) % 360) + 360) % 360;
        const activeIdx = Math.round(normalized / STEP) % TOTAL;
        dots.forEach((d, i) => d.classList.toggle("active", i === activeIdx));
    }

    function carouselLoop() {
        if (autoMode && !paused) {
            targetAngle -= AUTO_SPEED;
            angle = targetAngle;
        } else if (!autoMode) {
            angle = lerp(angle, targetAngle, 0.08);
            if (Math.abs(angle - targetAngle) < 0.05) {
                angle = targetAngle;
                autoMode = true;
            }
        }
        events3d.style.transform = `rotateY(${angle}deg)`;
        updateDots();
        requestAnimationFrame(carouselLoop);
    }

    carouselLoop();

    if (scene) {
        scene.addEventListener("mouseenter", () => { paused = true; });
        scene.addEventListener("mouseleave", () => { paused = false; });
    }

    function navigate(dir) {
        const snapped = Math.round(angle / STEP) * STEP;
        targetAngle = snapped + dir * STEP;
        autoMode = false;
    }

    const prevBtn = document.getElementById("evPrev");
    const nextBtn = document.getElementById("evNext");
    if (prevBtn) prevBtn.addEventListener("click", () => navigate(1));
    if (nextBtn) nextBtn.addEventListener("click", () => navigate(-1));

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            targetAngle = -(i * STEP);
            autoMode = false;
        });
    });
}

// ── Terminal CSH ──
const input  = document.getElementById("input");
const output = document.getElementById("output");

if (input && output) {

    const commandHistory = [];
    let histIdx = -1;

    function addLine(text, cls) {
        const div = document.createElement("div");
        div.textContent = text;
        if (cls) div.className = cls;
        output.appendChild(div);
    }

    function addSpacer() {
        output.appendChild(document.createElement("div"));
    }

    function printLines(lines) {
        lines.forEach(({ text, cls }) => addLine(text || "", cls || ""));
        addSpacer();
        output.scrollTop = output.scrollHeight;
    }

    function printCommand(cmd) {
        const line = document.createElement("div");
        const promptSpan = document.createElement("span");
        promptSpan.textContent = "csh@utec:~$ ";
        promptSpan.className = "t-prompt";
        const cmdSpan = document.createElement("span");
        cmdSpan.textContent = cmd;
        cmdSpan.className = "t-cmd";
        line.appendChild(promptSpan);
        line.appendChild(cmdSpan);
        output.appendChild(line);
    }

    const COMMANDS = {
        help: () => [
            { text: "Comandos disponibles:", cls: "t-blue" },
            { text: "  whoami   — identidad de CSH" },
            { text: "  about    — sobre la organización" },
            { text: "  mission  — misión y visión" },
            { text: "  ls       — estructura del sitio" },
            { text: "  team     — ver el equipo" },
            { text: "  events   — historial de eventos" },
            { text: "  ctf      — info sobre CTFs" },
            { text: "  contact  — redes sociales" },
            { text: "  join     — cómo unirse a CSH" },
            { text: "  flag     — encuentra la flag 🚩" },
            { text: "  sudo     — ¿te atreves?" },
            { text: "  nmap     — escanear CSH" },
            { text: "  pwd      — ubicación actual" },
            { text: "  date     — fecha y hora" },
            { text: "  clear    — limpiar consola" },
        ],

        whoami: () => [
            { text: "CSH — Cybersecurity Student Hub", cls: "t-green" },
            { text: "Organización estudiantil de ciberseguridad en UTEC, Lima — Perú." },
            { text: "Formando talento en seguridad ofensiva, defensiva y cultura hacker ética." },
        ],

        about: () => [
            { text: "┌─[ CSH — Cybersecurity Student Hub ]", cls: "t-blue" },
            { text: "│" },
            { text: "│  Fundada en UTEC para consolidar una comunidad técnica en ciberseguridad." },
            { text: "│" },
            { text: "│  → Talleres de networking y hacking ético" },
            { text: "│  → Participación en CTFs nacionales e internacionales" },
            { text: "│  → Investigación aplicada y cultura hacker" },
            { text: "│  → Alianzas con empresas del ecosistema tech" },
            { text: "│" },
            { text: "└─[ Slogan: HACK OR BE HACKED ]", cls: "t-blue" },
        ],

        mission: () => [
            { text: "MISIÓN", cls: "t-yellow" },
            { text: "  Desarrollar talento en ciberseguridad mediante formación técnica," },
            { text: "  competencias, investigación aplicada y cultura hacker ética." },
            { text: "" },
            { text: "VISIÓN", cls: "t-yellow" },
            { text: "  Ser la comunidad universitaria referente en ciberseguridad en el Perú," },
            { text: "  reconocida por excelencia técnica e impacto académico." },
        ],

        ls: () => [
            { text: "total 6", cls: "t-gray" },
            { text: "drwxr-xr-x  sobre/     — Quiénes somos", cls: "t-blue" },
            { text: "drwxr-xr-x  anuncios/  — Noticias del capítulo" },
            { text: "drwxr-xr-x  eventos/   — Actividades realizadas", cls: "t-blue" },
            { text: "drwxr-xr-x  writeups/  — Materiales y PDFs" },
            { text: "drwxr-xr-x  equipo/    — El team CSH", cls: "t-blue" },
            { text: "drwxr-xr-x  unete/     — Formulario de postulación" },
            { text: "-rw-r--r--  flag.txt   — ???", cls: "t-dim" },
        ],

        team: () => [
            { text: "┌─[ EQUIPO CSH 2026 ]──────────────────────────", cls: "t-blue" },
            { text: "│  Diego Godoy         Coordinador General" },
            { text: "│  Benjamin Toro       SubCoordinador General" },
            { text: "│  Omar Chavarría      Coordinador Interno" },
            { text: "│  Brisseth Surquilla  Coordinadora de Investigación" },
            { text: "│  Solange Minez       Coordinadora de Eventos" },
            { text: "│  Brigitte Rojas      Alianzas Estratégicas" },
            { text: "│  Gustavo Ortiz       Consultor Externo" },
            { text: "│  Gabriel Blanco      Consultor Ciberseguridad" },
            { text: "│  Mishelle Villarreal Subcoordinadora de Marketing" },
            { text: "└───────────────────────────────────────────────", cls: "t-blue" },
        ],

        events: () => [
            { text: "┌─[ EVENTOS CSH ]", cls: "t-blue" },
            { text: "│  [✓] Choco Ciber UNI       — Realizado", cls: "t-green" },
            { text: "│  [✓] Hack The Future        — Realizado", cls: "t-green" },
            { text: "│  [✓] Taller 1 de Ciber      — Realizado", cls: "t-green" },
            { text: "│  [ ] Próximos eventos...    — En preparación", cls: "t-yellow" },
            { text: "└─ Sigue @csh.utec para novedades", cls: "t-blue" },
        ],

        ctf: () => [
            { text: "┌─[ CTF — Capture The Flag ]", cls: "t-blue" },
            { text: "│  CSH participa en competencias CTF activamente." },
            { text: "│" },
            { text: "│  Plataformas recomendadas:", cls: "t-yellow" },
            { text: "│    → Hack The Box (HTB)    hackthebox.com" },
            { text: "│    → TryHackMe             tryhackme.com" },
            { text: "│    → PicoCTF               picoctf.org" },
            { text: "│    → CTFtime               ctftime.org" },
            { text: "└─ ¿Tienes una flag? Intenta: flag", cls: "t-blue" },
        ],

        contact: () => [
            { text: "┌─[ REDES SOCIALES ]", cls: "t-blue" },
            { text: "│  Instagram  → instagram.com/csh.utec" },
            { text: "│  LinkedIn   → linkedin.com/company/csh-utec" },
            { text: "│  GitHub     → github.com/csh-utec" },
            { text: "│  Discord    → discord.gg/zh6ccAs3fC" },
            { text: "│  WhatsApp   → comunidad abierta (ver footer)" },
            { text: "└─────────────────────────────────────", cls: "t-blue" },
        ],

        join: () => [
            { text: "┌─[ ÚNETE A CSH ]", cls: "t-green" },
            { text: "│  Postula en:" },
            { text: "│  forms.gle/EiUBtWVxYbdM5zFa9", cls: "t-blue" },
            { text: "│" },
            { text: "│  O ve a la sección 'Únete' en esta página." },
            { text: "└─ ¡Te esperamos! 🔐", cls: "t-green" },
        ],

        flag: () => [
            { text: "[*] Buscando flag...", cls: "t-yellow" },
            { text: "[*] Accediendo a /csh/utec/flag.txt...", cls: "t-yellow" },
            { text: "" },
            { text: "CSH{h4ck_0r_b3_h4ck3d_ut3c_2026}", cls: "t-flag" },
            { text: "" },
            { text: "[+] ¡Felicidades! Encontraste la flag. 🚩", cls: "t-green" },
        ],

        sudo: () => [
            { text: "[sudo] contraseña para csh-user:", cls: "t-yellow" },
            { text: "Sorry, user csh-user is not in the sudoers file.", cls: "t-red" },
            { text: "This incident will be reported... just kidding 😄" },
        ],

        nmap: () => [
            { text: "Starting Nmap 7.94 ( nmap.org )", cls: "t-gray" },
            { text: "Scanning csh.utec (2026-utec-net)...", cls: "t-yellow" },
            { text: "" },
            { text: "Host: csh.utec  Status: UP ✓", cls: "t-green" },
            { text: "" },
            { text: "PORT    STATE  SERVICE", cls: "t-blue" },
            { text: "80/tcp  open   http      [ KNOWLEDGE ]" },
            { text: "443/tcp open   https     [ SKILLS ]" },
            { text: "9001    open   ctf-srv   [ HACKING ]" },
            { text: "31337   open   elite     [ CULTURE ]" },
            { text: "" },
            { text: "Nmap done: 1 IP address (1 host up) — 4 ports open", cls: "t-gray" },
        ],

        pwd: () => [
            { text: "/csh/utec/cybersecurity", cls: "t-blue" },
        ],

        date: () => [
            { text: new Date().toString(), cls: "t-gray" },
        ],
    };

    function processCommand(raw) {
        const cmd = raw.trim().toLowerCase();

        if (cmd === "") return;

        commandHistory.unshift(raw.trim());
        histIdx = -1;

        printCommand(raw.trim());

        if (cmd === "clear") {
            output.innerHTML = "";
            return;
        }

        if (cmd.startsWith("sudo rm") || cmd.startsWith("sudo reboot") || cmd.startsWith("sudo shutdown")) {
            printLines([
                { text: "⚠  Permiso denegado. Sabemos lo que intentas... 👀", cls: "t-red" },
            ]);
            return;
        }

        if (cmd.startsWith("sudo ")) {
            printLines(COMMANDS.sudo());
            return;
        }

        if (COMMANDS[cmd]) {
            printLines(COMMANDS[cmd]());
        } else {
            printLines([
                { text: `bash: ${raw.trim()}: command not found`, cls: "t-red" },
                { text: "Escribe 'help' para ver los comandos disponibles." },
            ]);
        }
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (histIdx < commandHistory.length - 1) histIdx++;
            input.value = commandHistory[histIdx] || "";
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (histIdx > 0) { histIdx--; input.value = commandHistory[histIdx] || ""; }
            else { histIdx = -1; input.value = ""; }
        }
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            processCommand(input.value);
            input.value = "";
        }
    });

    // Mensaje de bienvenida
    printLines([
        { text: "╔══════════════════════════════════════════════╗", cls: "t-dim" },
        { text: "║   CSH Terminal v1.0 — Cybersecurity Hub     ║", cls: "t-blue" },
        { text: "╚══════════════════════════════════════════════╝", cls: "t-dim" },
        { text: "" },
        { text: "Bienvenido. Escribe 'help' para ver los comandos.", cls: "t-green" },
        { text: "Tip: prueba 'whoami', 'nmap' o busca la 'flag' 🚩", cls: "t-gray" },
    ]);
}

// ── Scroll reveal ──
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
        { threshold: 0.1 }
    );

    sections.forEach((sec) => observer.observe(sec));
} else {
    sections.forEach((sec) => sec.classList.add("visible"));
}

// ── Animación escalonada Misión/Visión (entrada al hacer scroll) ──
const sobreFlips = document.querySelectorAll(".sobre-flip");
if ("IntersectionObserver" in window && sobreFlips.length) {
    sobreFlips.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = `opacity 0.55s ease ${i * 0.18}s, transform 0.55s ease ${i * 0.18}s`;
    });

    const sobreObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    sobreObs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    sobreFlips.forEach((el) => sobreObs.observe(el));
}

// ── Carrusel infinito del equipo ──
const teamTrack = document.querySelector(".team-track");
if (teamTrack) {
    const cards = teamTrack.querySelectorAll(".member-card");
    cards.forEach((c) => {
        const clone = c.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        teamTrack.appendChild(clone);
    });
}

// ── Footer dinámico ──
const footerText = document.getElementById("footer-text");
if (footerText) {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const yearLabel = currentYear > startYear ? `${startYear}–${currentYear}` : `${currentYear}`;
    footerText.textContent = `© ${yearLabel} CSH — Todos los derechos reservados.`;
}
