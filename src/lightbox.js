import './lightbox.css';

class AdvancedLightbox {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        animationDuration: 300,
        enableKeyboardNav: true,
        theme: 'dark', // Options: 'light' or 'dark'
        primaryColor: '#f04b68',
        autoPlay: false,
        autoPlayInterval: 3000,
        lazyLoad: true,
        imageZoom: true,
        showCaptions: true,
        i18n: {
          close: 'Close',
          prev: 'Previous',
          next: 'Next',
          fullscreen: 'Fullscreen',
          play: 'Play',
          pause: 'Pause',
          zoomIn: 'Zoom In',
          zoomOut: 'Zoom Out',
        },
        onOpen: () => {},
        onClose: () => {},
        onImageChange: () => {},
      },
      options
    );

    this.currentIndex = 0;
    this.images = [];
    this.isPlaying = false;
    this.isZoomed = false;
    this.lightbox = this._createLightbox();

    if (this.options.enableKeyboardNav) {
      document.addEventListener('keydown', this._handleKeydown.bind(this));
    }
  }

  _createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'awesome-lightbox';
    lightbox.dataset.theme = this.options.theme;
    lightbox.style.display = 'none';

    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <div class="lightbox-header">
          <span class="lightbox-close">${this._getIcon('close')} ${this.options.i18n.close}</span>
          <span class="lightbox-fullscreen">${this._getIcon('fullscreen')} ${this.options.i18n.fullscreen}</span>
        </div>
        <div class="lightbox-main">
          <button class="lightbox-prev">${this._getIcon('prev')} ${this.options.i18n.prev}</button>
          <div class="lightbox-media-container">
            <img class="lightbox-image" src="" alt="Lightbox Image" />
            <video class="lightbox-video hidden" controls>
              <source src="" type="video/mp4" />
            </video>
          </div>
          <button class="lightbox-next">${this._getIcon('next')} ${this.options.i18n.next}</button>
        </div>
        <div class="lightbox-footer">
          <div class="lightbox-caption"></div>
          <button class="lightbox-play">${this._getIcon('play')} ${this.options.i18n.play}</button>
          <button class="lightbox-pause hidden">${this._getIcon('pause')} ${this.options.i18n.pause}</button>
          <button class="lightbox-zoom">${this._getIcon('zoomIn')} ${this.options.i18n.zoomIn}</button>
        </div>
        <div class="lightbox-thumbnails"></div>
      </div>
    `;

    document.body.appendChild(lightbox);

    // Event Listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.hide());
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    lightbox.querySelector('.lightbox-fullscreen').addEventListener('click', () => this.toggleFullscreen());
    lightbox.querySelector('.lightbox-play').addEventListener('click', () => this.play());
    lightbox.querySelector('.lightbox-pause').addEventListener('click', () => this.pause());
    lightbox.querySelector('.lightbox-zoom').addEventListener('click', () => this.toggleZoom());
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => this.hide());

    return lightbox;
  }

  _getIcon(type) {
    const icons = {
      close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      prev: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      next: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 9V3H3v7m11-7v7h7V3h-7m-7 11v7h7v-7m4 4l7-7h-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5 3v18l15-9L5 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6zm8-14v14h4V5h-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      zoomIn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };
    return icons[type];
  }

  _updateLightbox() {
    const img = this.lightbox.querySelector('.lightbox-image');
    const video = this.lightbox.querySelector('.lightbox-video');
    const caption = this.lightbox.querySelector('.lightbox-caption');
    const thumbnails = this.lightbox.querySelector('.lightbox-thumbnails');

    const currentImage = this.images[this.currentIndex];

    if (currentImage.type === 'image') {
      img.src = currentImage.src;
      img.classList.remove('hidden');
      video.classList.add('hidden');
    } else if (currentImage.type === 'video') {
      video.src = currentImage.src;
      video.classList.remove('hidden');
      img.classList.add('hidden');
    }

    caption.textContent = this.options.showCaptions ? (currentImage.caption || '') : '';

    thumbnails.innerHTML = this.images
      .map(
        (img, index) => `
          <div class="thumbnail ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <img src="${img.src}" alt="${img.caption || ''}" />
          </div>
        `
      )
      .join('');

    thumbnails.querySelectorAll('.thumbnail').forEach(thumbnail => {
      thumbnail.addEventListener('click', event => {
        this.currentIndex = parseInt(event.currentTarget.dataset.index, 10);
        this._updateLightbox();
      });
    });

    this.options.onImageChange(this.currentIndex, this.images[this.currentIndex]);
  }

  toggleZoom() {
    const img = this.lightbox.querySelector('.lightbox-image');
    if (this.isZoomed) {
      img.style.transform = 'scale(1)';
      img.style.transition = `transform ${this.options.animationDuration}ms ease`;
      this.isZoomed = false;
    } else {
      img.style.transform = 'scale(2)';
      img.style.transition = `transform ${this.options.animationDuration}ms ease`;
      this.isZoomed = true;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.lightbox.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lightbox.querySelector('.lightbox-play').classList.add('hidden');
    this.lightbox.querySelector('.lightbox-pause').classList.remove('hidden');
    this.autoPlayInterval = setInterval(() => this.next(), this.options.autoPlayInterval);
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.lightbox.querySelector('.lightbox-play').classList.remove('hidden');
    this.lightbox.querySelector('.lightbox-pause').classList.add('hidden');
    clearInterval(this.autoPlayInterval);
  }

  show(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;

    this._updateLightbox();
    this.lightbox.style.display = 'flex';
    setTimeout(() => this.lightbox.classList.add('visible'), 10);
    this.options.onOpen();
  }

  hide() {
    this.lightbox.classList.remove('visible');
    setTimeout(() => {
      this.lightbox.style.display = 'none';
      this.pause();
      this.options.onClose();
    }, this.options.animationDuration);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this._updateLightbox();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this._updateLightbox();
  }

  _handleKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        this.prev();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case 'Escape':
        this.hide();
        break;
      case 'Enter':
        this.toggleFullscreen();
        break;
      default:
        break;
    }
  }
}

const awesomeLightbox = new AdvancedLightbox();
export default awesomeLightbox;
