// Функция для применения темы
function applyTheme(isDark) {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.previousElementSibling : null;
    const themeOptions = document.querySelectorAll('.theme-option');

    if (isDark) {
        body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.textContent = 'Светлая тема';
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
    } else {
        body.classList.remove('dark-theme');
        if (themeToggle) {
            themeToggle.textContent = 'Тёмная тема';
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }

    themeOptions.forEach(option => {
        option.classList.remove('active');
        if ((isDark && option.classList.contains('dark')) || 
            (!isDark && option.classList.contains('light'))) {
            option.classList.add('active');
        }
    });
}

// Функция для переключения темы
function toggleTheme(isDark) {
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Применяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    // Обработчик для кнопки переключения темы в выпадающем меню
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isDark = !document.body.classList.contains('dark-theme');
            toggleTheme(isDark);
        });
    }

    // Обработчик для кнопок темы в настройках
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const isDark = this.classList.contains('dark');
            toggleTheme(isDark);
        });
    });

    // Настройка профиля
    const profileButton = document.getElementById('profile_button');
    const accountDropdown = document.getElementById('account_dropdown');

    if (profileButton && accountDropdown) {
        profileButton.addEventListener('click', () => {
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (event) => {
            if (!profileButton.contains(event.target) && !accountDropdown.contains(event.target)) {
                accountDropdown.style.display = 'none';
            }
        });
    }

    // Переключение секций
    const sectionButtons = document.querySelectorAll('.section-button');
    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            sectionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Загружаем и отображаем данные пользователя
    const savedUsername = localStorage.getItem('username') || 'Kai';
    const savedBio = localStorage.getItem('userBio') || 'Любитель аниме и манги';
    
    const nicknameElement = document.querySelector('.nickname');
    const bioElement = document.querySelector('.user-bio');
    
    if (nicknameElement) {
        nicknameElement.textContent = savedUsername;
    }
    if (bioElement) {
        bioElement.textContent = savedBio;
    }
    
    // Слушаем изменения в localStorage для синхронизации данных
    window.addEventListener('storage', (e) => {
        if (e.key === 'username') {
            const nicknameElement = document.querySelector('.nickname');
            if (nicknameElement) {
                nicknameElement.textContent = e.newValue || 'Kai';
            }
        }
        if (e.key === 'userBio') {
            const bioElement = document.querySelector('.user-bio');
            if (bioElement) {
                bioElement.textContent = e.newValue || 'Любитель аниме и манги';
            }
        }
    });
});

// Слушаем изменения в localStorage для синхронизации темы между вкладками
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        applyTheme(e.newValue === 'dark');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const animeCards = document.querySelectorAll('.anime-card');

    animeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Собираем информацию об аниме
            const title = card.querySelector('.anime-card-title').textContent;
            const studio = card.querySelector('.studio').textContent;
            const info = card.querySelector('.info').textContent;
            const description = card.querySelector('.catalog-description').textContent;
            const rating = card.querySelector('.rating-value').textContent;
            const tags = Array.from(card.querySelectorAll('.tag'))
                .map(tag => tag.textContent)
                .join(',');
            const status = card.querySelector('.tooltip-header span').textContent;
            const videoSrc = card.querySelector('video source').getAttribute('src');
            // Получаем полный путь к изображению
            const posterImg = card.querySelector('img');
            const posterSrc = posterImg ? new URL(posterImg.src, window.location.href).href : '';

            // Создаем URL с параметрами
            const params = new URLSearchParams({
                title: title,
                studio: studio,
                info: info,
                description: description,
                rating: rating,
                tags: tags,
                status: status,
                videoSrc: videoSrc,
                posterSrc: posterSrc
            });

            // Переходим на страницу плеера
            window.location.href = `player.html?${params.toString()}`;
        });
    });
});