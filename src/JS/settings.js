document.addEventListener('DOMContentLoaded', function() {
    //�лементы для работы с аватаром
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    const currentAvatar = document.querySelector('.current-avatar');
    const allAvatars = document.querySelectorAll('.profile-button img, .current-avatar');
    const profileButton = document.getElementById('profile_button');
    const accountDropdown = document.getElementById('account_dropdown');
    
    // Загружаем сохраненный аватар при загрузке страницы
    const savedAvatar = localStorage.getItem('userAvatar') || 'src/img/avatar.jpg';
    allAvatars.forEach(img => {
        img.src = savedAvatar;
    });

    // Создаем скрытый input для загрузки файла
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Обработчик клика по кнопке изменения аватара
    changeAvatarBtn?.addEventListener('click', () => {
        fileInput.click();
    });

    // Обработчик изменения файла
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const newAvatarSrc = event.target.result;
                // Обновляем все аватары на странице
                allAvatars.forEach(img => {
                    img.src = newAvatarSrc;
                });
                // Сохраняем в localStorage
                localStorage.setItem('userAvatar', newAvatarSrc);
            };
            reader.readAsDataURL(file);
        }
    });

    // Обработчик для выпадающего меню профиля
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

    // Сохранение настроек
    const saveButton = document.querySelector('.save-settings-btn');
    const cancelButton = document.querySelector('.cancel-btn');
    let originalValues = {};

    // Сохраняем оригинальные значения
    function saveOriginalValues() {
        originalValues = {
            username: document.getElementById('username')?.value,
            email: document.getElementById('email')?.value,
            bio: document.getElementById('bio')?.value,
            avatar: savedAvatar,
            notifications: Array.from(document.querySelectorAll('.notification-option input')).map(input => input.checked)
        };
    }

    // Восстанавливаем оригинальные значения
    function restoreOriginalValues() {
        if (document.getElementById('username')) document.getElementById('username').value = originalValues.username;
        if (document.getElementById('email')) document.getElementById('email').value = originalValues.email;
        if (document.getElementById('bio')) document.getElementById('bio').value = originalValues.bio;
        allAvatars.forEach(img => {
            img.src = originalValues.avatar;
        });
        document.querySelectorAll('.notification-option input').forEach((input, index) => {
            input.checked = originalValues.notifications[index];
        });
        localStorage.setItem('userAvatar', originalValues.avatar);
    }

    // Сохраняем оригинальные значения при загрузке
    saveOriginalValues();

    // Загружаем сохраненные данные пользователя при загрузке страницы
    const savedUsername = localStorage.getItem('username') || 'Kai';
    const savedBio = localStorage.getItem('userBio') || 'Любитель аниме и манги';
    
    if (document.getElementById('username')) {
        document.getElementById('username').value = savedUsername;
    }
    if (document.getElementById('bio')) {
        document.getElementById('bio').value = savedBio;
    }
    
    saveButton?.addEventListener('click', function(e) {
        e.preventDefault();
        const currentAvatarSrc = allAvatars[0].src;
        const username = document.getElementById('username')?.value || 'Kai';
        const bio = document.getElementById('bio')?.value || 'Любитель аниме и манги';
        
        // Сохраняем данные в localStorage
        localStorage.setItem('userAvatar', currentAvatarSrc);
        localStorage.setItem('username', username);
        localStorage.setItem('userBio', bio);
        
        saveOriginalValues();
        alert('Настройки сохранены');
    });

    cancelButton?.addEventListener('click', function(e) {
        e.preventDefault();
        restoreOriginalValues();
    });

    // Применяем тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Обработчик для кнопки переключения темы
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.previousElementSibling;

    themeToggle?.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isDark = document.body.classList.toggle('dark-theme');
        
        if (isDark) {
            this.textContent = 'Светлая тема';
            themeIcon?.classList.remove('fa-moon');
            themeIcon?.classList.add('fa-sun');
        } else {
            this.textContent = 'Тёмная тема';
            themeIcon?.classList.remove('fa-sun');
            themeIcon?.classList.add('fa-moon');
        }
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Обработчики для кнопок темы в разделе "Внешний вид"
    const lightThemeBtn = document.querySelector('.theme-option.light');
    const darkThemeBtn = document.querySelector('.theme-option.dark');
    
    function updateThemeButtons(isDark) {
        lightThemeBtn.classList.toggle('active', !isDark);
        darkThemeBtn.classList.toggle('active', isDark);
    }
    
    // Применяем начальное состояние
    const currentTheme = localStorage.getItem('theme');
    updateThemeButtons(currentTheme === 'dark');
    
    lightThemeBtn?.addEventListener('click', function() {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        updateThemeButtons(false);
        
        // Обновляем состояние кнопки в выпадающем меню
        if (themeToggle) {
            themeToggle.textContent = 'Тёмная тема';
            const themeIcon = themeToggle.previousElementSibling;
            themeIcon?.classList.remove('fa-sun');
            themeIcon?.classList.add('fa-moon');
        }
    });
    
    darkThemeBtn?.addEventListener('click', function() {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeButtons(true);
        
        // Обновляем состояние кнопки в выпадающем меню
        if (themeToggle) {
            themeToggle.textContent = 'Светлая тема';
            const themeIcon = themeToggle.previousElementSibling;
            themeIcon?.classList.remove('fa-moon');
            themeIcon?.classList.add('fa-sun');
        }
    });
});

// ... existing code ...