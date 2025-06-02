document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.getElementById("text-container");
    const sparkleContainer = document.getElementById("sparkle-container");
    const backgroundAudio = document.getElementById("backgroundAudio");
    let audioPlayed = false;

    const messages = [
    , "Em Yêu Anh 😘", "I Love You ❤️", "A yêu e", "Chỉ yêu mình em"
       , "Em Nhớ Anh", "I Will Always Be By Your Side",
        "I'll Wait For You", "Always Love You 😘",
    ];
    let messageIndex = 0;

    const colors = ["white", "pink"];
    const isMobile = window.innerWidth < 768;

    // --- AUDIO ---
    function playAudioOnInteraction() { /* ... Giữ nguyên ... */
        if (backgroundAudio && !audioPlayed) {
            backgroundAudio.play().then(() => {
                audioPlayed = true;
                document.removeEventListener("touchstart", playAudioOnInteraction);
                document.removeEventListener("click", playAudioOnInteraction);
            }).catch((error) => console.error("Lỗi phát âm thanh:", error));
        }
    }
    document.addEventListener("touchstart", playAudioOnInteraction, { once: true, passive: true });
    document.addEventListener("click", playAudioOnInteraction, { once: true });

    // --- SPARKLES ---
    function createSparkle(options) { /* ... Giữ nguyên ... */
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        const size = Math.random() * options.maxSize + options.minSize;
        sparkle.style.width = size + "px"; sparkle.style.height = size + "px";
        sparkle.style.top = Math.random() * 100 + "%"; sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.animationDuration = (Math.random() * options.animDurationRange + options.animBaseDuration) + "s";
        sparkle.style.animationDelay = Math.random() * options.animBaseDuration + "s";
        sparkleContainer.appendChild(sparkle);
    }

    function initSparkles() { /* ... Giữ nguyên, kể cả sao băng ... */
        const sparkleOptions = {
            count: isMobile ? 70 : 120, minSize: 1, maxSize: 2,
            animBaseDuration: 1.2, animDurationRange: 1.5,
        };
        for (let i = 0; i < sparkleOptions.count; i++) createSparkle(sparkleOptions);
        setInterval(() => { // Sao băng
            const starElement = document.createElement("div");
            starElement.classList.add("shooting-star");
            const tailLength = Math.random() * 100 + 80;
            const durationSec = Math.random() * 2.5 + 3.5;
            starElement.style.setProperty("--shooting-star-length", `${tailLength}px`);
            starElement.style.animationDuration = `${durationSec}s`;
            starElement.style.setProperty("--shooting-star-duration", `${durationSec}s`);
            const screenWidth = window.innerWidth, screenHeight = window.innerHeight;
            const travelDistance = screenHeight * (0.7 + Math.random() * 0.3);
            const side = Math.floor(Math.random() * 4);
            let startX, startY, endX, endY, initialAngleDeg;
            switch (side) {
                case 0: startX = Math.random() * screenWidth; startY = -tailLength; initialAngleDeg = Math.random() * 60 + 150; break;
                case 1: startX = screenWidth + tailLength; startY = Math.random() * screenHeight; initialAngleDeg = Math.random() * 60 + 240; break;
                case 2: startX = Math.random() * screenWidth; startY = screenHeight + tailLength; initialAngleDeg = Math.random() * 60 - 120; break;
                default: startX = -tailLength; startY = Math.random() * screenHeight; initialAngleDeg = Math.random() * 60 - 30;
            }
            endX = startX + travelDistance * Math.cos(initialAngleDeg * Math.PI / 180);
            endY = startY + travelDistance * Math.sin(initialAngleDeg * Math.PI / 180);
            const angleDeg = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI + 90;
            starElement.style.setProperty("--angle", `${angleDeg}deg`);
            starElement.style.setProperty("--start-x", `${startX}px`);
            starElement.style.setProperty("--start-y", `${startY}px`);
            starElement.style.setProperty("--end-x", `${endX}px`);
            starElement.style.setProperty("--end-y", `${endY}px`);
            sparkleContainer.appendChild(starElement);
            setTimeout(() => { if (sparkleContainer.contains(starElement)) sparkleContainer.removeChild(starElement); }, durationSec * 1000 + 200);
        }, isMobile ? 2000 : 2500);
    }

    // --- TEXT / HEART / IMAGE ---
    function createFallingElement(type, options) {
        const el = document.createElement("div");
        let xPositionVw;

        // ÁP DỤNG LOGIC VỊ TRÍ NGANG NGẪU NHIÊN CHO CẢ ẢNH
        xPositionVw = Math.random() * options.horizontalRange.range + options.horizontalRange.offset;
        el.style.left = `${xPositionVw}vw`;

        if (type === "image") {
            el.classList.add("falling-image");
            const img = document.createElement("img");
            img.src = options.imageUrl || "anhgai.jpg";
            el.appendChild(img);
            // Kích thước ảnh vẫn được đặt
            el.style.width = isMobile ? "25vw" : options.imageSize(); // Dùng "25vw" cho mobile, options.imageSize() cho PC
            // el.style.height = "auto"; // Hoặc đặt chiều cao nếu muốn kiểm soát tỷ lệ
        }
        // Các phần khác của hàm không thay đổi cho type "image" về vị trí

        const z = Math.random() * options.zRange - options.zRange / 2;
        el.style.setProperty("--initial-z-transform", `translateZ(${z}px)`);

        let baseSizeValue = 20;
        let unit = "px";

        if (type === "text") {
            el.classList.add("falling-text");
            el.textContent = messages[messageIndex % messages.length];
            messageIndex++;
            const colorClass = colors[messageIndex % colors.length];
            if (colorClass !== "white") el.classList.add(colorClass);
            const fontSizeStr = options.fontSize();
            baseSizeValue = parseFloat(fontSizeStr);
            unit = fontSizeStr.match(/[a-z%]+/g)[0];
        } else if (type === "heart") {
            el.classList.add("falling-heart");
            el.textContent = "❤️";
            const heartSizeStr = options.heartSize();
            baseSizeValue = parseFloat(heartSizeStr);
            unit = heartSizeStr.match(/[a-z%]+/g)[0];
        }
        // Với ảnh, baseSizeValue và unit không được dùng để set fontSize cho el
        // nhưng vẫn cần cho tính toán scale nếu bạn muốn ảnh cũng scale theo chiều sâu.

        const scale = options.depthScale.min + (options.depthScale.max - options.depthScale.min) * ((z + options.zRange / 2) / options.zRange);
        if (type === "image") {
            el.style.transform = `scale(${scale})`; // Scale trực tiếp cho div chứa ảnh
            // Nếu muốn vị trí Z ảnh hưởng đến transform-origin khi xoay, bạn có thể set perspective cho textContainer
            // và dùng translateZ trên el. Hiện tại --initial-z-transform đã làm điều đó cho animation rơi.
        } else {
            el.style.fontSize = (baseSizeValue * scale).toFixed(2) + unit;
        }

        const duration = Math.random() * options.durationRange.random + options.durationRange.base;
        const delay = Math.random() * options.delayRange;
        el.style.setProperty("--fall-duration", duration + "s");
        el.style.setProperty("--fall-delay", delay + "s");

        textContainer.appendChild(el);
    }

    // --- ROTATION ---
    function setupRotation(target, maxRotateDeg) { /* ... Giữ nguyên ... */
        let rx = 0, ry = 0; let animationFrameRequested = false;
        function animate() { target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; animationFrameRequested = false; }
        function requestAnimation() { if (!animationFrameRequested) { requestAnimationFrame(animate); animationFrameRequested = true; } }
        if (isMobile) {
            document.addEventListener("touchmove", (e) => {
                if (e.touches.length === 1) {
                    const x = e.touches[0].clientX, y = e.touches[0].clientY;
                    const px = (x - window.innerWidth / 2) / (window.innerWidth / 2);
                    const py = (y - window.innerHeight / 2) / (window.innerHeight / 2);
                    ry = px * maxRotateDeg; rx = -py * maxRotateDeg; requestAnimation();
                }
            }, { passive: true });
        } else {
            document.addEventListener("mousemove", (e) => {
                const px = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
                const py = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
                ry = px * maxRotateDeg; rx = -py * maxRotateDeg; requestAnimation();
            });
            document.addEventListener("mouseleave", () => { rx = 0; ry = 0; requestAnimation(); });
        }
        requestAnimation();
    }

    // --- SETTINGS ---
    const opts = isMobile ? {
        fontSize: () => 2.6 + Math.random() * 1.4 + "vmin",
        heartSize: () => 2.8 + Math.random() * 1.2 + "vmin",
        imageSize: () => "25vw", // Vẫn giữ để tham chiếu nếu cần, nhưng width được set cứng
        imageUrl: "anhgai.jpg",
        zRange: 650,
        depthScale: { min: 0.8, max: 2 },
        durationRange: { base: 8, random: 6 },
        creationIntervalTime: { text: 2000, heart: 2000, image: 7000 },
        delayRange: 2,
        initialCount: { text: 20, heart: 10, image: 1 },
        maxRotateDeg: 22,
        horizontalRange: { range: 180, offset: -40 }, // Áp dụng cho cả ảnh, text, heart
    } : { // PC Options
        fontSize: () => Math.random() * 10 + 18 + "px",
        heartSize: () => Math.random() * 10 + 22 + "px",
        imageSize: () => "150px", // Kích thước ảnh cho PC
        imageUrl: "anhgai.jpg",
        zRange: 800,
        depthScale: { min: 0.75, max: 1.25 },
        durationRange: { base: 15, random: 10 },
        creationIntervalTime: { text: 1500, heart: 1500, image: 5000 },
        delayRange: 10,
        initialCount: { text: 10, heart: 4, image: 2 },
        maxRotateDeg: 15,
        horizontalRange: { range: 100, offset: -5 }, // Áp dụng cho cả ảnh, text, heart
    };

    initSparkles();
    for (let i = 0; i < opts.initialCount.text; i++) createFallingElement("text", opts);
    for (let i = 0; i < opts.initialCount.heart; i++) createFallingElement("heart", opts);
    for (let i = 0; i < opts.initialCount.image; i++) createFallingElement("image", opts);

    setInterval(() => createFallingElement("text", opts), opts.creationIntervalTime.text);
    setInterval(() => createFallingElement("heart", opts), opts.creationIntervalTime.heart);
    setInterval(() => createFallingElement("image", opts), opts.creationIntervalTime.image);

    setupRotation(textContainer, opts.maxRotateDeg);
});