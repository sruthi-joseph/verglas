// Three.js Hero Background
const initHero3D = () => {
    const canvas = document.querySelector('#hero-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
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

    // Mouse Parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;

        // Logo Tilt Logic
        const tiltContainer = document.querySelector('.logo-tilt-container');
        if (tiltContainer) {
            const tiltX = mouseY * 40; // Max tilt 40deg
            const tiltY = -mouseX * 40;
            tiltContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        }
    });

    const animate = () => {
        requestAnimationFrame(animate);

        crystals.forEach(c => {
            c.mesh.rotation.x += c.rotSpeed;
            c.mesh.rotation.y += c.rotSpeed;
            c.mesh.position.y += Math.sin(Date.now() * 0.001) * 0.002;
        });

        // Smooth camera movement
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
};

initHero3D();

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// Contact Form Submission (Mock)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your message! Our team will contact you via WhatsApp/Email shortly.');
        this.reset();
    });
}


// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('fade-in');
            if (entry.target.classList.contains('pop-up')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section, .pop-up, .reveal').forEach(el => {
    observer.observe(el);
});

// Enhanced Sparkle Effect
document.addEventListener('mousemove', (e) => {
    // Create multiple sparkles for a richer effect
    for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.4) continue;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Random offsets to spread them out
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        sparkle.style.left = (e.clientX + offsetX) + 'px';
        sparkle.style.top = (e.clientY + offsetY) + 'px';

        // Random size variation
        const size = Math.random() * 6 + 2;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';

        // Random colors from brand palette or white
        const colors = ['#02A576', '#01845d', '#ffffff', '#ffd700'];
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Add random motion variables
        const moveX = (Math.random() - 0.5) * 50;
        const moveY = (Math.random() - 0.5) * 50;
        sparkle.style.setProperty('--move-x', moveX + 'px');
        sparkle.style.setProperty('--move-y', moveY + 'px');

        document.body.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// Mobile Flip Support
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
            this.classList.toggle('flipped');
        }
    });
});
