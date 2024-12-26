# Awesome Lightbox

**Awesome Lightbox** is a responsive and feature-rich JavaScript library for displaying images with a beautiful and modern user interface. It comes with advanced functionality like zooming, slideshows, customizable themes, and more.

---

## Features

- Responsive design
- Light and dark themes
- Smooth animations and transitions
- Thumbnail navigation
- Zoom support
- Slideshow mode
- Fullscreen support
- Keyboard navigation
- Localization support

---

## Installation

Install the package using npm:

```bash
npm install awesome-lightbox
```

---

## Usage

### 1. Import the Library

Import the CSS and JavaScript into your project:

```javascript
import AwesomeLightbox from 'awesome-lightbox';
import 'awesome-lightbox/dist/lightbox.css';
```

### 2. Initialize the Lightbox

```javascript
const lightbox = new AwesomeLightbox({
  theme: 'dark', // Options: 'dark', 'light'
  autoPlay: true,
  autoPlayInterval: 5000
});
```

### 3. Display Images

Pass an array of images to the `show` method:

```javascript
const images = [
  { src: 'image1.jpg', caption: 'Beautiful Scene 1' },
  { src: 'image2.jpg', caption: 'Beautiful Scene 2' },
  { src: 'image3.jpg', caption: 'Beautiful Scene 3' }
];

lightbox.show(images, 0); // Start with the first image
```

---

## Options

Customize the lightbox with these options:

| Option             | Type    | Default            | Description                                    |
|--------------------|---------|--------------------|------------------------------------------------|
| `theme`            | String  | `'dark'`           | Theme of the lightbox. Options: `'dark'`, `'light'`. |
| `autoPlay`         | Boolean | `false`            | Enable/disable slideshow autoplay.            |
| `autoPlayInterval` | Number  | `3000`             | Time interval for autoplay (in milliseconds). |
| `i18n`             | Object  | `{}`               | Localization for buttons and captions.        |
| `onOpen`           | Function | `() => {}`       | Callback for when the lightbox opens.         |
| `onClose`          | Function | `() => {}`       | Callback for when the lightbox closes.        |
| `onImageChange`    | Function | `() => {}`       | Callback for when the active image changes.   |

---

## Development

Run the demo locally:

```bash
npm start
```

Build for production:

```bash
npm run build
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to submit issues and pull requests on [https://github.com/saikothasan/awesome-lightbox](https://github.com/saikothasan/awesome-lightbox).

---

## Demo

A live demo is available at [Awesome Lightbox Demo](https://yourdemo.com).
