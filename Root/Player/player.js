class AnimePlayer {
    constructor() {
        this.player = document.getElementById('anime-player');
        this.playPauseBtn = document.querySelector('.play-pause');
        this.volumeBtn = document.querySelector('.volume');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.fullscreenBtn = document.querySelector('.fullscreen');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTime = document.querySelector('.current');
        this.duration = document.querySelector('.duration');
        this.episodesList = document.querySelector('.episodes');
        
        this.initializePlayer();
        this.addEventListeners();
    }

    initializePlayer() {
        // Пример списка эпизодов (в реальном проекте это будет приходить с сервера)
        this.episodes = [
            { id: 1, title: 'Эпизод 1', url: 'videos/rezero_trailer_1920.mp4' },
            { id: 2, title: 'Эпизод 2', url: 'videos/rezero_trailer_1920.mp4' },
            { id: 3, title: 'Эпизод 3', url: 'videos/rezero_trailer_1920.mp4' },
        ];
        
        this.renderEpisodesList();
    }

    addEventListeners() {
        // Воспроизведение/пауза
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        
        // Обновление прогресс-бара
        this.player.addEventListener('timeupdate', () => this.updateProgress());
        
        // Перемотка по клику на прогресс-бар
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // Управление громкостью
        this.volumeSlider.addEventListener('input', () => this.handleVolume());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        
        // Полноэкранный режим
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Обновление времени
        this.player.addEventListener('loadedmetadata', () => this.updateDuration());
    }

    togglePlay() {
        if (this.player.paused) {
            this.player.play();
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            this.player.pause();
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    updateProgress() {
        const percentage = (this.player.currentTime / this.player.duration) * 100;
        this.progress.style.width = `${percentage}%`;
        this.currentTime.textContent = this.formatTime(this.player.currentTime);
    }

    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.player.duration;
        this.player.currentTime = (clickX / width) * duration;
    }

    handleVolume() {
        const value = this.volumeSlider.value;
        this.player.volume = value;
        this.updateVolumeIcon(value);
    }

    toggleMute() {
        this.player.muted = !this.player.muted;
        if (this.player.muted) {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.volumeSlider.value = 0;
        } else {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.volumeSlider.value = this.player.volume;
        }
    }

    updateVolumeIcon(value) {
        if (value === 0) {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (value < 0.5) {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.player.requestFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDuration() {
        this.duration.textContent = this.formatTime(this.player.duration);
    }

    renderEpisodesList() {
        this.episodesList.innerHTML = this.episodes
            .map(episode => `
                <div class="episode-button" data-episode-id="${episode.id}">
                    ${episode.title}
                </div>
            `).join('');

        // Добавляем обработчики для кнопок эпизодов
        document.querySelectorAll('.episode-button').forEach(button => {
            button.addEventListener('click', () => {
                const episodeId = button.dataset.episodeId;
                const episode = this.episodes.find(ep => ep.id === parseInt(episodeId));
                this.loadEpisode(episode);
            });
        });
    }

    loadEpisode(episode) {
        // Обновляем source видео
        this.player.src = episode.url;
        this.player.load();
        
        // Обновляем активный эпизод в списке
        document.querySelectorAll('.episode-button').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.episodeId === episode.id.toString()) {
                button.classList.add('active');
            }
        });
        
        // Автоматически начинаем воспроизведение
        this.player.play();
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

// Инициализация плеера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AnimePlayer();
});
