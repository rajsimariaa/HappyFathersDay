// main.js

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

gsap.registerPlugin(ScrollTrigger);

// === 1. Particle Canvas Background ===
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.1
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`; // Gold color
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
window.addEventListener('resize', initCanvas);
initCanvas();
animateParticles();

// === 2. Audio Setup ===
let ytPlayer;
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-audio', {
        height: '0', width: '0',
        videoId: 'mGC-S7n_HkE',
        playerVars: { 'autoplay': 0, 'controls': 0, 'start': 0, 'loop': 1, 'playlist': 'mGC-S7n_HkE' }
    });
}
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// === 3. Vanilla Text Splitter ===
function splitText(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText.replace(/\n/g, ' '); 
        el.innerHTML = '';
        const words = text.split(' ');
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            [...word].forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.innerText = char;
                charSpan.style.opacity = '0'; // Hidden by default
                charSpan.style.display = 'inline-block';
                charSpan.style.transform = 'translateY(20px)';
                wordSpan.appendChild(charSpan);
            });
            el.appendChild(wordSpan);
            if (index < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.className = 'char';
                spaceSpan.innerHTML = '&nbsp;';
                el.appendChild(spaceSpan);
            }
        });
    });
}
splitText('.split-chars');

// === 4. Main Sequence ===
window.addEventListener('load', () => {
    
    // Typewriter Entrance
    const textToType = "Some heroes don't wear capes...";
    const typeTarget = document.getElementById('typewriter-text');
    const enterBtn = document.getElementById('enter-btn');
    let i = 0;
    
    function typeWriter() {
        if (i < textToType.length) {
            typeTarget.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            gsap.to(enterBtn, { opacity: 1, duration: 1, delay: 0.5 });
        }
    }
    
    setTimeout(typeWriter, 1000);

    // Entrance Click
    const overlay = document.getElementById('entrance-overlay');
    enterBtn.addEventListener('click', () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        }
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();

        gsap.to(overlay, {
            opacity: 0,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                overlay.style.display = 'none';
                initScrollAnimations();
            }
        });
    });
});

// === 5. Scroll Animations ===
function initScrollAnimations() {
    
    // Panel Background Colors
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, i) => {
        if (i > 0) {
            const prevColor = panels[i-1].getAttribute('data-color') || '#050508';
            const currentColor = panel.getAttribute('data-color') || 'transparent';
            if (currentColor !== 'transparent') {
                gsap.fromTo("body", 
                    { backgroundColor: prevColor },
                    { 
                        backgroundColor: currentColor,
                        scrollTrigger: { trigger: panel, start: "top bottom", end: "top 30%", scrub: true }
                    }
                );
            }
        }
    });

    // Split Char Reveals
    gsap.utils.toArray('.split-chars').forEach(el => {
        const chars = el.querySelectorAll('.char');
        gsap.to(chars, {
            scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
            opacity: 1, y: 0, duration: 1, stagger: 0.05, ease: "back.out(1.5)"
        });
    });

    // Parallax
    gsap.utils.toArray('.parallax').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        gsap.to(el, {
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
            y: () => -100 * speed, ease: "none"
        });
    });

    // 3D Floating Typography Scroll
    const textScrollSection = document.getElementById('text-scroll');
    const textCards = gsap.utils.toArray('.text-card');
    
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: textScrollSection,
            start: "top top",
            end: () => "+=" + (window.innerHeight * textCards.length * 1.5), // Pin duration
            pin: true,
            scrub: 1
        }
    });

    // Animate each text block flying out of the dark void and drifting past the camera
    textCards.forEach((card, i) => {
        tl.fromTo(card, 
            { z: -4000, opacity: 0, scale: 0.5 },
            { z: 0, opacity: 1, scale: 1, duration: 2, ease: 'power1.inOut' },
            i === 0 ? 0 : "-=2" // Massively overlap the animations to eliminate blank screen gaps!
        )
        // Hold the text in the center briefly so it can be read
        .to({}, { duration: 1.5 })
        // Fly it past the camera
        .to(card, { z: 1500, opacity: 0, scale: 1.5, duration: 2, ease: 'power1.in' }, ">-0.5");
    });

    // Simple Fade Ins
    gsap.utils.toArray('.fade-in-up').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 50 }, {
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
            opacity: 1, y: 0, duration: 1.5, ease: "power2.out"
        });
    });

    // Finale Sunrise Glow
    gsap.to('.sunrise-overlay', {
        scrollTrigger: { trigger: '#final-panel', start: "top center", end: "bottom bottom", scrub: true },
        opacity: 1, ease: "none"
    });
}
