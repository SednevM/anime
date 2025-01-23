// Обработчик для карточек аниме
document.querySelectorAll('.anime-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.anime-card-title').textContent;
        const studio = this.querySelector('.studio').textContent;
        const info = this.querySelector('.info').textContent;
        const description = this.querySelector('.catalog-description').textContent;
        const rating = this.querySelector('.rating-value').textContent;
        const genres = Array.from(this.querySelectorAll('.tag')).map(tag => tag.textContent);
        
        // Получаем источник видео и постера
        const videoSrc = this.querySelector('video source')?.src || '';
        const posterSrc = this.querySelector('img')?.src || '';
        const background = this.dataset.background || posterSrc;
        
        // Получаем количество эпизодов из информации
        const episodesMatch = info.match(/(\d+)\s+эпизод/);
        const totalEpisodes = episodesMatch ? episodesMatch[1] : '1';
        
        // Формируем URL с параметрами
        const params = new URLSearchParams({
            title: title,
            studio: studio,
            info: info,
            description: description,
            rating: rating,
            genres: genres.join(','),
            videoSrc: videoSrc,
            posterSrc: posterSrc,
            episodes: totalEpisodes,
            background: background
        });
        
        // Переходим на страницу плеера
        window.location.href = `player.html?${params.toString()}`;
    });
});

// Обработчик для кнопки списков
document.querySelectorAll('.lists-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = button.nextElementSibling;
        
        // Закрываем все другие открытые меню
        document.querySelectorAll('.lists-dropdown.active').forEach(menu => {
            if (menu !== dropdown) {
                menu.classList.remove('active');
            }
        });
        
        dropdown.classList.toggle('active');
    });
});

// Обработчик для опций в выпадающем меню
document.querySelectorAll('.list-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const list = option.dataset.list;
        const animeCard = option.closest('.anime-card');
        const animeTitle = animeCard.querySelector('.anime-card-title').textContent;
        
        // Здесь можно добавить логику для сохранения аниме в соответствующий список
        console.log(`Добавление "${animeTitle}" в список "${list}"`);
        
        // Закрываем выпадающее меню
        option.closest('.lists-dropdown').classList.remove('active');
    });
});

// Закрываем выпадающее меню при клике вне его
document.addEventListener('click', (e) => {
    if (!e.target.closest('.anime-lists-menu')) {
        document.querySelectorAll('.lists-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
}); 