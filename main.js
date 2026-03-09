console.log('Verglas: main.js loading started...');
document.body.classList.add('js-ready');

// Utility: Throttle function to limit execution rate
const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
};

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.05 // Lower threshold for better trigger
};

console.log('Verglas: Initializing animation observer...');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Do NOT add fade-in class here, it already exists in HTML
        }
    });
}, observerOptions);

// Observe all potential revealable elements
document.querySelectorAll('section, header, .pop-up, .reveal, .reveal-inner, .fade-in, .hero-content').forEach(el => {
    observer.observe(el);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Header scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 50));
// Three.js Hero Background
const initHero3D = () => {
    const canvas = document.querySelector('#hero-canvas');
    if (!canvas) return;

    try {
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x02A576, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Geometry - Floating Crystals
        const crystals = [];
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            flatShading: true,
            shininess: 100
        });

        for (let i = 0; i < 20; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            const scale = Math.random() * 0.5 + 0.1;
            mesh.scale.set(scale, scale, scale);
            scene.add(mesh);
            crystals.push({
                mesh,
                speed: Math.random() * 0.01,
                rotSpeed: Math.random() * 0.02
            });
        }

        let isVisible = true;
        let animationId;
        let mouseX = 0, mouseY = 0;

        const animate = () => {
            if (!isVisible) return;
            animationId = requestAnimationFrame(animate);

            crystals.forEach(c => {
                c.mesh.rotation.x += c.rotSpeed;
                c.mesh.rotation.y += c.rotSpeed;
                c.mesh.position.y += Math.sin(Date.now() * 0.001) * 0.002;
            });

            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        const threeObserver = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible) animate();
            else cancelAnimationFrame(animationId);
        }, { threshold: 0.1 });

        threeObserver.observe(canvas);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Parallax update
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;

            const tiltContainer = document.querySelector('.logo-tilt-container');
            if (tiltContainer) {
                const tiltX = mouseY * 40;
                const tiltY = -mouseX * 40;
                tiltContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }
        });

    } catch (err) {
        console.error('Verglas: Three.js init error:', err);
    }
};

// Sparkle Effect
const createSparkles = throttle((e) => {
    const maxSparkles = 10;
    if (document.querySelectorAll('.sparkle').length >= maxSparkles) return;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';

    const size = Math.random() * 5 + 2;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';

    const colors = ['#02A576', '#ffffff', '#ffd700'];
    sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}, 50);

document.addEventListener('mousemove', createSparkles);

// Initialize Three.js if available
if (typeof THREE !== 'undefined') {
    initHero3D();
}

console.log('Verglas: All effects initialized.');

