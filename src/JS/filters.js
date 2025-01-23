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
});

// Слушаем изменения в localStorage для синхронизации темы между вкладками
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        applyTheme(e.newValue === 'dark');
    }
});

document.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
      document.body.classList.add('scrolled');
  } else {
      document.body.classList.remove('scrolled');
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const burgerMenu = document.querySelector('.burger-menu');
  const menu = document.querySelector('.menu-profile');

  burgerMenu.addEventListener('click', function () {
      menu.classList.toggle('active');
  });
});

    document.addEventListener('DOMContentLoaded', function() {
        const slides = document.querySelector('.slides');
        const slideArray = Array.from(slides.children);
        const imagePaths = [
            "/src/img/alya.png",
            "/src/img/dandan.jpg",
            "/src/img/rezero.webp",
            "/src/img/dictor.jpg"
        ];
        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        const slideWidth = 100 / slideArray.length;
        let autoScrollInterval;

        // Автопрокрутка
        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideArray.length;
                setPositionByIndex();
            }, 3000); 
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }


        function setPositionByIndex() {
            currentTranslate = currentIndex * -slideWidth;
            slides.style.transform = `translateX(${currentTranslate}%)`;


            slideArray.forEach((slide, index) => {
                if (index === currentIndex && imagePaths[index]) {
                    slide.style.backgroundImage = `url(${imagePaths[index]})`;
                } else {
                    slide.style.backgroundImage = 'none';
                }
            });
        }


        slides.addEventListener('touchstart', touchStart);
        slides.addEventListener('touchend', touchEnd);
        slides.addEventListener('touchmove', touchMove);

        function touchStart(event) {
            isDragging = true;
            startPos = event.touches[0].clientX;
            animationID = requestAnimationFrame(animation);
        }

        function touchEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;
            if (movedBy < -slideWidth && currentIndex < slideArray.length - 1) currentIndex += 1;
            if (movedBy > slideWidth && currentIndex > 0) currentIndex -= 1;

            setPositionByIndex();
            prevTranslate = currentTranslate;
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = event.touches[0].clientX;
                currentTranslate = prevTranslate + (currentPosition - startPos) / window.innerWidth * 100;
            }
        }

        function animation() {
            slides.style.transform = `translateX(${currentTranslate}%)`;
            if (isDragging) requestAnimationFrame(animation);
        }

        document.getElementById('prev').addEventListener('click', () => {
            stopAutoScroll();
            if (currentIndex > 0) {
                currentIndex -= 1;
                setPositionByIndex();
                prevTranslate = currentTranslate;
            }
            startAutoScroll();
        });

        document.getElementById('next').addEventListener('click', () => {
            stopAutoScroll();
            if (currentIndex < slideArray.length - 1) {
                currentIndex += 1;
                setPositionByIndex();
                prevTranslate = currentTranslate;
            }
            startAutoScroll();
        });

        setPositionByIndex();
    })

document.addEventListener('DOMContentLoaded', function (){
    const profileButton = document.getElementById('profile_button');
    const accountDropdown = document.getElementById('account_dropdown');
    const themeToggleInAccount = document.querySelector('.inside_account #theme-toggle');

    profileButton.addEventListener('click', () => {
        accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
    });

    themeToggleInAccount.addEventListener('click', function(e) {
        e.stopPropagation(); 
        const body = document.body;
        const themeIcon = this.previousElementSibling;
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            this.textContent = 'Тёмная тема';
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            body.classList.add('dark-theme');
            this.textContent = 'Светлая тема';
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    document.addEventListener('click', (event) => {
        if (!profileButton.contains(event.target) && !accountDropdown.contains(event.target)) {
            accountDropdown.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
  const videoContainers = document.querySelectorAll('.video-container');

  videoContainers.forEach(container => {
    const poster = container.querySelector('img');
    const video = container.querySelector('video');
  
    container.addEventListener('mouseover', () => {
      poster.style.opacity = 0;
      video.classList.add('active');
      video.play();
    });
  
    container.addEventListener('mouseout', () => {
      video.pause();
      video.currentTime = 0;
      video.classList.remove('active');
      poster.style.opacity = 1;
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const ratingBars = document.querySelectorAll('.rating-bar'); // Select all rating bars
  
    ratingBars.forEach(bar => {
      const ratingFill = bar.querySelector('.rating-fill');
      if (!ratingFill) {
        console.error('Элемент .rating-fill не найден внутри', bar);
        return; // Важно: прекращаем обработку текущей карточки
      }
  
      const ratingWidth = parseInt(ratingFill.style.width);
  
      // Важно: удаляем все предыдущие классы
      ratingFill.classList.remove('green', 'red', 'orange');
  
  
      if (ratingWidth >= 80) {
        ratingFill.classList.add('green');
      } else if (ratingWidth >= 50) {
        ratingFill.classList.add('red');
      } else if (ratingWidth >= 25) {
        ratingFill.classList.add('orange');
      } else { //Добавляем класс для значений меньше 25
          ratingFill.classList.add('gray');
      }
    });
  });

document.addEventListener('DOMContentLoaded', function() {
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');
    const seasonFilter = document.getElementById('seasonFilter');
    const applyFiltersButton = document.getElementById('applyFilters');
    const animeCards = document.querySelectorAll('.anime-card');

    applyFiltersButton.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedGenre = genreFilter.value;
        const selectedYear = yearFilter.value;
        const selectedSeason = seasonFilter.value;

        animeCards.forEach(card => {
            const cardGenre = card.getAttribute('data-genre');
            const cardYear = card.getAttribute('data-year');
            const cardSeason = card.getAttribute('data-season');

            if ((selectedGenre === "" || cardGenre === selectedGenre) &&
                (selectedYear === "" || cardYear === selectedYear) &&
                (selectedSeason === "" || cardSeason === selectedSeason)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

function showCustomDropdown(id) {
    document.getElementById(id).style.display = 'block';
}

function hideCustomDropdown(id) {
    setTimeout(() => {
        document.getElementById(id).style.display = 'none';
    }, 200); 
}

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        const input = this.parentElement.previousElementSibling;
        input.value = this.textContent;
        hideCustomDropdown(this.parentElement.id);
    });
});

//document.addEventListener('DOMContentLoaded', function() {
    // const itemsPerPage = 8;
    // const catalog = document.querySelector('.catalog');
    // const allCards = Array.from(document.querySelectorAll('.anime-card'));
    // let currentPage = 1;
    // let isLoading = false;

    
    // allCards.forEach((card, index) => {
    //     if (index >= itemsPerPage) {
    //         card.style.display = 'none';
    //     }
    // });

    // function showLoading() {
    //     if (!isLoading) {
    //         isLoading = true;
    //         const loadingDiv = document.createElement('div');
    //         loadingDiv.className = 'loading';
    //         loadingDiv.textContent = 'Загрузка...';
    //         catalog.appendChild(loadingDiv);
    //     }
    // }

    // function hideLoading() {
    //     const loadingDiv = document.querySelector('.loading');
    //     if (loadingDiv) {
    //         loadingDiv.remove();
    //     }
    //     isLoading = false;
    // }

    // function loadMoreItems() {
    //     if (isLoading) return;

    //     const scrollPosition = window.scrollY;
    //     const windowHeight = window.innerHeight;
    //     const documentHeight = document.documentElement.scrollHeight;

    //     if (scrollPosition + windowHeight >= documentHeight - 10) {
            
    //         setTimeout(() => {
    //             const start = currentPage * itemsPerPage;
    //             const end = start + itemsPerPage;

                
    //             if (start < allCards.length) {
                
    //                 allCards.slice(start, end).forEach(card => {
    //                     card.style.display = 'block';
    //                 });
    //                 currentPage++;
    //             } else {
                    
    //                 window.removeEventListener('scroll', loadMoreItems);
    //             }

    //             hideLoading();
    //         }, 1000);
    //     }
    // }

   
    // window.addEventListener('scroll', loadMoreItems);
//});

// Функция для позиционирования тултипа
function positionTooltip(card) {
    const tooltip = card.querySelector('.tooltip');
    if (!tooltip) return;

    const cardRect = card.getBoundingClientRect();
    const tooltipWidth = 350;
    const windowWidth = document.documentElement.clientWidth;

    // Сбрасываем стили
    tooltip.style.left = '';
    tooltip.style.right = '';
    tooltip.style.top = '50%';
    tooltip.style.transform = 'translateY(-50%)';

    // Проверяем пространство справа
    if (cardRect.right + tooltipWidth + 20 <= windowWidth) {
        tooltip.style.left = '105%';
        tooltip.style.right = 'auto';
    }
    // Проверяем пространство слева
    else if (cardRect.left - tooltipWidth - 20 >= 0) {
        tooltip.style.left = 'auto';
        tooltip.style.right = '105%';
    }
    // Размещаем снизу
    else {
        tooltip.style.left = '50%';
        tooltip.style.top = '100%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.marginTop = '10px';
    }
}

// Добавляем обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.anime-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => positionTooltip(card));
        card.addEventListener('mousemove', () => positionTooltip(card));
    });

    window.addEventListener('resize', () => {
        const hoveredCard = document.querySelector('.anime-card:hover');
        if (hoveredCard) positionTooltip(hoveredCard);
    });

    window.addEventListener('scroll', () => {
        const hoveredCard = document.querySelector('.anime-card:hover');
        if (hoveredCard) positionTooltip(hoveredCard);
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
  
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

document.addEventListener('DOMContentLoaded', () => {
    const animeCards = document.querySelectorAll('.catalog .anime-card.container.video-container');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const pageInfo = document.getElementById('page-info');
    const pageNumbersContainer = document.getElementById('page-numbers');

    if (!prevButton || !nextButton || !pageInfo || !pageNumbersContainer) {
        console.error("Не удалось найти элементы пагинации.");
        return;
    }

    const itemsPerPage = 8;
    let currentPage = 1;
    const totalItems = animeCards.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    function renderPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        animeCards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });

        pageNumbersContainer.innerHTML = '';
        const prevArrow = document.createElement('button');
        prevArrow.innerHTML = '';
        prevArrow.classList.add('pagination-button', 'prev_arrow');
        prevArrow.disabled = page === 1;
        prevArrow.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
        pageNumbersContainer.appendChild(prevArrow);
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, page + 2);

        if (page <= 3) {
            endPage = Math.min(5, totalPages);
        }
        if (page >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.textContent = i;
            pageNumber.classList.add('pagination-button');
            if (i === page) {
                pageNumber.classList.add('active');
            }
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage);
            });
            pageNumbersContainer.appendChild(pageNumber);
        }
        if (endPage < totalPages) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.classList.add('pagination-dots');
            pageNumbersContainer.appendChild(dots);

            const lastPage = document.createElement('button');
            lastPage.textContent = totalPages;
            lastPage.classList.add('pagination-button');
            lastPage.addEventListener('click', () => {
                currentPage = totalPages;
                renderPage(currentPage);
            });
            pageNumbersContainer.appendChild(lastPage);
        }

        const nextArrow = document.createElement('button');
        nextArrow.innerHTML = '';
        nextArrow.classList.add('pagination-nav','pagination-button', 'next_arrow');
        nextArrow.disabled = page === totalPages;
        nextArrow.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
        pageNumbersContainer.appendChild(nextArrow);
    }

    renderPage(currentPage);
});

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.season-slider');
    const slides = document.querySelector('.season-slides');
    const cards = Array.from(slides.children);
    const prevButton = document.querySelector('.season-prev');
    const nextButton = document.querySelector('.season-next');
    
    let currentIndex = 0;
    let cardWidth;
    let cardsPerView;
    
    // Функция обновления размеров
    function updateDimensions() {
        // Получаем актуальную ширину карточки с учетом отступов
        cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
        // Вычисляем количество видимых карточек
        cardsPerView = Math.floor(slider.offsetWidth / cardWidth);
        
        // Проверяем и корректируем текущий индекс
        if (currentIndex > cards.length - cardsPerView) {
            currentIndex = cards.length - cardsPerView;
            moveSlides(0);
        }
    }
    
    // Функция для перемещения слайдов
    function moveSlides(direction) {
        currentIndex = Math.max(0, Math.min(currentIndex + direction, cards.length - cardsPerView));
        slides.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Обновление состояния кнопок
        prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
        nextButton.style.opacity = currentIndex >= cards.length - cardsPerView ? "0.5" : "1";
        prevButton.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
        nextButton.style.pointerEvents = currentIndex >= cards.length - cardsPerView ? "none" : "auto";
    }
    
    // Обработчики для кнопок
    prevButton.addEventListener('click', () => moveSlides(-1));
    nextButton.addEventListener('click', () => moveSlides(1));
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        updateDimensions();
        moveSlides(0); // Обновляем позицию без смещения
    });
    
    // Инициализация слайдера
    updateDimensions();
    moveSlides(0);
    
    // Добавляем поддержку свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    slides.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    slides.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });
    
    slides.addEventListener('touchend', () => {
        const swipeDistance = touchStartX - touchEndX;
        if (Math.abs(swipeDistance) > 50) { // Минимальное расстояние для свайпа
            if (swipeDistance > 0) {
                moveSlides(1); // Свайп влево
            } else {
                moveSlides(-1); // Свайп вправо
            }
        }
    });
});

document.getElementById('theme-toggle').addEventListener('click', function() {
    const body = document.body;
    const themeIcon = this.previousElementSibling; 
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        this.textContent = 'Тёмная тема';
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        body.classList.add('dark-theme');
        this.textContent = 'Светлая тема';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.previousElementSibling;
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = 'Светлая тема';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const animeCards = document.querySelectorAll('.anime-card');

    animeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Собираем информацию об аниме
            const title = card.querySelector('.anime-card-title').textContent;
            const studio = card.querySelector('.studio').textContent;
            const info = card.querySelector('.info').textContent;
            
            // Разбираем строку info на тип и количество эпизодов
            const [type, episodesText] = info.split('•').map(text => text.trim());
            const episodes = parseInt(episodesText?.match(/\d+/)?.[0]) || 1;
            
            const description = card.querySelector('.catalog-description').textContent;
            const rating = card.querySelector('.rating-value').textContent;
            const genres = Array.from(card.querySelectorAll('.tag'))
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
                genres: genres,
                status: status,
                videoSrc: videoSrc,
                poster: poster
            });

            // Переходим на страницу плеера
            window.location.href = `player.html?${params.toString()}`;
        });
    });
});