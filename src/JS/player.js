// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);

// Выводим все параметры URL для отладки
console.log('Все параметры URL:', {
    title: urlParams.get('title'),
    studio: urlParams.get('studio'),
    info: urlParams.get('info'),
    description: urlParams.get('description'),
    rating: urlParams.get('rating'),
    genres: urlParams.get('genres'),
    videoSrc: urlParams.get('videoSrc'),
    posterSrc: urlParams.get('posterSrc'),
    episodes: urlParams.get('episodes'),
    background: urlParams.get('background')
});

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация элементов управления
    const elements = {
        video: document.querySelector('#anime-player'),
        playButton: document.querySelector('.play-button'),
        volumeButton: document.querySelector('.volume-btn'),
        volumeSlider: document.querySelector('.volume-slider'),
        progressBar: document.querySelector('.progress'),
        currentTime: document.querySelector('.current-time'),
        duration: document.querySelector('.total-time'),
        fullscreenButton: document.querySelector('.fullscreen-btn'),
        controls: document.querySelector('.player-controls'),
        playerContainer: document.querySelector('.player-wrapper'),
        episodeButtons: document.querySelectorAll('.episode'),
        profileButton: document.querySelector('.profile-button'),
        accountDropdown: document.querySelector('.account_dropdown'),
        posterImage: document.querySelector('.anime-poster img'),
        animeTitle: document.querySelector('.anime-title'),
        studioName: document.querySelector('.studio'),
        animeDescription: document.querySelector('.description'),
        rating: document.querySelector('.rating-value'),
        tags: document.querySelector('.tags'),
        status: document.querySelector('.status'),
        info: document.querySelector('.info'),
        infoContent: document.querySelector('.info-content'),
        videoSource: document.querySelector('#anime-player source'),
        backgroundImage: document.querySelector('.background-image')
    };

    // Проверяем наличие элементов перед установкой значений
    const animeData = {
        title: urlParams.get('title'),
        studio: urlParams.get('studio'),
        info: urlParams.get('info'),
        description: urlParams.get('description'),
        rating: urlParams.get('rating'),
        genres: urlParams.get('genres')?.split(',').filter(Boolean) || [],
        videoSrc: urlParams.get('videoSrc'),
        posterSrc: urlParams.get('posterSrc'),
        episodes: urlParams.get('episodes'),
        background: urlParams.get('background')
    };

    console.log('Полученные данные:', {
        animeData,
        elements: {
            tags: !!elements.tags,
            animeTitle: !!elements.animeTitle,
            studioName: !!elements.studioName,
            animeDescription: !!elements.animeDescription,
            rating: !!elements.rating
        }
    });

    // Добавляем только жанры
    if (elements.tags) {
        const genresContainer = document.createElement('div');
        genresContainer.className = 'genres-container';
        
        if (animeData.genres && animeData.genres.length > 0) {
            genresContainer.innerHTML = animeData.genres
                .filter(genre => genre && genre.trim())
                .map(genre => `<span class="tag">${genre.trim()}</span>`)
                .join('');
            console.log('Создан контейнер жанров:', genresContainer.outerHTML);
        }

        elements.tags.innerHTML = '';
        elements.tags.appendChild(genresContainer);
        console.log('Итоговый HTML тегов:', elements.tags.outerHTML);
    } else {
        console.log('Элемент tags не найден в DOM');
    }

    console.log('URL параметры:', Object.fromEntries(urlParams.entries()));
    console.log('Жанры из URL:', urlParams.get('genres'));

    console.log('Данные аниме:', animeData);
    console.log('Добавляем жанры:', animeData.genres);

    // Безопасная установка значений
    if (elements.animeTitle) elements.animeTitle.textContent = animeData.title;
    if (elements.studioName) elements.studioName.textContent = animeData.studio;
    if (elements.animeDescription) elements.animeDescription.textContent = animeData.description;
    if (elements.rating) elements.rating.textContent = animeData.rating;
    
    // Обновляем информацию об эпизодах
    const episodeInfo = document.querySelector('.episode-info');
    if (episodeInfo && animeData.info) {
        episodeInfo.innerHTML = `<span class="current-episode">${animeData.info}</span>`;
    }
    
    // Установка тегов
    if (elements.tags && animeData.genres && animeData.genres.length > 0) {
        console.log('Добавляем жанры:', animeData.genres);
        elements.tags.innerHTML = animeData.genres
            .filter(genre => genre && genre.trim())
            .map(genre => `<span class="tag">${genre.trim()}</span>`)
            .join('');
    } else {
        console.log('Не удалось добавить жанры:', {
            hasTagsElement: !!elements.tags,
            genres: animeData.genres,
            genresLength: animeData.genres?.length
        });
    }

    if (elements.status) elements.status.textContent = animeData.status;
    if (elements.info) elements.info.textContent = animeData.info;

    // Установка фонового изображения
    const backgroundImage = document.querySelector('.background-image');
    const backgroundUrl = urlParams.get('background');
    
    console.log('Данные фона:', {
        backgroundElement: !!backgroundImage,
        backgroundUrl: backgroundUrl,
        allParams: Object.fromEntries(urlParams.entries())
    });
    
    if (backgroundImage && backgroundUrl) {
        console.log('Устанавливаем фоновое изображение:', backgroundUrl);
        // Используем путь как есть, так как он уже содержит src/img/
        backgroundImage.style.backgroundImage = `url('${backgroundUrl}')`;
    } else {
        console.log('Не удалось установить фоновое изображение:', {
            hasBackgroundElement: !!backgroundImage,
            backgroundUrl: backgroundUrl
        });
    }

    // Обновляем содержимое info-content
    if (elements.infoContent && animeData.genres) {
        elements.infoContent.innerHTML = `
            <p><strong>Студия:</strong> <span>${animeData.studio}</span></p>
            <p><strong>Тип:</strong> <span>${animeData.info}</span></p>
            <p><strong>Рейтинг:</strong> <span>${animeData.rating}</span></p>
            <p><strong>Жанры:</strong> <span>${animeData.genres.join(', ')}</span></p>
            <p><strong>Статус:</strong> <span>${animeData.status || 'Онгоинг'}</span></p>
        `;
    }

    // Обработчики событий для видеоплеера
    if (elements.video) {
        elements.video.addEventListener('loadedmetadata', () => {
            if (elements.duration) elements.duration.textContent = formatTime(elements.video.duration);
            if (elements.progressBar) elements.progressBar.max = Math.floor(elements.video.duration);
        });

        elements.video.addEventListener('timeupdate', () => {
            if (elements.currentTime) elements.currentTime.textContent = formatTime(elements.video.currentTime);
            if (elements.progressBar) elements.progressBar.value = Math.floor(elements.video.currentTime);
        });
    }

    // Загрузка постера
    const posterUrl = urlParams.get('poster');
    console.log('Загружаем постер:', posterUrl);
    
    if (posterUrl && elements.posterImage) {
        // Проверяем, является ли URL абсолютным
        const absoluteUrl = posterUrl.startsWith('http') ? posterUrl : new URL(posterUrl, window.location.href).href;
        console.log('Абсолютный URL постера:', absoluteUrl);
        
        elements.posterImage.src = absoluteUrl;
        elements.posterImage.onerror = function() {
            console.error('Ошибка загрузки изображения:', absoluteUrl);
            this.src = '/src/img/avatar.jpg';
            this.onerror = null;
        };
    } else {
        console.log('Используем изображение по умолчанию');
        if (elements.posterImage) {
            elements.posterImage.src = '/src/img/avatar.jpg';
        }
    }

    // Установка источника видео
    const videoSrc = urlParams.get('video');
    if (videoSrc) {
        fetch(videoSrc)
            .then(response => {
                if (response.ok) {
                    if (elements.videoSource) {
                        elements.videoSource.src = videoSrc;
                    } else {
                        const source = document.createElement('source');
                        source.src = videoSrc;
                        source.type = 'video/mp4';
                        elements.video.appendChild(source);
                    }
                    elements.video.load();
                } else {
                    console.error('Видео не найдено:', videoSrc);
                }
            })
            .catch(error => {
                console.error('Ошибка при проверке видео:', error);
            });
    }

    // Функционал меню профиля и темы
    const profileButton = document.getElementById('profile_button');
    const accountDropdown = document.getElementById('account_dropdown');
    const themeToggle = document.getElementById('theme-toggle');

    // Функция для применения темы
    function applyTheme(isDark) {
        const body = document.body;
        const themeIcon = themeToggle.previousElementSibling;

        body.classList.toggle('dark-theme', isDark);
        
        if (isDark) {
            themeToggle.textContent = 'Светлая тема';
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeToggle.textContent = 'Тёмная тема';
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Применяем сохраненную тему при загрузке
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    // Обработчик клика по кнопке профиля
    if (profileButton && accountDropdown) {
        profileButton.addEventListener('click', () => {
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Закрываем дропдаун при клике вне его
        document.addEventListener('click', (event) => {
            if (!profileButton.contains(event.target) && !accountDropdown.contains(event.target)) {
                accountDropdown.style.display = 'none';
            }
        });
    }

    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isDark = !document.body.classList.contains('dark-theme');
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Синхронизация темы между вкладками
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            applyTheme(e.newValue === 'dark');
        }
    });

    // Функции для работы с временем
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Воспроизведение/пауза
    if (elements.playButton) {
        elements.playButton.addEventListener('click', () => {
            if (elements.video.paused) {
                elements.video.play();
                elements.playButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                elements.video.pause();
                elements.playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    // Управление звуком
    if (elements.volumeButton && elements.volumeSlider) {
        elements.volumeButton.addEventListener('click', () => {
            if (elements.video) {
                elements.video.muted = !elements.video.muted;
                elements.volumeButton.innerHTML = elements.video.muted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
                elements.volumeSlider.value = elements.video.muted ? 0 : elements.video.volume * 100;
            }
        });

        elements.volumeSlider.addEventListener('input', (e) => {
            if (elements.video) {
                const value = e.target.value;
                elements.video.volume = value / 100;
                elements.video.muted = value === 0;
                elements.volumeButton.innerHTML = value === 0 ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
            }
        });
    }

    // Прогресс-бар
    if (elements.progressBar && elements.video) {
        elements.progressBar.addEventListener('input', (e) => {
            const time = e.target.value;
            elements.video.currentTime = time;
        });
    }

    // Полноэкранный режим
    if (elements.fullscreenButton && elements.playerContainer) {
        elements.fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                if (elements.playerContainer.requestFullscreen) {
                    elements.playerContainer.requestFullscreen();
                } else if (elements.playerContainer.webkitRequestFullscreen) {
                    elements.playerContainer.webkitRequestFullscreen();
                } else if (elements.playerContainer.msRequestFullscreen) {
                    elements.playerContainer.msRequestFullscreen();
                }
                elements.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                elements.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            }
        });
    }

    // Показ/скрытие элементов управления
    let controlsTimeout;
    let isMouseMoving = false;
    let mouseStopTimeout;

    function showControls() {
        if (elements.controls) {
            elements.controls.style.opacity = '1';
            clearTimeout(controlsTimeout);
        }
    }

    function hideControls() {
        if (elements.controls && elements.video && !elements.video.paused) {
            elements.controls.style.opacity = '0';
        }
    }

    function handleMouseMove() {
        showControls();
        isMouseMoving = true;
        
        clearTimeout(mouseStopTimeout);
        mouseStopTimeout = setTimeout(() => {
            isMouseMoving = false;
            if (elements.video && !elements.video.paused) {
                controlsTimeout = setTimeout(hideControls, 3000);
            }
        }, 100);
    }

    // Добавляем обработчики только если существуют необходимые элементы
    if (elements.playerContainer && elements.controls) {
        elements.playerContainer.addEventListener('mousemove', handleMouseMove);
        elements.playerContainer.addEventListener('mouseenter', showControls);
        elements.controls.addEventListener('mouseenter', () => {
            clearTimeout(controlsTimeout);
            showControls();
        });
    }

    // Обработчик изменения полноэкранного режима
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            showControls();
        }
    });

    // Обработчик паузы/воспроизведения
    elements.video.addEventListener('play', () => {
        if (!isMouseMoving) {
            controlsTimeout = setTimeout(hideControls, 3000);
        }
    });

    elements.video.addEventListener('pause', showControls);

    // Получаем параметры из URL
    const title = urlParams.get('title');
    const totalEpisodes = parseInt(urlParams.get('episodes')) || 1;

    // Создаем массив данных для эпизодов
    const episodesData = Array.from({ length: totalEpisodes }, (_, i) => {
        const episodeNumber = i + 1;
        return {
            number: episodeNumber,
            title: `Эпизод ${episodeNumber}`,
            videoSrc: `src/video/${encodeURIComponent(title)}/episode${episodeNumber}.mp4`
        };
    });

    // Функция для инициализации кнопок эпизодов
    function initializeEpisodeButtons() {
        const episodeButtons = document.querySelectorAll('.episode-button');
        
        episodeButtons.forEach((button, index) => {
            if (index < totalEpisodes) {
                const episode = episodesData[index];
                button.textContent = episode.title;
                button.style.display = 'block';
                
                button.addEventListener('click', () => {
                    // Убираем активный класс у всех кнопок
                    episodeButtons.forEach(btn => btn.classList.remove('active'));
                    // Добавляем активный класс текущей кнопке
                    button.classList.add('active');
                    
                    // Обновляем источник видео
                    const video = document.querySelector('video');
                    video.src = episode.videoSrc;
                    video.load();
                    video.play();
                });
            } else {
                button.style.display = 'none';
            }
        });
        
        // Активируем первый эпизод по умолчанию
        if (episodeButtons.length > 0) {
            episodeButtons[0].classList.add('active');
            const video = document.querySelector('video');
            video.src = episodesData[0].videoSrc;
            video.load();
        }
    }

    // Вызываем функцию инициализации после загрузки DOM
    document.addEventListener('DOMContentLoaded', initializeEpisodeButtons);

    // Горячие клавиши
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                elements.playButton.click();
                break;
            case 'f':
                e.preventDefault();
                elements.fullscreenButton.click();
                break;
            case 'm':
                e.preventDefault();
                elements.volumeButton.click();
                break;
            case 'arrowleft':
                e.preventDefault();
                elements.video.currentTime -= 5;
                break;
            case 'arrowright':
                e.preventDefault();
                elements.video.currentTime += 5;
                break;
            case 'arrowup':
                e.preventDefault();
                elements.volumeSlider.value = Math.min(100, parseInt(elements.volumeSlider.value) + 5);
                elements.volumeSlider.dispatchEvent(new Event('input'));
                break;
            case 'arrowdown':
                e.preventDefault();
                elements.volumeSlider.value = Math.max(0, parseInt(elements.volumeSlider.value) - 5);
                elements.volumeSlider.dispatchEvent(new Event('input'));
                break;
        }
    });

    // Функция для получения данных из URL
    function getAnimeDataFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');
        const studio = urlParams.get('studio');
        const info = urlParams.get('info');
        const description = urlParams.get('description');
        const rating = urlParams.get('rating');
        const tags = urlParams.get('tags');
        const videoSrc = urlParams.get('videoSrc');
        const posterSrc = urlParams.get('posterSrc');

        return {
            title: title || 'Название аниме',
            studio: studio || 'Студия не указана',
            info: info || 'Информация отсутствует',
            description: description || 'Описание отсутствует',
            rating: rating || 'Нет оценки',
            tags: tags || 'Жанры не указаны',
            videoSrc,
            posterSrc
        };
    }

    // Функция для отображения информации об аниме
    function displayAnimeInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Получаем все параметры
        const title = urlParams.get('title') || 'Название не указано';
        const studio = urlParams.get('studio') || 'Студия не указана';
        const info = urlParams.get('info') || 'Информация отсутствует';
        const description = urlParams.get('description') || 'Описание отсутствует';
        const rating = urlParams.get('rating') || 'Нет оценки';
        const genres = urlParams.get('genres') || 'Жанры не указаны';
        const status = urlParams.get('status') || 'Статус не указан';
        
        // Заполняем информацию
        if (elements.animeTitle) elements.animeTitle.textContent = title;
        if (elements.studioName) elements.studioName.textContent = studio;
        if (elements.animeDescription) elements.animeDescription.textContent = description;
        if (elements.rating) elements.rating.textContent = rating;
        if (elements.genres) elements.genres.textContent = genres.split(',').join(', ');
        if (elements.status) elements.status.textContent = status;
        if (elements.info) elements.info.textContent = info;

        // Обновляем содержимое info-content
        const infoContent = document.querySelector('.info-content');
        if (infoContent) {
            infoContent.innerHTML = `
                <p><strong>Студия:</strong> <span>${studio}</span></p>
                <p><strong>Тип:</strong> <span>${info}</span></p>
                <p><strong>Рейтинг:</strong> <span>${rating}</span></p>
                <p><strong>Жанры:</strong> <span>${genres.split(',').join(', ')}</span></p>
                <p><strong>Статус:</strong> <span>${status}</span></p>
            `;
        }
    }

    // Вызываем функцию при загрузке страницы
    document.addEventListener('DOMContentLoaded', displayAnimeInfo);

    // Обновляем кнопки управления
    const controlButtons = document.querySelector('.control-buttons');
    if (controlButtons) {
        controlButtons.innerHTML = `
            <button class="control-btn watching">
                <i class="fas fa-play"></i>
                Смотреть
            </button>
            <button class="control-btn review">
                <i class="fas fa-star"></i>
                Отзыв
            </button>
            <button class="control-btn share">
                <i class="fas fa-share"></i>
                Поделиться
            </button>
        `;

        // Добавляем обработчик для кнопки "Смотреть"
        const watchButton = controlButtons.querySelector('.watching');
        if (watchButton) {
            watchButton.addEventListener('click', () => {
                const playerContainer = document.querySelector('.player-container');
                if (playerContainer) {
                    playerContainer.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        }
    }

    // Обновляем заголовок раздела авторов
    const authorsTitle = document.querySelector('.authors-section h2');
    if (authorsTitle) {
        authorsTitle.textContent = 'Авторы';
    }
}); 