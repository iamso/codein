/*!
 * codein - version 0.1.2
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2017 Steve Ottoz
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Codein = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.insertAfter = insertAfter;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Codein = function () {
    function Codein() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$el = _ref.el;
      var el = _ref$el === undefined ? document.querySelector('.codein-input') : _ref$el;
      var _ref$mask = _ref.mask;
      var mask = _ref$mask === undefined ? document.querySelector('.codein-input-mask') : _ref$mask;
      var _ref$maskChar = _ref.maskChar;
      var maskChar = _ref$maskChar === undefined ? 0 : _ref$maskChar;
      var _ref$max = _ref.max;
      var max = _ref$max === undefined ? 6 : _ref$max;
      var _ref$digitClass = _ref.digitClass;
      var digitClass = _ref$digitClass === undefined ? 'digit' : _ref$digitClass;
      var _ref$enter = _ref.enter;
      var enter = _ref$enter === undefined ? function () {} : _ref$enter;
      var _ref$update = _ref.update;
      var update = _ref$update === undefined ? function () {} : _ref$update;

      _classCallCheck(this, Codein);

      this.el = el;
      this.mask = mask;
      this.maskChar = maskChar;
      this.max = ~~max;
      this.digitClass = digitClass;
      this.enter = enter;
      this.update = update;
      this.init();
    }

    _createClass(Codein, [{
      key: 'init',
      value: function init() {
        this._keydown = this.keydown.bind(this);
        this._input = this.input.bind(this);
        this._paste = this.paste.bind(this);
        this.el.addEventListener('keydown', this._keydown);
        this.el.addEventListener('keyup', this._input);
        this.el.addEventListener('input', this._input);
        this.el.addEventListener('paste', this._paste);
        this.unlock();
        this.value = this.value;
        this.fillMask();
        return this;
      }
    }, {
      key: 'lock',
      value: function lock() {
        this.el.contentEditable = false;
        this.el.classList.add('locked');
        return this;
      }
    }, {
      key: 'unlock',
      value: function unlock() {
        this.el.contentEditable = true;
        this.el.classList.remove('locked');
        return this;
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.el.focus();
        return this;
      }
    }, {
      key: 'keydown',
      value: function keydown(e) {
        var range = window.getSelection().getRangeAt(0);
        var modifiers = [8, 13, 37, 38, 39, 40, 46];
        var value = this.value;
        var selection = window.getSelection();

        this.clean();

        if (modifiers.indexOf(e.keyCode) < 0 && !e.metaKey && !e.ctrlKey) {
          if ((e.keyCode > 47 && e.keyCode < 58 || e.keyCode > 95 && e.keyCode < 106) && !e.shiftKey && (selection.type === 'Range' && selection.baseNode.parentNode.classList.contains(this.digitClass) || value.length < this.max)) {
            var char = e.key || e.char;
            range.deleteContents();

            this.tokenize(char, range);

            e.preventDefault();
          } else {
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
    }, {
      key: 'input',
      value: function input(e) {
        this.update(this);
        this.fillMask();
      }
    }, {
      key: 'paste',
      value: function paste(e) {
        var value = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        var numbers = value.split('');
        var range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        var length = this.value.length;
        var max = Math.max(this.max - length, 0);

        numbers.splice(max);

        this.tokenize(numbers, range);

        this.update(this);
        this.fillMask();

        e.preventDefault();
        return false;
      }
    }, {
      key: 'fillMask',
      value: function fillMask() {
        if (this.mask) {
          var numbers = this.value.split('');
          var length = numbers.length;
          var mask = ' '.repeat(length) + '0'.repeat(this.max - length);
          this.mask.innerHTML = '';

          this.tokenize(mask, this.mask);
        }
        return this;
      }
    }, {
      key: 'tokenize',
      value: function tokenize(numbers, range) {
        if (!Array.isArray(numbers)) {
          numbers = ('' + numbers).split('');
        }
        if (numbers.length) {
          var isRange = range instanceof Range;
          var isNode = range instanceof Node;
          var node = isRange ? range.startContainer.parentNode : document.createElement('span');
          var span = void 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = numbers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var number = _step.value;

              span = document.createElement('span');
              span.className = this.digitClass;
              span.textContent = number;

              if (isRange) {
                if (node.className !== this.digitClass) {
                  range.insertNode(span);
                } else if (node.textContent === '') {
                  node.parentNode.replaceChild(span, node);
                } else {
                  insertAfter(span, node);
                }
                node = span;
              } else if (isNode) {
                range.appendChild(span);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          this.clean();
          if (isRange) {
            range.setStartAfter(span);
          }
        }
      }
    }, {
      key: 'clean',
      value: function clean() {
        var children = [].slice.call(this.el.children, 0);
        for (var i = 0; i < children.length; i++) {
          if (children[i].textContent === '' || i >= this.max) {
            children[i].parentNode.removeChild(children[i]);
          }
        }
        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.el.innerHTML = '';
        this.update(this);
        this.fillMask();
        return this;
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.el.removeEventListener('keydown', this._keydown);
        this.el.removeEventListener('keyup', this._input);
        this.el.removeEventListener('input', this._input);
        this.el.removeEventListener('paste', this._paste);
        this.el.textContent = this.el.textContent;
        this.el.contentEditable = false;
        this.mask.textContent = '';
        return this;
      }
    }, {
      key: 'value',
      set: function set(val) {
        var value = ('' + val).replace(/[^0-9]/g, '');
        var numbers = value.substr(0, this.max).split('');

        this.reset();

        this.tokenize(numbers, this.el);

        this.clean();
        this.update(this);
        this.fillMask();
      },
      get: function get() {
        return this.el.textContent;
      }
    }]);

    return Codein;
  }();

  exports.default = Codein;
  function insertAfter(el, target) {
    var parent = target.parentNode;

    if (parent.lastChild === target) {
      parent.appendChild(el);
    } else {
      parent.insertBefore(el, target.nextSibling);
    }
  }
});