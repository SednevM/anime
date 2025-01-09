document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохраненный аватар при загрузке любой страницы
    const savedAvatar = localStorage.getItem('userAvatar');
    
    // Обновляем все изображения аватара на странице
    const avatarSelectors = [
        '.profile-button img',  // Аватар в шапке
        '.avatar img',          // Аватар на странице профиля
        '.current-avatar',      // Аватар в настройках
        '.user-info-profil .avatar img' // Большой аватар в профиле
    ];
    
    avatarSelectors.forEach(selector => {
        const avatars = document.querySelectorAll(selector);
        avatars.forEach(img => {
            if (img) {
                img.src = savedAvatar;
            }
        });
    });
}); 