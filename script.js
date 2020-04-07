import helper from './helper.js';

const { KEYCODES, FUNCTIONALKEYCODES, WRITINGKEYCODES } = helper; // destructuring
let lang = localStorage.getItem('lang') || 'en';
let capsLock = false; // true

const wrap = document.createElement('div');
wrap.classList.add('wrapper');
document.body.append(wrap);
const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
const description = document.createElement('p');
description.classList.add('description');
description.innerHTML = `Hi! <br>The keyboard is made on Windows. Change language by <b>ShiftLeft+Alt</b> or <button class="changLangBtn">${lang}</button><br>
Change the case <b>CapsLock</b>. Change the case once <b>Shift+key</b>.`;
wrap.append(textarea, keyboard, description);

const renderKeyboard = () => {
  const activeKeys = [];
  while (keyboard.firstChild) {
    if (keyboard.firstChild.classList.contains('active')) {
      activeKeys.push(keyboard.firstChild.classList[1]);
    }
    keyboard.removeChild(keyboard.firstChild);
  }
  const fragment = new DocumentFragment();
  KEYCODES.forEach((el) => {
    const isFunctional = Object.keys(FUNCTIONALKEYCODES).includes(el);

    const button = document.createElement('div');
    button.classList.add('button', el);

    if (isFunctional) {
      button.textContent = FUNCTIONALKEYCODES[el];
      button.classList.add('functional');
      if (activeKeys.includes(el)) {
        button.classList.add('active');
      }
    } else {
      button.textContent = WRITINGKEYCODES[el][lang][capsLock ? 1 : 0];
    }

    fragment.append(button);
  });

  keyboard.append(fragment);
};

renderKeyboard();

document.addEventListener('keydown', (evt) => {
  textarea.focus();
  const key = document.querySelector(`.${evt.code}`);

  if (!key) return;

  key.classList.add('active');

  if (evt.key === 'Tab') {
    textarea.value += '\t';
  }
  if (evt.key === 'Shift') {
    capsLock = !capsLock;

    renderKeyboard();
  }
  if (evt.code === 'CapsLock') {
    capsLock = !capsLock;

    renderKeyboard();
  }
  if ((evt.shiftKey && evt.altKey) || (evt.code === 'AltRight' && evt.shiftKey)) {
    lang = lang === 'en' ? 'ru' : 'en';
    renderKeyboard();
  }

  const onKeyup = () => {
    const key2 = document.querySelector(`.${evt.code}`);
    key2.classList.remove('active');

    if (evt.key === 'Shift') {
      capsLock = !capsLock;
      renderKeyboard();
    }
    document.removeEventListener('keyup', onKeyup);
  };
  document.addEventListener('keyup', onKeyup);
});

keyboard.addEventListener('mousedown', (evt) => {
  const actualClass = evt.target.classList;
  if (actualClass.contains('button')) {
    const isFunctional = Object.keys(FUNCTIONALKEYCODES).includes(actualClass[1]);
    actualClass.add('active');
    if (
      !isFunctional ||
      actualClass.contains('ArrowLeft') ||
      actualClass.contains('ArrowDown') ||
      actualClass.contains('ArrowUp') ||
      actualClass.contains('ArrowRight')
    ) {
      textarea.value += evt.target.innerText;
    } else if (actualClass.contains('Enter')) {
      textarea.value += '\n';
    } else if (actualClass.contains('Space')) {
      textarea.value += ' ';
    } else if (actualClass.contains('Backspace')) {
      textarea.value = textarea.value.slice(0, textarea.value.length - 1);
    } else if (actualClass.contains('Delete')) {
      textarea.value = textarea.value.slice(0, textarea.value.length - 1);
    } else if (actualClass.contains('Tab')) {
      textarea.value += '\t';
    } else if (actualClass.contains('CapsLock')) {
      capsLock = !capsLock;
      renderKeyboard();
    } else if (actualClass[1] === 'ShiftLeft' || actualClass[1] === 'ShiftRight') {
      capsLock = !capsLock;
      renderKeyboard();
    }
  }

  const onMouseup = () => {
    if (actualClass[1] === 'CapsLock') {
      document.querySelector('.CapsLock').classList.remove('active');
    } else if (actualClass[1] === 'ShiftLeft' || actualClass[1] === 'ShiftRight') {
      capsLock = !capsLock;
      renderKeyboard();
      document.querySelector('.ShiftLeft').classList.remove('active');
      document.querySelector('.ShiftRight').classList.remove('active');
    } else {
      actualClass.remove('active');
    }

    document.removeEventListener('mouseup', onMouseup);

    textarea.focus();
  };

  document.addEventListener('mouseup', onMouseup);
});
const changLangBtn = document.querySelector('.changLangBtn');

changLangBtn.addEventListener('mousedown', () => {
  changLangBtn.classList.add('active');

  const onMouseup = () => {
    changLangBtn.classList.remove('active');

    lang = lang === 'en' ? 'ru' : 'en';
    changLangBtn.textContent = lang;
    renderKeyboard();

    document.removeEventListener('mouseup', onMouseup);
  };
  document.addEventListener('mouseup', onMouseup);
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lang', lang);
});
