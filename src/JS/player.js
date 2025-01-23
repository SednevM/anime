class AnimePlayer {
    constructor() {
        // Инициализация элементов плеера
        this.player = document.getElementById('anime-player');
        this.prevEpisodeBtn = document.querySelector('.prev-episode');
        this.nextEpisodeBtn = document.querySelector('.next-episode');
        this.episodeListToggle = document.querySelector('.episode-list-toggle');
        this.episodeList = document.querySelector('.episode-list');
        this.episodesGrid = document.querySelector('.episodes-grid');
        
        // Получаем параметры из URL
        this.urlParams = new URLSearchParams(window.location.search);
        this.currentEpisode = parseInt(this.urlParams.get('episode')) || 1;
        this.totalEpisodes = parseInt(this.urlParams.get('episodes')) || 1;
        this.episodeTitles = [];
        
        // Добавляем элемент плеера и его контейнер
        this.playerContainer = document.querySelector('.player-container');
        
        // Скрываем плеер изначально
        if (this.playerContainer) {
            this.playerContainer.style.opacity = '0';
            this.playerContainer.style.transition = 'opacity 0.3s ease-in-out';
        }
        
        // Добавляем обработчик прокрутки
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.handleScroll);
        
        // Инициализация плеера
        this.initializePlayer();
        
        // Рендерим список эпизодов
        this.renderEpisodesList();
        
        // Добавляем обработчики событий
        this.addEventListeners();
    }

    // Безопасное декодирование URL параметра
    safeDecodeURIComponent(param) {
        if (!param) return '';
        try {
            return decodeURIComponent(param);
        } catch (e) {
            console.warn('Ошибка декодирования параметра:', param);
            return param;
        }
    }

    initializePlayer() {
        // Загружаем информацию об аниме
        this.loadAnimeInfo();
        
        // Устанавливаем начальное состояние кнопок
        this.updateEpisodeControls();
        
        // Загружаем первый эпизод
        this.loadEpisode(1);
    }

    loadAnimeInfo() {
        // Получаем информацию об аниме из URL параметров
        const title = this.safeDecodeURIComponent(this.urlParams.get('title'));
        const poster = this.safeDecodeURIComponent(this.urlParams.get('poster'));
        const type = this.safeDecodeURIComponent(this.urlParams.get('type'));
        const status = this.safeDecodeURIComponent(this.urlParams.get('status'));
        const studio = this.safeDecodeURIComponent(this.urlParams.get('studio'));
        const description = this.safeDecodeURIComponent(this.urlParams.get('description'));
        const rating = this.safeDecodeURIComponent(this.urlParams.get('rating'));
        const genres = this.safeDecodeURIComponent(this.urlParams.get('genres'))?.split(',') || [];
        
        // Обновляем заголовок
        const titleElement = document.querySelector('.anime-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        // Обновляем постер
        const posterElement = document.querySelector('.poster-image');
        if (posterElement && poster) {
            posterElement.src = poster;
            posterElement.alt = title;
        }
        
        // Обновляем тип
        const typeElement = document.querySelector('.anime-type');
        if (typeElement) {
            typeElement.textContent = type;
        }
        
        // Обновляем статус
        const statusElement = document.querySelector('.anime-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
        
        // Обновляем студию
        const studioElement = document.querySelector('.anime-studio');
        if (studioElement) {
            studioElement.textContent = studio;
        }
        
        // Обновляем рейтинг
        const ratingElement = document.querySelector('.rating-value');
        if (ratingElement && rating) {
            ratingElement.textContent = rating;
        }
        
        // Обновляем жанры
        const genresContainer = document.querySelector('.anime-genres');
        if (genresContainer && genres.length > 0) {
            genresContainer.innerHTML = genres
                .map(genre => `<span class="genre-tag">${genre}</span>`)
                .join('');
        }
        
        // Обновляем описание
        const descriptionElement = document.querySelector('.anime-description');
        if (descriptionElement) {
            descriptionElement.textContent = description;
        }
        
        // Обновляем фоновое изображение
        if (poster) {
            const backgroundImage = document.querySelector('.background-image');
            if (backgroundImage) {
                backgroundImage.style.backgroundImage = `url(${poster})`;
            }
        }
    }

    addEventListeners() {
        // Обработчики для кнопок эпизодов
        this.prevEpisodeBtn?.addEventListener('click', () => this.navigateEpisode('prev'));
        this.nextEpisodeBtn?.addEventListener('click', () => this.navigateEpisode('next'));
        
        // Обработчик для списка эпизодов
        this.episodeListToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleEpisodeList();
        });
        
        // Закрытие списка эпизодов при клике вне его
        document.addEventListener('click', (e) => {
            if (this.episodeList && !this.episodeList.contains(e.target) && 
                !this.episodeListToggle?.contains(e.target)) {
                this.closeEpisodeList();
            }
        });
        
        // Предотвращаем закрытие при клике внутри списка
        this.episodeList?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Обработчик для модального окна настроек комментариев
        const settingsBtn = document.querySelector('.comments-header .settings-btn');
        const settingsModal = document.querySelector('.comments-settings-modal');
        const closeSettingsBtn = document.querySelector('.comments-settings-close');
        const sliderInput = document.querySelector('.slider-input');
        const sliderValue = document.querySelector('.slider-value');

        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                settingsModal.classList.add('active');
            });

            closeSettingsBtn.addEventListener('click', () => {
                settingsModal.classList.remove('active');
            });

            // Закрытие при клике вне модального окна
            document.addEventListener('click', (e) => {
                if (!settingsModal.contains(e.target) && !settingsBtn.contains(e.target)) {
                    settingsModal.classList.remove('active');
                }
            });

            // Обновление значения слайдера
            sliderInput.addEventListener('input', (e) => {
                sliderValue.textContent = `с ${e.target.value} ур.`;
            });
        }

        // Обработчик для кнопки настроек комментариев
        const settingsToggle = document.querySelector('.settings-toggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Находим меню настроек
                const settingsMenu = document.querySelector('.comments-settings');
                if (settingsMenu) {
                    // Закрываем все другие открытые меню
                    document.querySelectorAll('.dropdown-menu.show, .comments-settings.show').forEach(item => {
                        if (item !== settingsMenu) {
                            item.classList.remove('show');
                        }
                    });
                    
                    // Переключаем видимость меню настроек
                    settingsMenu.classList.toggle('show');
                    
                    // Позиционируем меню под кнопкой
                    const buttonRect = settingsToggle.getBoundingClientRect();
                    settingsMenu.style.position = 'absolute';
                    settingsMenu.style.top = `${buttonRect.bottom + window.scrollY}px`;
                    settingsMenu.style.right = '0';
                    settingsMenu.style.zIndex = '1000';
                }
            });

            // Закрытие меню настроек при клике вне его
            document.addEventListener('click', (e) => {
                const settingsMenu = document.querySelector('.comments-settings');
                if (settingsMenu && !settingsToggle.contains(e.target) && !settingsMenu.contains(e.target)) {
                    settingsMenu.classList.remove('show');
                }
            });

            // Обработчики для кнопок в меню настроек
            const settingsButtons = document.querySelectorAll('.settings-button');
            settingsButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Переключаем активное состояние
                    this.classList.toggle('active');
                    
                    // Сохраняем состояние в localStorage
                    const settingId = this.id;
                    const isActive = this.classList.contains('active');
                    localStorage.setItem(settingId, isActive);
                    
                    // Применяем настройки
                    switch(settingId) {
                        case 'hide-spoilers':
                            document.querySelectorAll('.comment-content').forEach(comment => {
                                comment.classList.toggle('spoiler-hidden', isActive);
                            });
                            break;
                            
                        case 'notify-replies':
                            // Логика для уведомлений
                            console.log('Уведомления о комментариях:', isActive ? 'включены' : 'выключены');
                            break;
                            
                        case 'hide-low-rating':
                            document.querySelectorAll('.comment').forEach(comment => {
                                const rating = parseInt(comment.querySelector('.rating-up')?.textContent || '0');
                                comment.style.display = (isActive && rating < 0) ? 'none' : '';
                            });
                            break;
                    }
                });
                
                // Восстанавливаем сохраненное состояние
                const savedState = localStorage.getItem(button.id);
                if (savedState === 'true') {
                    button.classList.add('active');
                    // Имитируем клик для применения настроек
                    button.click();
                }
            });
        }

        // Обработчик для раскрытия спойлеров по клику
        document.querySelectorAll('.comment-content').forEach(comment => {
            comment.addEventListener('click', function() {
                if (this.classList.contains('spoiler-hidden')) {
                    this.classList.remove('spoiler-hidden');
                }
            });
        });

        // Обновляем структуру комментариев
        const comments = document.querySelectorAll('.comment');
        comments.forEach(comment => {
            const avatar = comment.querySelector('.comment-avatar');
            const content = comment.innerHTML;
            
            // Создаем новую структуру
            comment.innerHTML = `
                <div class="comment-avatar-block">
                    ${avatar ? avatar.outerHTML : '<img src="/path/to/default/avatar.jpg" alt="Avatar" class="comment-avatar">'}
                </div>
                <div class="comment-content-block">
                    ${content.replace(avatar?.outerHTML || '', '')}
                </div>
            `;

            // Добавляем обработчик для кнопки "ответить"
            addReplyHandler(comment);
        });

        // Обработчик для кнопки отзыва
        const reviewButton = document.querySelector('.review-button');
        const reviewModal = document.createElement('div');
        reviewModal.className = 'review-modal';
        reviewModal.innerHTML = `
            <div class="review-modal-header">
                <h3 class="review-modal-title">Оставить отзыв</h3>
                <button class="review-modal-close">×</button>
            </div>
            <form class="review-form">
                <div class="rating-select">
                    <div class="rating-option" data-rating="1">
                        <div class="rating-value">1</div>
                    </div>
                    <div class="rating-option" data-rating="2">
                        <div class="rating-value">2</div>
                    </div>
                    <div class="rating-option" data-rating="3">
                        <div class="rating-value">3</div>
                    </div>
                    <div class="rating-option" data-rating="4">
                        <div class="rating-value">4</div>
                    </div>
                    <div class="rating-option" data-rating="5">
                        <div class="rating-value">5</div>
                    </div>
                </div>
                <textarea class="review-textarea" placeholder="Напишите ваш отзыв..."></textarea>
                <button type="submit" class="review-submit">Отправить</button>
            </form>
        `;

        document.body.appendChild(reviewModal);

        if (reviewButton) {
            reviewButton.addEventListener('click', () => {
                reviewModal.classList.add('active');
            });
        }

        const closeButton = reviewModal?.querySelector('.review-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                reviewModal.classList.remove('active');
            });
        }

        // Обработка выбора рейтинга
        const ratingOptions = reviewModal.querySelectorAll('.rating-option');
        ratingOptions.forEach(option => {
            option.addEventListener('click', () => {
                ratingOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });

        // Обработка отправки формы
        const reviewForm = reviewModal.querySelector('.review-form');
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = reviewModal.querySelector('.rating-option.active')?.dataset.rating;
            const text = reviewModal.querySelector('.review-textarea').value;
            
            if (!rating) {
                alert('Пожалуйста, выберите оценку');
                return;
            }
            
            if (!text.trim()) {
                alert('Пожалуйста, напишите текст отзыва');
                return;
            }
            
            // Здесь будет логика отправки отзыва
            console.log('Отзыв:', { rating, text });
            
            // Очищаем форму и закрываем модальное окно
            reviewModal.querySelector('.review-textarea').value = '';
            ratingOptions.forEach(opt => opt.classList.remove('active'));
            reviewModal.classList.remove('active');
        });

        // Закрытие модального окна при клике вне его
        window.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                reviewModal.classList.remove('active');
            }
        });
    }

    renderEpisodesList() {
        // Очищаем существующий список
        this.episodesGrid.innerHTML = '';

        // Создаем элементы для каждого эпизода
        for (let i = 1; i <= this.totalEpisodes; i++) {
            const episodeItem = document.createElement('div');
            episodeItem.className = 'episode-item';
            if (i === this.currentEpisode) {
                episodeItem.classList.add('active');
            }
            
            episodeItem.innerHTML = `
                <span class="episode-number">Эпизод ${i}</span>
                ${this.episodeTitles[i - 1] ? `<span class="episode-title-small">${this.episodeTitles[i - 1]}</span>` : ''}
            `;
            
            episodeItem.addEventListener('click', () => this.loadEpisode(i));
            this.episodesGrid.appendChild(episodeItem);
        }
    }

    loadEpisode(episodeNumber) {
        this.currentEpisode = episodeNumber;
        
        // Обновляем отображение текущего эпизода и его название
        document.querySelectorAll('.current-episode').forEach(el => {
            el.textContent = `Серия ${episodeNumber}`;
        });
        
        // Обновляем название эпизода
        const episodeTitle = this.episodeTitles[episodeNumber - 1] || '';
        if (this.episodeTitle) {
            this.episodeTitle.textContent = episodeTitle;
        }
        
        // Обновляем активный эпизод в списке
        document.querySelectorAll('.episode-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.textContent) === episodeNumber);
        });
        
        // Обновляем состояние кнопок навигации
        this.updateEpisodeControls();
        
        // Закрываем список эпизодов
        this.episodeList.classList.remove('active');
        
        // Получаем URL видео для конкретного эпизода
        const baseVideoSrc = this.urlParams.get('videoSrc');
        if (baseVideoSrc) {
            const videoSrc = this.safeDecodeURIComponent(baseVideoSrc).replace('{episode}', episodeNumber);
            this.player.src = videoSrc;
            this.player.load();
        }
        
        // Обновляем URL с новым номером эпизода
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('episode', episodeNumber);
        window.history.replaceState({}, '', newUrl);
    }

    navigateEpisode(direction) {
        const newEpisode = direction === 'prev' ? 
            this.currentEpisode - 1 : 
            this.currentEpisode + 1;
            
        if (newEpisode >= 1 && newEpisode <= this.totalEpisodes) {
            this.loadEpisode(newEpisode);
        }
    }

    updateEpisodeControls() {
        // Обновляем состояние кнопок навигации
        this.prevEpisodeBtn.disabled = this.currentEpisode <= 1;
        this.nextEpisodeBtn.disabled = this.currentEpisode >= this.totalEpisodes;
    }

    toggleEpisodeList() {
        if (this.episodeList) {
            this.episodeList.classList.toggle('active');
            console.log('Toggle episode list', this.episodeList.classList.contains('active'));
        }
    }

    closeEpisodeList() {
        this.episodeList?.classList.remove('active');
    }

    handleScroll() {
        if (!this.playerContainer) return;
        
        const scrollPosition = window.scrollY;
        const showPosition = 200; // Показывать после прокрутки на 200px
        
        if (scrollPosition > showPosition) {
            this.playerContainer.style.opacity = '1';
        } else {
            this.playerContainer.style.opacity = '0';
        }
    }
}

// Функция для создания URL плеера из данных карточки
function createPlayerUrl(animeData) {
    const params = new URLSearchParams();
    
    // Базовые параметры
    if (animeData.title) params.set('title', encodeURIComponent(animeData.title));
    if (animeData.poster) params.set('poster', encodeURIComponent(animeData.poster));
    if (animeData.rating) params.set('rating', encodeURIComponent(animeData.rating.toString()));
    if (animeData.genres) params.set('genres', encodeURIComponent(animeData.genres.join(',')));
    if (animeData.year) params.set('year', encodeURIComponent(animeData.year));
    if (animeData.type) params.set('type', encodeURIComponent(animeData.type));
    if (animeData.status) params.set('status', encodeURIComponent(animeData.status));
    if (animeData.studio) params.set('studio', encodeURIComponent(animeData.studio));
    if (animeData.episodes) params.set('episodes', animeData.episodes.toString());
    if (animeData.videoSrc) params.set('videoSrc', encodeURIComponent(animeData.videoSrc));
    if (animeData.description) params.set('description', encodeURIComponent(animeData.description));
    
    return `player.html?${params.toString()}`;
}

// Пример использования для карточки:
function openAnimePlayer(card) {
    // Получаем тип и количество эпизодов из строки "Сериал • 12 эпизодов"
    const infoText = card.querySelector('.info')?.textContent || '';
    const [type, episodesText] = infoText.split('•').map(text => text.trim());
    const episodes = episodesText ? parseInt(episodesText.split(' ')[0]) : 1;

    // Получаем рейтинг из элемента .rating-fill через width
    const ratingFill = card.querySelector('.rating-fill')?.style.width || '0%';
    const rating = ratingFill.replace('%', '');

    const animeData = {
        title: card.querySelector('.anime-card-title')?.textContent || '',
        poster: card.querySelector('img')?.src || '',
        rating: rating,
        genres: Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent),
        type: type || 'Сериал',
        status: 'Онгоинг', // Статичное значение, можно изменить если есть другой источник
        studio: card.querySelector('.studio')?.textContent || '',
        episodes: episodes,
        videoSrc: card.querySelector('video source')?.src || '',
        description: card.querySelector('.catalog-description')?.textContent || ''
    };
    
    window.location.href = createPlayerUrl(animeData);
}

// Инициализация плеера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем сохраненную тему при загрузке страницы
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    }

    // Инициализируем плеер только если мы на странице плеера
    if (document.getElementById('anime-player')) {
        new AnimePlayer();
    }
    
    // Добавляем обработчики для карточек аниме
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('click', () => openAnimePlayer(card));
    });

    // Добавляем обработчики для существующих комментариев
    const comments = document.querySelectorAll('.comment');
    comments.forEach(comment => {
        addRatingHandlers(comment);
        addReplyHandler(comment);
    });

    // Обработчик для новых комментариев
    const submitButton = document.querySelector('.comment-submit');
    const newCommentForm = document.querySelector('.new-comment-form');
    if (submitButton && newCommentForm) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            const commentText = newCommentForm.querySelector('.comment-input')?.value.trim();
            if (commentText) {
                const userName = localStorage.getItem('username') || 'Пользователь';
                const userAvatar = document.querySelector('.profile-button img')?.src || '/path/to/default/avatar.jpg';

                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <div class="comment-avatar-block">
                        <img src="${userAvatar}" alt="Avatar" class="comment-avatar">
                    </div>
                    <div class="comment-content-block">
                        <div class="comment-header">
                            <div class="comment-info">
                                <span class="comment-author">${userName}</span>
                                <span class="comment-date">только что</span>
                            </div>
                            <div class="comment-rating">
                                <button class="rating-button up-vote">↑</button>
                                <span class="rating-up">0</span>
                                <button class="rating-button down-vote">↓</button>
                            </div>
                        </div>
                        <div class="comment-content">${commentText}</div>
                        <div class="comment-actions">
                            <button class="comment-action">ответить</button>
                            <button class="comment-action">жалоба</button>
                        </div>
                    </div>
                `;
                
                newCommentForm.after(newComment);
                newCommentForm.querySelector('.comment-input').value = '';
                
                addReplyHandler(newComment);
                addRatingHandlers(newComment);
            }
        });
    }

    // Обработчик для выпадающего меню профиля
    const profileButton = document.querySelector('.profile-button');
    const accountDropdown = document.querySelector('.account_dropdown');
    if (profileButton && accountDropdown) {
        profileButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            accountDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!accountDropdown.contains(e.target) && !profileButton.contains(e.target)) {
                accountDropdown.classList.remove('active');
            }
        });
    }

    // Обработчик для выпадающего списка комментариев
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                dropdownMenu?.classList.remove('show');
            }
        });
    }

    // Обработчик для кнопки настроек комментариев
    const settingsToggle = document.querySelector('.settings-toggle');
    if (settingsToggle) {
        settingsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const menu = settingsToggle.nextElementSibling;
            if (menu) {
                // Закрываем все другие открытые меню
                document.querySelectorAll('.dropdown-menu.show').forEach(item => {
                    if (item !== menu) item.classList.remove('show');
                });
                menu.classList.toggle('show');
            }
        });
    }

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Добавляем обработчик для кнопки "Смотреть" в блоке управления
    const watchingButton = document.querySelector('.control-btn.watching');
    const playerContainer = document.querySelector('.player-container');
    
    if (watchingButton && playerContainer) {
        watchingButton.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToElement(playerContainer);
        });
    }
});

// Функция для добавления обработчиков рейтинга
function addRatingHandlers(comment) {
    const upVoteBtn = comment.querySelector('.up-vote');
    const downVoteBtn = comment.querySelector('.down-vote');
    const ratingSpan = comment.querySelector('.rating-up');

    if (upVoteBtn && downVoteBtn && ratingSpan) {
        let rating = parseInt(ratingSpan.textContent) || 0;
        let userVote = 0; // 0 - нет голоса, 1 - upvote, -1 - downvote

        upVoteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (userVote === 1) {
                // Отменяем голос
                rating--;
                userVote = 0;
                upVoteBtn.classList.remove('active');
                ratingSpan.classList.remove('upvoted');
            } else {
                // Добавляем upvote
                if (userVote === -1) {
                    rating++;
                    downVoteBtn.classList.remove('active');
                }
                rating++;
                userVote = 1;
                upVoteBtn.classList.add('active');
                downVoteBtn.classList.remove('active');
                ratingSpan.classList.add('upvoted');
                ratingSpan.classList.remove('downvoted');
            }
            ratingSpan.textContent = rating;
        });

        downVoteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (userVote === -1) {
                // Отменяем голос
                rating++;
                userVote = 0;
                downVoteBtn.classList.remove('active');
                ratingSpan.classList.remove('downvoted');
            } else {
                // Добавляем downvote
                if (userVote === 1) {
                    rating--;
                    upVoteBtn.classList.remove('active');
                }
                rating--;
                userVote = -1;
                downVoteBtn.classList.add('active');
                upVoteBtn.classList.remove('active');
                ratingSpan.classList.add('downvoted');
                ratingSpan.classList.remove('upvoted');
            }
            ratingSpan.textContent = rating;
        });
    }
}

// Функция для добавления обработчика ответов
function addReplyHandler(comment) {
    const replyButton = comment.querySelector('.comment-action');
    if (replyButton && replyButton.textContent.trim() === 'ответить') {
        replyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const existingForm = comment.querySelector('.reply-form');
            
            // Закрываем все открытые формы ответа
            document.querySelectorAll('.reply-form.active').forEach(form => {
                if (form !== existingForm) {
                    form.classList.remove('active');
                }
            });
            
            if (!existingForm) {
                // Создаем форму ответа
                const replyForm = document.createElement('div');
                replyForm.className = 'reply-form';
                replyForm.innerHTML = `
                    <textarea class="reply-input" placeholder="Написать ответ..."></textarea>
                    <div class="reply-actions">
                        <button class="reply-button reply-cancel">Отмена</button>
                        <button class="reply-button reply-submit">Ответить</button>
                    </div>
                `;
                
                comment.querySelector('.comment-actions').after(replyForm);
                
                // Показываем форму
                setTimeout(() => replyForm.classList.add('active'), 0);
                
                // Фокусируемся на поле ввода
                replyForm.querySelector('.reply-input').focus();
                
                // Добавляем обработчики для кнопок
                replyForm.querySelector('.reply-cancel').addEventListener('click', (e) => {
                    e.preventDefault();
                    replyForm.classList.remove('active');
                    setTimeout(() => replyForm.remove(), 300);
                });
                
                replyForm.querySelector('.reply-submit').addEventListener('click', (e) => {
                    e.preventDefault();
                    const replyText = replyForm.querySelector('.reply-input').value.trim();
                    if (replyText) {
                        const userName = localStorage.getItem('username') || 'Пользователь';
                        const userAvatar = document.querySelector('.profile-button img')?.src || '/path/to/default/avatar.jpg';

                        const replyComment = document.createElement('div');
                        replyComment.className = 'comment';
                        replyComment.innerHTML = `
                            <div class="comment-avatar-block">
                                <img src="${userAvatar}" alt="Avatar" class="comment-avatar">
                            </div>
                            <div class="comment-content-block">
                                <div class="comment-header">
                                    <div class="comment-info">
                                        <span class="comment-author">${userName}</span>
                                        <span class="comment-date">только что</span>
                                    </div>
                                    <div class="comment-rating">
                                        <button class="rating-button up-vote">↑</button>
                                        <span class="rating-up">0</span>
                                        <button class="rating-button down-vote">↓</button>
                                    </div>
                                </div>
                                <div class="comment-content">${replyText}</div>
                                <div class="comment-actions">
                                    <button class="comment-action">ответить</button>
                                    <button class="comment-action">жалоба</button>
                                </div>
                            </div>
                        `;

                        // Добавляем отступ для ответа
                        const parentMargin = parseInt(window.getComputedStyle(comment).marginLeft) || 0;
                        replyComment.style.marginLeft = `${parentMargin + 20}px`;

                        // Находим последний комментарий в текущей ветке
                        let lastComment = comment;
                        let nextComment = comment.nextElementSibling;
                        const targetMargin = parseInt(window.getComputedStyle(comment).marginLeft);
                        
                        while (nextComment && nextComment.classList.contains('comment')) {
                            const nextMargin = parseInt(window.getComputedStyle(nextComment).marginLeft);
                            if (nextMargin > targetMargin || 
                               (nextMargin === targetMargin && 
                                nextComment.previousElementSibling === lastComment)) {
                                lastComment = nextComment;
                                nextComment = nextComment.nextElementSibling;
                            } else {
                                break;
                            }
                        }
                        
                        // Добавляем ответ после последнего комментария в ветке
                        lastComment.after(replyComment);
                        
                        // Закрываем и удаляем форму ответа
                        replyForm.classList.remove('active');
                        setTimeout(() => replyForm.remove(), 300);

                        // Добавляем обработчики для нового комментария
                        addReplyHandler(replyComment);
                        addRatingHandlers(replyComment);
                    }
                });
            } else {
                // Переключаем видимость существующей формы
                existingForm.classList.toggle('active');
                if (existingForm.classList.contains('active')) {
                    existingForm.querySelector('.reply-input').focus();
                }
            }
        });
    }
}

// Функция для плавного скролла к элементу
function scrollToElement(element) {
    // Получаем позицию элемента
    const rect = element.getBoundingClientRect();
    const targetPosition = rect.top + window.pageYOffset - 20; // Небольшой отступ сверху

    // Плавно скроллим к элементу
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });

    // Добавляем класс для анимации появления после небольшой задержки
    setTimeout(() => {
        element.classList.add('visible');
    }, 300); // Задержка перед появлением
}