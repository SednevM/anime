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
            
            // Разбираем строку info на тип и количество эпизодов, используя точный символ разделителя
            const [type, episodesText] = info.split('•').map(text => text.trim());
            const episodes = parseInt(episodesText?.match(/\d+/)?.[0]) || 1;
            
            const description = card.querySelector('.catalog-description').textContent;
            const rating = card.querySelector('.rating-value').textContent;
            const tags = Array.from(card.querySelectorAll('.tag'))
                .map(tag => tag.textContent)
                .join(',');
            const status = card.querySelector('.tooltip-header span').textContent;
            const videoSrc = card.querySelector('video source').getAttribute('src');
            const posterImg = card.querySelector('img');
            const poster = posterImg ? new URL(posterImg.src, window.location.href).href : '';

            // Создаем URL с правильными параметрами
            const params = new URLSearchParams({
                title: title,
                studio: studio,
                type: type,  // Передаем тип отдельно
                episodes: episodes,  // Передаем количество эпизодов отдельно
                description: description,
                rating: rating,
                genres: tags,
                status: status,
                videoSrc: videoSrc,
                poster: poster
            });

            // Переходим на страницу плеера
            window.location.href = `player.html?${params.toString()}`;
        });
    });
});

// Функция для позиционирования тултипа
function positionTooltip(card) {
    const tooltip = card.querySelector('.tooltip');
    if (!tooltip) return;

    // Получаем размеры и позиции
    const cardRect = card.getBoundingClientRect();
    const tooltipWidth = 350; // Фиксированная ширина тултипа
    const windowWidth = document.documentElement.clientWidth;
    const scrollX = window.scrollX;

    // Вычисляем абсолютную позицию карточки относительно документа
    const cardLeft = cardRect.left + scrollX;
    const cardRight = cardRect.right + scrollX;

    // Сбрасываем предыдущие стили
    tooltip.style.left = '';
    tooltip.style.right = '';
    tooltip.style.transform = 'translateY(-50%)';
    tooltip.style.top = '50%';
    tooltip.style.marginTop = '';

    // Проверяем, поместится ли тултип справа от карточки
    if (cardRight + tooltipWidth + 20 <= windowWidth) {
        // Если справа достаточно места
        tooltip.style.left = '105%';
        tooltip.style.right = 'auto';
    }
    // Проверяем, поместится ли тултип слева от карточки
    else if (cardLeft - tooltipWidth - 20 >= 0) {
        // Если слева достаточно места
        tooltip.style.left = 'auto';
        tooltip.style.right = '105%';
    }
    // Если нет места ни справа, ни слева
    else {
        // Показываем снизу
        tooltip.style.left = '50%';
        tooltip.style.right = 'auto';
        tooltip.style.top = '100%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.marginTop = '10px';
    }
}

// Добавляем обработчики для карточек
document.addEventListener('DOMContentLoaded', () => {
    const animeCards = document.querySelectorAll('.anime-card');
    
    animeCards.forEach(card => {
        // При наведении
        card.addEventListener('mouseenter', () => {
            requestAnimationFrame(() => positionTooltip(card));
        });
        
        // При движении мыши внутри карточки (для плавного обновления)
        card.addEventListener('mousemove', () => {
            requestAnimationFrame(() => positionTooltip(card));
        });
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            if (card.matches(':hover')) {
                requestAnimationFrame(() => positionTooltip(card));
            }
        });

        // Обработка прокрутки страницы
        window.addEventListener('scroll', () => {
            if (card.matches(':hover')) {
                requestAnimationFrame(() => positionTooltip(card));
            }
        });
    });
});