// Обработчик для карточек аниме
document.querySelectorAll('.anime-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.anime-card-title').textContent;
        const studio = this.querySelector('.studio').textContent;
        const info = this.querySelector('.info').textContent;
        const description = this.querySelector('.catalog-description').textContent;
        const rating = this.querySelector('.rating-value').textContent.replace('/5.0', '').trim() + '%';
        const genres = Array.from(this.querySelectorAll('.tag')).map(tag => tag.textContent);
        
        console.log('Данные из карточки:', {
            title,
            studio,
            info,
            description,
            rating,
            genres
        });
        
        const videoSrc = this.querySelector('video source').src;
        const posterSrc = this.querySelector('img').src;
        const background = this.dataset.background;
        
        console.log('Данные для фона:', {
            dataBackground: this.dataset.background,
            posterSrc: posterSrc,
            background: background
        });
        
        const episodesMatch = info.match(/(\d+)\s+эпизод/);
        const totalEpisodes = episodesMatch ? episodesMatch[1] : '1';
        
        const url = `player.html?title=${encodeURIComponent(title)}&studio=${encodeURIComponent(studio)}&info=${encodeURIComponent(info)}&description=${encodeURIComponent(description)}&rating=${encodeURIComponent(rating)}&genres=${encodeURIComponent(genres.join(','))}&videoSrc=${encodeURIComponent(videoSrc)}&posterSrc=${encodeURIComponent(posterSrc)}&episodes=${encodeURIComponent(totalEpisodes)}&background=${encodeURIComponent(background)}`;
        
        console.log('Сформированный URL:', url);
        window.location.href = url;
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