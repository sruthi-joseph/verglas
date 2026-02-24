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
        navbar.style.padding = '0.5rem 0';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.classList.add('scrolled');
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.classList.remove('scrolled');
    }
});

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
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

