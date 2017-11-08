export default class Codein {
  constructor({
    el = document.querySelector('.codein-input'),
    mask = document.querySelector('.codein-input-mask'),
    maskChar = 0,
    max = 6,
    alphaNum = false,
    digitClass = 'digit',
    enter = () => {},
    update = () => {},
  } = {}) {
    this.el = el;
    this.mask = mask;
    this.maskChar = ''+maskChar;
    this.max = ~~max;
    this.alphaNum = !!alphaNum;
    this.digitClass = digitClass;
    this.enter = enter;
    this.update = update;
    this.init();
  }
  init() {
    this._keydown = this.keydown.bind(this);
    this._input = this.input.bind(this);
    this._paste = this.paste.bind(this);
    this.el.addEventListener('keydown', this._keydown);
    this.el.addEventListener('keyup', this._input);
    this.el.addEventListener('input', this._input);
    this.el.addEventListener('paste', this._paste);

    if (this.alphaNum) {
      this.filterChars = /[^a-zA-Z0-9]/g;
      this.allowChars = /^[a-zA-Z0-9]*$/;
    }
    else {
      this.filterChars = /[^0-9]/g;
      this.allowChars = /^[0-9]*$/;
    }

    this.unlock();
    this.value = this.value;
    this.fillMask();
    return this;
  }
  lock() {
    this.el.contentEditable = false;
    this.el.classList.add('locked');
    return this;
  }
  unlock() {
    this.el.contentEditable = true;
    this.el.spellcheck = false;
    this.el.classList.remove('locked');
    return this;
  }
  focus() {
    this.el.focus();
    return this;
  }
  keydown(e) {
    const range = window.getSelection().getRangeAt(0);
    const modifiers = [8, 9, 13, 16, 18, 20, 37, 38, 39, 40, 46];
    const value = this.value;
    const selection = window.getSelection();

    this.clean();

    if (modifiers.indexOf(e.keyCode) < 0 && !e.metaKey && !e.ctrlKey) {
      if (this.allowChars.test(e.key) && ((selection.type === 'Range' && selection.baseNode.parentNode.classList.contains(this.digitClass)) || value.length < this.max)) {
        const char = e.key || e.char;
        range.deleteContents();

        this.tokenize(char, range);

        e.preventDefault();
      }
      else {
        e.preventDefault();
        return false;
      }
    }
    if (e.keyCode === 13) {
      e.preventDefault();
      this.enter(this);
    }
    this.update(this);
    this.fillMask();
  }
  input(e) {
    this.update(this);
    this.fillMask();
  }
  paste(e) {
    const value = (e.clipboardData || window.clipboardData).getData('text').replace(this.filterChars, '');
    const numbers = value.split('');
    const range = window.getSelection().getRangeAt(0);
    range.deleteContents();
    const length = this.value.length;
    const max = Math.max(this.max - length, 0);

    numbers.splice(max);

    this.tokenize(numbers, range)

    this.update(this);
    this.fillMask();

    e.preventDefault();
    return false;
  }
  fillMask() {
    if (this.mask) {
      const numbers = this.value.split('');
      const length = numbers.length;
      const mask = this.maskChar !== undefined &&
        this.maskChar !== false &&
        this.maskChar !== '' ?
          '\xa0'.repeat(length) + this.maskChar.repeat(this.max - length) :
          '\xa0'.repeat(this.max);
      this.mask.innerHTML = '';

      this.tokenize(mask, this.mask);
    }
    return this;
  }
  tokenize(numbers, range) {
    if (!Array.isArray(numbers)) {
      numbers = (''+numbers).split('');
    }
    if (numbers.length) {
      const isRange = range instanceof Range;
      const isNode = range instanceof Node;
      let node = isRange ? range.startContainer.parentNode : document.createElement('span');
      let span;
      for (let number of numbers) {
        span = document.createElement('span');
        span.className = this.digitClass;
        span.textContent = number;

        if (isRange) {
          if (node.className !== this.digitClass) {
            range.insertNode(span);
          }
          else if (node.textContent === '') {
            node.parentNode.replaceChild(span, node);
          }
          else {
            insertAfter(span, node)
          }
          node = span;
        }
        else if (isNode) {
          range.appendChild(span);
        }

      }
      this.clean();
      if (isRange) {
        range.setStartAfter(span);
      }
    }
  }
  clean() {
    const children = [].slice.call(this.el.children, 0);
    for (let i = 0; i < children.length; i++) {
      if (children[i].textContent === '' || i >= this.max) {
        children[i].parentNode.removeChild(children[i]);
      }
    }
    return this;
  }
  set value(val) {
    const value = (''+val).replace(/[^0-9]/g, '');
    const numbers = value.substr(0,this.max).split('');

    this.reset();

    this.tokenize(numbers, this.el);

    this.clean();
    this.update(this);
    this.fillMask();
  }
  get value() {
    return this.el.textContent;
  }
  reset() {
    this.el.innerHTML = '';
    this.update(this);
    this.fillMask();
    return this;
  }
  destroy() {
    this.el.removeEventListener('keydown', this._keydown);
    this.el.removeEventListener('keyup', this._input);
    this.el.removeEventListener('input', this._input);
    this.el.removeEventListener('paste', this._paste);
    this.el.textContent = this.el.textContent;
    this.el.contentEditable = false;
    this.mask.textContent = '';
    return this;
  }
}

export function insertAfter(el, target) {
  const parent = target.parentNode;

  if (parent.lastChild === target) {
    parent.appendChild(el);
  }
  else {
    parent.insertBefore(el, target.nextSibling);
  }
}
