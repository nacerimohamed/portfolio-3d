// ========== LOADING SCREEN ==========
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const progressBar = document.getElementById('progress-bar');
const loadingPercentage = document.getElementById('loading-percentage');
const loadingMessage = document.getElementById('loading-message');

// Messages de chargement
const loadingMessages = [
    'Initialisation...',
    'Chargement des modules...',
    'Compilation des composants...',
    'Optimisation des performances...',
    'Préparation de l\'interface...',
    'Presque prêt...'
];

let progress = 0;
let messageIndex = 0;

// Simulation du chargement
const loadingInterval = setInterval(() => {
    // Augmenter la progression
    progress += Math.random() * 5 + 1;
    
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        // Dernier message
        loadingMessage.textContent = 'Prêt !';
        loadingPercentage.textContent = '100%';
        progressBar.style.width = '100%';
        
        // Afficher le contenu principal après un petit délai
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block';
                initThreeJS(); // Démarrer Three.js
                
                // Petite animation pour l'entrée
                mainContent.style.animation = 'fadeIn 0.8s ease-out';
            }, 800);
        }, 500);
    }
    
    // Mettre à jour la barre et le pourcentage
    progressBar.style.width = progress + '%';
    loadingPercentage.textContent = Math.floor(progress) + '%';
    
    // Changer le message toutes les 20%
    if (progress >= (messageIndex + 1) * 20 && messageIndex < loadingMessages.length - 1) {
        messageIndex++;
        loadingMessage.textContent = loadingMessages[messageIndex];
    }
}, 200);

// Animation d'entrée pour le contenu principal
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ========== THREE.JS INIT ==========
function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particules
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 50;
        posArray[i+1] = (Math.random() - 0.5) * 50;
        posArray[i+2] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ffff,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0x440044,
        wireframe: true
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(2, 0, 0);
    scene.add(cube);

    // Lumière
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 8;

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.02;
        cube.position.x = Math.sin(Date.now() * 0.001) * 3;
        
        renderer.render(scene, camera);
    }

    animate();

    // Redimensionnement
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========== PROJETS DATA ==========
const projects = [
    {
        title: "Dashboard Assurances",
        description: "Dashboard interactif pour assurances auto avec statistiques temps réel",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        icon: "fa-solid fa-chart-line",
        github: "https://github.com/nacerimohamed/efm-naceri",
        live: "https://nacerimohamed.github.io/efm-naceri/",
        category: ["html"]
    },
    {
        title: "Gestion des Vols",
        description: "Application complète de gestion de vols et réservations",
        technologies: ["React", "Node.js", "MongoDB"],
        icon: "fa-solid fa-plane",
        github: "https://github.com/nacerimohamed/project",
        live: "https://gestion-des-vols.vercel.app/",
        category: ["react", "nodejs"]
    },
    {
        title: "Cooperative Market",
        description: "Application full stack pour la gestion d'une coopérative",
        technologies: ["Laravel", "React", "MySQL"],
        icon: "fa-solid fa-store",
        github: "https://github.com/nacerimohamed/project",
        live: null,
        category: ["laravel", "react"]
    }
];

// ========== AFFICHER PROJETS ==========
function displayProjects(filter = 'all') {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(p => p.category.includes(filter));
    
    filteredProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        const liveLink = project.live 
            ? `<a href="${project.live}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live</a>` 
            : '';
        
        card.innerHTML = `
            <i class="${project.icon}"></i>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.github}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>
                ${liveLink}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ========== FILTRES ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        displayProjects(btn.dataset.filter);
    });
});

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        icon.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// ========== TYPING ANIMATION ==========
const typedText = document.querySelector('.typed-text');
if (typedText) {
    const words = ['Full Stack', 'React JS', 'Laravel', 'Node.js'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 100 : 200);
        }
    }

    typeEffect();
}

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll('.stat-number');
if (counters.length > 0) {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.dataset.target);
            const count = parseInt(counter.innerText);
            const increment = Math.ceil(target / 50);
            
            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== FORMULAIRE ==========
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message envoyé avec succès !');
        contactForm.reset();
    });
}

// Download CV
function downloadCV() {
    // Générer CV dynamique
    const cvContent = `
        MOHAMED NACERI
        Développeur Full Stack
        
        EXPÉRIENCE
        • Projets personnels (2024-2026)
        - Développement d'applications web avec React, Laravel, Node.js
        - Création de dashboards et API REST
        - Gestion de bases de données MySQL et MongoDB
        
        COMPÉTENCES
        • Frontend: React, JavaScript, HTML5, CSS3
        • Backend: Laravel, Node.js, PHP
        • Base de données: MySQL, MongoDB
        • Outils: Git, GitHub, VS Code
        
        PROJETS
        • EFM Assurances: Dashboard assurances auto
        • Gestion des Vols: Application de réservation
        • Cooperative Market: App full stack Laravel+React
        
        CONTACT
        GitHub: /nacerimohamed
    `;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mohamed_Naceri_CV.txt';
    a.click();
}

// ========== ACTIVE NAVIGATION ==========
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
    displayProjects();
    // Note: Three.js est initialisé après le loading screen
});