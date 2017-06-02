Codein
=======
Tokenized code input

Install
-------

### With Bower

```bash
bower install codein
```

### With NPM

```bash
npm install codein
```

Example Setup
-------------

### Javascript

```javascript
import Codein from 'codein';

// create an instance (with the defaults)
const codein = new Codein({
  el: document.querySelector('.codein-input'),
  mask: document.querySelector('.codein-input-mask'),
  maskChar: 0,
  max: 6,
  digitClass: 'digit',
  enter: codein => {},
  update: codein => {},
});
```

#### Methods
```javascript
codein.lock(); // lock the input
codein.unlock(); // unlock the input
codein.focus(); // focus the input
codein.value; // get the value
codein.value = '12123'; // set the value
codein.reset(); // reset the input
codein.destroy(); // destroy the codein
```

### HTML

```html
<div class="codein-input-wrapper">
  <div class="codein-input"></div>
  <div class="codein-input-mask"></div>
</div>
```

### CSS

```css
.codein-input-wrapper {
  font-family: monospace;
  width: 100%;
  max-width: 40rem;
  position: relative
}

.codein-input-wrapper .codein-input {
  border: 1px solid #ddd;
  position: relative;
  z-index: 10;
}

.codein-input-wrapper .codein-input:empty {
  padding-left: calc((100% / 6 / 2) - 0.35rem);
}

.codein-input-wrapper .codein-input,
.codein-input-wrapper .codein-input-mask {
  font-size: 1rem;
  width: 100%;
  min-height: 2rem;
  line-height: 2rem;
}

.codein-input-wrapper .codein-input-mask {
  color: #ccc;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.codein-input-wrapper .digit {
  display: inline-block;
  pointer-events: none;
  text-align: center;
  width: calc(100% / 6);
}
```

License
-------

[MIT License](LICENSE)
