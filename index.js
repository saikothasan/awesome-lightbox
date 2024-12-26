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
        i18n: {
          close: 'Close',
          prev: 'Previous',
          next: 'Next',
          fullscreen: 'Fullscreen',
          play: 'Play',
          pause: 'Pause',
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
          <div class="lightbox-image-container">
            <img class="lightbox-image" src="" alt="Lightbox Image" />
          </div>
          <button class="lightbox-next">${this._getIcon('next')} ${this.options.i18n.next}</button>
        </div>
        <div class="lightbox-footer">
          <div class="lightbox-caption"></div>
          <button class="lightbox-play">${this._getIcon('play')} ${this.options.i18n.play}</button>
          <button class="lightbox-pause hidden">${this._getIcon('pause')} ${this.options.i18n.pause}</button>
        </div>
        <div class="lightbox-thumbnails"></div>
      </div>
    `;

    document.body.appendChild(lightbox);

    // Add event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.hide());
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    lightbox.querySelector('.lightbox-fullscreen').addEventListener('click', () => this.toggleFullscreen());
    lightbox.querySelector('.lightbox-play').addEventListener('click', () => this.play());
    lightbox.querySelector('.lightbox-pause').addEventListener('click', () => this.pause());
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => this.hide());

    return lightbox;
  }

  _getIcon(type) {
    const icons = {
      close: `<svg>...</svg>`, // Add SVG icons for close
      prev: `<svg>...</svg>`, // Add SVG for prev
      next: `<svg>...</svg>`, // Add SVG for next
      fullscreen: `<svg>...</svg>`, // Add SVG for fullscreen
      play: `<svg>...</svg>`, // Add SVG for play
      pause: `<svg>...</svg>`, // Add SVG for pause
    };
    return icons[type];
  }

  _updateLightbox() {
    const img = this.lightbox.querySelector('.lightbox-image');
    const caption = this.lightbox.querySelector('.lightbox-caption');
    const thumbnails = this.lightbox.querySelector('.lightbox-thumbnails');

    img.src = this.images[this.currentIndex].src;
    caption.textContent = this.images[this.currentIndex].caption || '';

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
}

const awesomeLightbox = new AdvancedLightbox();
export default awesomeLightbox;
