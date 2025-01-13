class SeasonalThemeManager {
    constructor() {
        this.initializeTheme();
        this.setupTransitionStyles();
        this.setupSeasonalEffects();
        this.setupEventListeners();
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        
        if (month >= 11 || month <= 1) return 'winter';
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
    }

    setupTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                transition: background-color var(--transition-time) ease,
                            color var(--transition-time) ease,
                            border-color var(--transition-time) ease,
                            box-shadow var(--transition-time) ease,
                            transform var(--transition-time) ease;
            }
        `;
        document.head.appendChild(style);
    }

    setupSeasonalEffects() {
        const season = this.getCurrentSeason();
        const container = document.createElement('div');
        container.className = 'seasonal-effects';
        document.body.appendChild(container);

        switch(season) {
            case 'winter':
                this.createSnowEffect(container);
                break;
            case 'spring':
                this.createPetalEffect(container);
                break;
            case 'summer':
                this.createSummerEffects(container);
                break;
            case 'fall':
                this.createLeafEffect(container);
                break;
        }
    }

    createSnowEffect(container) {
        // Создаем контейнер для ёлки
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-container';
        
        // Добавляем ёлку в контейнер
        const tree = document.createElement('div');
        tree.className = 'christmas-tree';
        treeContainer.appendChild(tree);
        
        // Добавляем контейнер в body
        document.body.appendChild(treeContainer);

        // Добавляем гирлянду
        const garland = document.createElement('div');
        garland.className = 'garland';
        for(let i = 0; i < 20; i++) {
            const light = document.createElement('div');
            light.className = 'garland-light';
            light.style.animationDelay = `${Math.random() * 2}s`;
            garland.appendChild(light);
        }
        container.appendChild(garland);

        // Добавляем снежинки и праздничные символы
        for(let i = 0; i < 50; i++) {
            const snow = document.createElement('div');
            snow.className = 'snowflake';
            snow.style.left = `${Math.random() * 100}vw`;
            snow.style.animationDuration = `${Math.random() * 3 + 2}s`;
            snow.style.opacity = Math.random() * 0.7 + 0.3;
            snow.style.fontSize = `${Math.random() * 15 + 10}px`;
            container.appendChild(snow);
        }
    }

    createPetalEffect(container) {
        for(let i = 0; i < 30; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.animationDuration = `${Math.random() * 4 + 3}s`;
            petal.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(petal);
        }
    }

    createSummerEffects(container) {
        // Создаем солнечный свет
        const sunlight = document.createElement('div');
        sunlight.className = 'sunlight';
        container.appendChild(sunlight);

        // Добавляем бабочек
        for(let i = 0; i < 5; i++) {
            const butterfly = document.createElement('div');
            butterfly.className = 'butterfly';
            butterfly.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(butterfly);
        }
    }

    createLeafEffect(container) {
        for(let i = 0; i < 40; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}vw`;
            leaf.style.animationDuration = `${Math.random() * 5 + 5}s`;
            leaf.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(leaf);
        }
    }

    initializeTheme() {
        const currentSeason = this.getCurrentSeason();
        
        document.body.classList.remove('winter-theme', 'spring-theme', 'summer-theme', 'fall-theme');
        
        document.body.setAttribute('data-season-theme', currentSeason);
        document.body.classList.add(`${currentSeason}-theme`);

        // Добавляем плавное появление темы
        requestAnimationFrame(() => {
            document.body.style.opacity = '0';
            requestAnimationFrame(() => {
                document.body.style.opacity = '1';
                document.body.style.transition = 'opacity 0.5s ease';
            });
        });
    }

    setupEventListeners() {
        // Добавляем интерактивность при движении мыши
        document.addEventListener('mousemove', (e) => {
            const season = this.getCurrentSeason();
            const container = document.querySelector('.seasonal-effects');
            if (!container) return;

            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            container.style.setProperty('--mouse-x', mouseX);
            container.style.setProperty('--mouse-y', mouseY);

            // Добавляем эффект параллакса для элементов
            const elements = container.children;
            Array.from(elements).forEach(element => {
                const speed = parseFloat(element.style.animationDuration) || 3;
                const offsetX = (mouseX - 0.5) * 50 / speed;
                const offsetY = (mouseY - 0.5) * 50 / speed;
                element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new SeasonalThemeManager();
}); 