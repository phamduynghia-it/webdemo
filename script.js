document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.getElementById("text-container");
    const sparkleContainer = document.getElementById("sparkle-container");
    const backgroundAudio = document.getElementById("backgroundAudio");
    let audioPlayed = false;

    const messages = [
        "Anh yêu vợ Điệp 😘",
        "I Love You ❤️",
        "I Will Always Be By Your Side",
        "I'll Wait For You",
        "Always Love You 😘",
    ];
    let messageIndex = 0; // Index cho chữ rơi theo thứ tự

    // MẢNG CHỨA CÁC FILE ẢNH (thay thế bằng tên file ảnh thực tế của bạn)
    const imageFiles = ["a1.jpg", "a2.jpg", "a3.jpg"];

    let imageIndex = 0; // Index cho ảnh rơi theo thứ tự

    const colors = ["white", "pink"];
    const isMobile = window.innerWidth < 768;

    // --- AUDIO ---
    function playAudioOnInteraction() {
        if (backgroundAudio && !audioPlayed) {
            backgroundAudio
                .play()
                .then(() => {
                    audioPlayed = true;
                    document.removeEventListener(
                        "touchstart",
                        playAudioOnInteraction
                    );
                    document.removeEventListener(
                        "click",
                        playAudioOnInteraction
                    );
                })
                .catch((error) => console.error("Lỗi phát âm thanh:", error));
        }
    }
    document.addEventListener("touchstart", playAudioOnInteraction, {
        once: true,
        passive: true,
    });
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
        sparkle.style.animationDuration =
            Math.random() * options.animDurationRange +
            options.animBaseDuration +
            "s";
        sparkle.style.animationDelay =
            Math.random() * options.animBaseDuration + "s";
        sparkleContainer.appendChild(sparkle);
    }

    function initSparkles() {
        const sparkleOptions = {
            count: isMobile ? 70 : 120,
            minSize: 1,
            maxSize: 2,
            animBaseDuration: 1.2,
            animDurationRange: 1.5,
        };
        for (let i = 0; i < sparkleOptions.count; i++)
            createSparkle(sparkleOptions);
        setInterval(
            () => {
                // Sao băng
                const starElement = document.createElement("div");
                starElement.classList.add("shooting-star");
                const tailLength = Math.random() * 100 + 80;
                const durationSec = Math.random() * 2.5 + 3.5;
                starElement.style.setProperty(
                    "--shooting-star-length",
                    `${tailLength}px`
                );
                starElement.style.animationDuration = `${durationSec}s`;
                starElement.style.setProperty(
                    "--shooting-star-duration",
                    `${durationSec}s`
                );
                const screenWidth = window.innerWidth,
                    screenHeight = window.innerHeight;
                const travelDistance =
                    screenHeight * (0.7 + Math.random() * 0.3);
                const side = Math.floor(Math.random() * 4);
                let startX, startY, endX, endY, initialAngleDeg;
                switch (side) {
                    case 0:
                        startX = Math.random() * screenWidth;
                        startY = -tailLength;
                        initialAngleDeg = Math.random() * 60 + 150;
                        break;
                    case 1:
                        startX = screenWidth + tailLength;
                        startY = Math.random() * screenHeight;
                        initialAngleDeg = Math.random() * 60 + 240;
                        break;
                    case 2:
                        startX = Math.random() * screenWidth;
                        startY = screenHeight + tailLength;
                        initialAngleDeg = Math.random() * 60 - 120;
                        break;
                    default:
                        startX = -tailLength;
                        startY = Math.random() * screenHeight;
                        initialAngleDeg = Math.random() * 60 - 30;
                }
                endX =
                    startX +
                    travelDistance *
                        Math.cos((initialAngleDeg * Math.PI) / 180);
                endY =
                    startY +
                    travelDistance *
                        Math.sin((initialAngleDeg * Math.PI) / 180);
                const angleDeg =
                    (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI +
                    90;
                starElement.style.setProperty("--angle", `${angleDeg}deg`);
                starElement.style.setProperty("--start-x", `${startX}px`);
                starElement.style.setProperty("--start-y", `${startY}px`);
                starElement.style.setProperty("--end-x", `${endX}px`);
                starElement.style.setProperty("--end-y", `${endY}px`);
                sparkleContainer.appendChild(starElement);
                setTimeout(() => {
                    if (sparkleContainer.contains(starElement))
                        sparkleContainer.removeChild(starElement);
                }, durationSec * 1000 + 200);
            },
            isMobile ? 2000 : 2500
        );
    }

    // --- TEXT / HEART / IMAGE ---
    function createFallingElement(type, options) {
        const el = document.createElement("div");
        el.style.left = `${
            Math.random() * options.horizontalRange.range +
            options.horizontalRange.offset
        }vw`;

        if (type === "image") {
            el.classList.add("falling-image");
            const img = document.createElement("img");
            // Lấy ảnh từ mảng imageFiles theo thứ tự
            if (imageFiles.length > 0) {
                // Kiểm tra xem mảng có ảnh không
                img.src = imageFiles[imageIndex % imageFiles.length];
                imageIndex++; // Tăng index cho lần tạo ảnh tiếp theo
            } else {
                img.src = "cs.jpg"; // Ảnh mặc định nếu mảng rỗng
            }
            el.appendChild(img);
            el.style.width = isMobile ? "23vw" : options.imageSize();
        }

        const z = Math.random() * options.zRange - options.zRange / 2;
        el.style.setProperty("--initial-z-transform", `translateZ(${z}px)`);

        let baseSizeValue = 20;
        let unit = "px";

        if (type === "text") {
            el.classList.add("falling-text");
            el.textContent = messages[messageIndex % messages.length];
            messageIndex++;
            const colorClass = colors[messageIndex % colors.length]; // Màu cũng theo thứ tự của messageIndex
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
        // Với ảnh, baseSizeValue và unit không dùng để set fontSize, nhưng scale vẫn áp dụng
        const scale =
            options.depthScale.min +
            (options.depthScale.max - options.depthScale.min) *
                ((z + options.zRange / 2) / options.zRange);
        if (type === "image") {
            el.style.transform = `scale(${scale})`; // Scale trực tiếp cho div chứa ảnh
        } else {
            el.style.fontSize = (baseSizeValue * scale).toFixed(2) + unit;
        }

        const duration =
            Math.random() * options.durationRange.random +
            options.durationRange.base;
        const delay = Math.random() * options.delayRange;
        el.style.setProperty("--fall-duration", duration + "s");
        el.style.setProperty("--fall-delay", delay + "s");

        textContainer.appendChild(el);
    }

    // --- ROTATION ---
    function setupRotation(target, maxRotateDeg) {
        let rx = 0,
            ry = 0;
        let animationFrameRequested = false;
        function animate() {
            target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
            animationFrameRequested = false;
        }
        function requestAnimation() {
            if (!animationFrameRequested) {
                requestAnimationFrame(animate);
                animationFrameRequested = true;
            }
        }
        if (isMobile) {
            document.addEventListener(
                "touchmove",
                (e) => {
                    if (e.touches.length === 1) {
                        const x = e.touches[0].clientX,
                            y = e.touches[0].clientY;
                        const px =
                            (x - window.innerWidth / 2) /
                            (window.innerWidth / 2);
                        const py =
                            (y - window.innerHeight / 2) /
                            (window.innerHeight / 2);
                        ry = px * maxRotateDeg;
                        rx = -py * maxRotateDeg;
                        requestAnimation();
                    }
                },
                { passive: true }
            );
        } else {
            document.addEventListener("mousemove", (e) => {
                const px =
                    (e.clientX - window.innerWidth / 2) /
                    (window.innerWidth / 2);
                const py =
                    (e.clientY - window.innerHeight / 2) /
                    (window.innerHeight / 2);
                ry = px * maxRotateDeg;
                rx = -py * maxRotateDeg;
                requestAnimation();
            });
            document.addEventListener("mouseleave", () => {
                rx = 0;
                ry = 0;
                requestAnimation();
            });
        }
        requestAnimation();
    }

    // --- SETTINGS ---
    const opts = isMobile
        ? {
              fontSize: () => 2.6 + Math.random() * 1.4 + "vmin",
              heartSize: () => 2.8 + Math.random() * 1.2 + "vmin",
              imageSize: () => "25vw", // Vẫn giữ để tham chiếu, nhưng width được set cứng là 25vw cho mobile
              // imageUrl không còn cần ở đây vì ảnh được lấy từ mảng imageFiles
              zRange: 650,
              depthScale: { min: 0.8, max: 2 },
              durationRange: { base: 5, random: 6 },
              creationIntervalTime: { text: 2000, heart: 2000, image: 10000 },
              delayRange: 2,
              initialCount: { text: 15, heart: 10, image: 2 }, // Số ảnh ban đầu
              maxRotateDeg: 22,
              horizontalRange: { range: 180, offset: -40 },
          }
        : {
              // PC Options
              fontSize: () => Math.random() * 10 + 18 + "px",
              heartSize: () => Math.random() * 10 + 22 + "px",
              imageSize: () => "150px", // Kích thước ảnh cho PC
              // imageUrl không còn cần ở đây
              zRange: 800,
              depthScale: { min: 0.75, max: 1.25 },
              durationRange: { base: 15, random: 10 },
              creationIntervalTime: { text: 1500, heart: 1500, image: 5000 },
              delayRange: 10,
              initialCount: { text: 10, heart: 4, image: 2 }, // Số ảnh ban đầu
              maxRotateDeg: 15,
              horizontalRange: { range: 100, offset: -5 },
          };

    initSparkles();
    // Tạo các phần tử ban đầu
    for (let i = 0; i < opts.initialCount.text; i++)
        createFallingElement("text", opts);
    for (let i = 0; i < opts.initialCount.heart; i++)
        createFallingElement("heart", opts);
    for (let i = 0; i < opts.initialCount.image; i++)
        createFallingElement("image", opts);

    // Tạo các phần tử theo chu kỳ
    setInterval(
        () => createFallingElement("text", opts),
        opts.creationIntervalTime.text
    );
    setInterval(
        () => createFallingElement("heart", opts),
        opts.creationIntervalTime.heart
    );
    setInterval(
        () => createFallingElement("image", opts),
        opts.creationIntervalTime.image
    );

    setupRotation(textContainer, opts.maxRotateDeg);
});
