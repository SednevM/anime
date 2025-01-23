document.addEventListener('DOMContentLoaded', () => {
    // Добавляем обработчики для карточек аниме
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('click', () => {
            // Получаем тип и количество эпизодов из строки "Сериал • 12 эпизодов"
            const infoText = card.querySelector('.info')?.textContent || '';
            const [type, episodesText] = infoText.split('•').map(text => text.trim());
            const episodes = episodesText ? parseInt(episodesText.split(' ')[0]) : 1;

            // Получаем рейтинг из элемента .rating-fill через width
            const ratingFill = card.querySelector('.rating-fill')?.style.width || '0%';
            const rating = ratingFill.replace('%', '');

            // Получаем статус из первого span в tooltip-header
            const statusText = card.querySelector('.tooltip-header span')?.textContent || '';
            const status = statusText.includes('сейчас в эфире') ? 'Онгоинг' : 
                          statusText.includes('Завершен') ? 'Завершен' : 'Анонс';

            const animeData = {
                title: card.querySelector('.anime-card-title')?.textContent || '',
                poster: card.querySelector('img')?.src || '',
                rating: rating,
                genres: Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent),
                type: type || 'Сериал',
                status: status,
                studio: card.querySelector('.studio')?.textContent || '',
                episodes: episodes,
                videoSrc: card.querySelector('video source')?.src || '',
                description: card.querySelector('.catalog-description')?.textContent || ''
            };

            // Создаем URL и переходим на страницу плеера
            const params = new URLSearchParams();
            Object.entries(animeData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    params.set(key, value.join(','));
                } else if (value) {
                    params.set(key, value.toString());
                }
            });

            window.location.href = `player.html?${params.toString()}`;
        });
    });
}); 