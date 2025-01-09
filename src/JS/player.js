// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);

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
        studioName: document.querySelector('.studio-name'),
        animeDescription: document.querySelector('.anime-description'),
        rating: document.querySelector('.rating'),
        genres: document.querySelector('.genres'),
        status: document.querySelector('.status'),
        info: document.querySelector('.info'),
        infoContent: document.querySelector('.info-content'),
        videoSource: document.querySelector('#anime-player source')
    };

    // Проверяем наличие элементов перед установкой значений
    const animeData = {
        title: urlParams.get('title') || 'Название аниме',
        studio: urlParams.get('studio') || 'Studio Name',
        description: urlParams.get('description') || 'Описание отсутствует',
        rating: urlParams.get('rating') || '0/10',
        genres: urlParams.get('genres')?.replace(',', ', ') || 'Жанры не указаны',
        status: urlParams.get('status') || 'Статус неизвестен',
        info: urlParams.get('info') || 'Информация отсутствует'
    };

    // Безопасная установка значений
    if (elements.animeTitle) elements.animeTitle.textContent = animeData.title;
    if (elements.studioName) elements.studioName.textContent = animeData.studio;
    if (elements.animeDescription) elements.animeDescription.textContent = animeData.description;
    if (elements.rating) elements.rating.textContent = animeData.rating;
    if (elements.genres) elements.genres.textContent = animeData.genres;
    if (elements.status) elements.status.textContent = animeData.status;
    if (elements.info) elements.info.textContent = animeData.info;

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

    // Обновляем содержимое info-content
    if (elements.infoContent) {
        elements.infoContent.innerHTML = `
            <p><strong>Студия:</strong> <span>${animeData.studio}</span></p>
            <p><strong>Тип:</strong> <span>${animeData.info}</span></p>
            <p><strong>Рейтинг:</strong> <span>${animeData.rating}</span></p>
            <p><strong>Жанры:</strong> <span>${animeData.genres}</span></p>
            <p><strong>Статус:</strong> <span>${animeData.status}</span></p>
        `;
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

    // Обработчики событий для видеоплеера
    elements.video.addEventListener('loadedmetadata', () => {
        elements.duration.textContent = formatTime(elements.video.duration);
        elements.progressBar.max = Math.floor(elements.video.duration);
    });

    elements.video.addEventListener('timeupdate', () => {
        elements.currentTime.textContent = formatTime(elements.video.currentTime);
        elements.progressBar.value = Math.floor(elements.video.currentTime);
    });

    // Воспроизведение/пауза
    elements.playButton.addEventListener('click', () => {
        if (elements.video.paused) {
            elements.video.play();
            elements.playButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            elements.video.pause();
            elements.playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Управление звуком
    elements.volumeButton.addEventListener('click', () => {
        elements.video.muted = !elements.video.muted;
        elements.volumeButton.innerHTML = elements.video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
        elements.volumeSlider.value = elements.video.muted ? 0 : elements.video.volume * 100;
    });

    elements.volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        elements.video.volume = value / 100;
        elements.video.muted = value === 0;
        elements.volumeButton.innerHTML = value === 0 ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });

    // Прогресс-бар
    elements.progressBar.addEventListener('input', (e) => {
        const time = e.target.value;
        elements.video.currentTime = time;
    });

    // Полноэкранный режим
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

    // Показ/скрытие элементов управления
    let controlsTimeout;
    let isMouseMoving = false;
    let mouseStopTimeout;

    function showControls() {
        elements.controls.style.opacity = '1';
        clearTimeout(controlsTimeout);
    }

    function hideControls() {
        if (!elements.video.paused) {
            elements.controls.style.opacity = '0';
        }
    }

    function handleMouseMove() {
        showControls();
        isMouseMoving = true;
        
        clearTimeout(mouseStopTimeout);
        mouseStopTimeout = setTimeout(() => {
            isMouseMoving = false;
            if (!elements.video.paused) {
                controlsTimeout = setTimeout(hideControls, 3000);
            }
        }, 100);
    }

    elements.playerContainer.addEventListener('mousemove', handleMouseMove);
    elements.playerContainer.addEventListener('mouseenter', showControls);
    elements.controls.addEventListener('mouseenter', () => {
        clearTimeout(controlsTimeout);
        showControls();
    });

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
}); 