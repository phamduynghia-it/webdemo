document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.getElementById("text-container");
    const sparkleContainer = document.getElementById("sparkle-container");
    const backgroundAudio = document.getElementById("backgroundAudio");
    let audioPlayed = false;

    const messages = [
        "Cảm ơn vì em đã đến",
        "Anh sẽ luôn bên cạnh em",
        "Làm người yêu anh nhé ♡",
        "Anh yêu em nhiều lắm",
        "Lt.long ♡ Ha.phng",
        "Always by my side",
        "1 Year Anniversary",
        "Love u in every universe",
        "Mãi yêu thương <3",
        "Happy Anniversary!",
        "Our Journey Continues...",
        "Forever & Always"
    ];
    const colors = ["white", "pink"];
    const isMobile = window.innerWidth < 768;

    // --- AUDIO ---
    function playAudioOnInteraction() {
        if (backgroundAudio && !audioPlayed) {
            backgroundAudio.play().then(() => {
                audioPlayed = true;
                document.removeEventListener("touchstart", playAudioOnInteraction);
                document.removeEventListener("click", playAudioOnInteraction);
            }).catch(console.error);
        }
    }
    document.addEventListener("touchstart", playAudioOnInteraction, { once: true, passive: true });
    document.addEventListener("click", playAudioOnInteraction, { once: true });

    // --- SPARKLES ---
    function createSparkle(options) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        const size = Math.random() * options.maxSize + options.minSize;
        sparkle.style.width = size + "px";
        sparkle.style.height = size + "px";
        sparkle.style.top = Math.random() * 100 + "%";
        sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.animationDuration = (Math.random() * options.animDurationRange + options.animBaseDuration) + "s";
        sparkle.style.animationDelay = Math.random() * options.animMaxDelay + "s";
        sparkleContainer.appendChild(sparkle);
    }

    function initSparkles() {
        const sparkleOptions = {
            count: isMobile ? 30 : 60,
            minSize: 0.8,
            maxSize: 1.5,
            animBaseDuration: 1.8,
            animDurationRange: 2.5,
            animMaxDelay: 3.5
        };
        for (let i = 0; i < sparkleOptions.count; i++) createSparkle(sparkleOptions);
    }

    // --- NON-OVERLAPPING GRID ---
    const usedSlots = new Set();
    function getGridSlot(range, gridSize, axis) {
        const totalSlots = Math.floor(range / gridSize);
        let index, attempts = 0;
        do {
            index = Math.floor(Math.random() * totalSlots);
            attempts++;
        } while (usedSlots.has(`${axis}-${index}`) && attempts < totalSlots);
        usedSlots.add(`${axis}-${index}`);
        setTimeout(() => usedSlots.delete(`${axis}-${index}`), 3000);
        return index * gridSize;
    }

    // --- FALLING TEXT/HEART ---
    function createFallingElement(type, options) {
        const el = document.createElement("div");

        const x = getGridSlot(100, 10, 'x');
        const z = getGridSlot(options.zRange, 100, 'z') - options.zRange / 2;

        el.style.left = `${x}vw`;
        el.style.setProperty("--initial-z-transform", `translateZ(${z}px)`);

        let fontSize = 20;
        let unit = "px";

        if (type === "text") {
            el.classList.add("falling-text");
            el.textContent = messages[Math.floor(Math.random() * messages.length)];
            const colorClass = colors[Math.floor(Math.random() * colors.length)];
            if (colorClass !== "white") el.classList.add(colorClass);
            fontSize = parseFloat(options.fontSize());
            unit = options.fontSize().match(/[a-z%]+/g)[0];
        } else {
            el.classList.add("falling-heart");
            el.textContent = "❤️";
            fontSize = parseFloat(options.heartSize());
            unit = options.heartSize().match(/[a-z%]+/g)[0];
        }

        const scale = options.depthScale.min + (options.depthScale.max - options.depthScale.min) * ((z + options.zRange / 2) / options.zRange);
        el.style.fontSize = (fontSize * scale).toFixed(2) + unit;

        const duration = Math.random() * options.durationRange.random + options.durationRange.base;
        const delay = Math.random() * options.delayRange;
        el.style.setProperty("--fall-duration", duration + "s");
        el.style.setProperty("--fall-delay", delay + "s");

        textContainer.appendChild(el);
    }

    // --- ROTATION ---
    function setupRotation(target, maxRotateDeg) {
        let rx = 0, ry = 0;
        function animate() {
            target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
            requestAnimationFrame(animate);
        }
        animate();

        if (isMobile) {
            document.addEventListener("touchmove", (e) => {
                if (e.touches.length === 1) {
                    const x = e.touches[0].clientX, y = e.touches[0].clientY;
                    const px = (x - window.innerWidth / 2) / (window.innerWidth / 2);
                    const py = (y - window.innerHeight / 2) / (window.innerHeight / 2);
                    ry = px * maxRotateDeg;
                    rx = -py * maxRotateDeg;
                }
            }, { passive: true });
        } else {
            document.addEventListener("mousemove", (e) => {
                const px = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
                const py = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
                ry = px * maxRotateDeg;
                rx = -py * maxRotateDeg;
            });
            document.addEventListener("mouseleave", () => {
                rx = 0; ry = 0;
            });
        }
    }

    // --- SETTINGS ---
    const opts = isMobile ? {
        fontSize: () => (2.6 + Math.random() * 1.4) + 'vmin',
        heartSize: () => (2.8 + Math.random() * 1.2) + 'vmin',
        zRange: 650,
        depthScale: { min: 0.6, max: 1.4 },
        durationRange: { base: 2, random: 3 },
        creationIntervalTime: { text: 3800, heart: 5000 },
        delayRange: 1.5,
        initialCount: { text: 5, heart: 3 },
        maxRotateDeg: 22,
        horizontalRange: { range: 180, offset: -40 }
    } : {
        fontSize: () => Math.random() * 10 + 18 + "px",
        heartSize: () => Math.random() * 10 + 22 + "px",
        zRange: 1000,
        depthScale: { min: 0.75, max: 1.25 },
        durationRange: { base: 7, random: 7 },
        creationIntervalTime: { text: 2500, heart: 4000 },
        delayRange: 6,
        initialCount: { text: 10, heart: 3 },
        maxRotateDeg: 15,
        horizontalRange: { range: 100, offset: -5 }
    };

    initSparkles();
    for (let i = 0; i < opts.initialCount.text; i++) createFallingElement("text", opts);
    for (let i = 0; i < opts.initialCount.heart; i++) createFallingElement("heart", opts);
    setInterval(() => createFallingElement("text", opts), opts.creationIntervalTime.text);
    setInterval(() => createFallingElement("heart", opts), opts.creationIntervalTime.heart);
    setupRotation(textContainer, opts.maxRotateDeg);
});