/* eslint-disable no-unused-expressions */
import {
  el, setChildren, setAttr, setStyle,
} from 'redom';
import Inputmask from 'inputmask';
import CardInfo from 'card-info';
import {
  isValid,
  isExpirationDateValid,
  isSecurityCodeValid,
  // getCreditCardNameByNumber,
} from 'creditcard.js';
import isEmail from 'validator/lib/isEmail';
import chipUrl from './assets/images/chip.png';
import logoUrl from './assets/images/logo.png';
import defineLogo from './logo';

function getImg(elem, url) {
  const img = el(elem);
  setAttr(img, {
    src: url,
    alt: 'image',
  });

  return img;
}

function maskInput(input) {
  const type = input.dataset.path;
  let im;

  switch (type) {
    case 'number':
      im = new Inputmask('9999 9999 9999 9999 9999', { placeholder: '' });
      break;
    case 'email':
      im = new Inputmask({ alias: 'email' });
      break;
    case 'date':
      im = new Inputmask('99/99', { placeholder: '*' });
      break;
    case 'code':
      im = new Inputmask('999', { placeholder: '*' });
      break;
    default:
      break;
  }

  im ? im.mask(input) : null;
}

function addLogo(value) {
  const elem = document.querySelector('.logo');
  elem.innerHTML = '';
  const image = getImg('img.image', defineLogo(value));
  elem.append(image);
}

function validateData(type, value) {
  let checkedValue = false;
  let typeCard;
  let target;
  let cardInfo;

  switch (type) {
    case 'number':
      checkedValue = isValid(value);
      cardInfo = new CardInfo(value);
      typeCard = cardInfo.brandAlias;
      addLogo(typeCard);
      break;
    case 'email':
      checkedValue = isEmail(value);
      break;
    case 'date':
      checkedValue = isExpirationDateValid(value.split('/')[0], value.split('/')[1]);
      break;
    case 'code':
      target = document.querySelector('[data-path=number]');
      checkedValue = isSecurityCodeValid(target.value, value);
      break;
    default:
      break;
  }
  return checkedValue;
}

function checkForm() {
  const inputs = document.querySelectorAll('.is-valid');
  const btn = document.querySelector('.btn');
  const result = inputs.length === 4;

  if (result) {
    btn.removeAttribute('disabled');
  } else {
    btn.setAttribute('disabled', 'true');
  }

  return result;
}

function createInput(type) {
  const input = el('input.form-control', { type: 'text', 'data-path': type });
  maskInput(input);

  input.addEventListener('blur', (e) => {
    input.classList.remove('is-valid');
    const { value } = e.currentTarget;

    if (value === '') return;

    const check = validateData(type, value);

    if (check) {
      const target = document.querySelector(`[data-target=${type}]`);
      target ? target.textContent = e.target.value : null;
      input.classList.add('is-valid');
    } else {
      input.classList.add('is-invalid');
    }
    checkForm();
  });

  input.addEventListener('click', () => {
    input.classList.remove('is-invalid');
    const target = document.querySelector('.paycard');
    type === 'code' ? target.classList.add('flip') : target.classList.remove('flip');
  });

  return input;
}

export default function createCard() {
  const wrapper = el('div.app__wrap');
  const title = el('h1.mb-3 app__title', 'Payment');
  const paycard = el('div.paycard app__item');
  const form = el('form.form app__item.');
  const types = ['number', 'email', 'date', 'code'];
  const inputs = types.map((type) => createInput(type));
  const logo = el('div.logo');
  setStyle(logo, { 'background-image': 'url(../assets/brands-logos/visa.png)' });

  setChildren(paycard,
    el('div.paycard__face paycard__face-front',
      el('div.paycard__wrap',
        el('div.paycard__top',
          getImg('img.image', chipUrl),
          getImg('img.image', logoUrl)),
        el('div',
          el('span.descr', 'номер карты'),
          el('p.paycard__number', { 'data-target': 'number' }, '####  ####  ####  ####')),
        el('div.paycard__content',
          el('div.content-wrap',
            el('span.descr', 'держатель карты'),
            el('span.paycard__name', { 'data-target': 'holder' }, 'FULL NAME')),
          el(
            'div.content-wrap',
            el('span.descr', 'срок'),
            el('span.paycard__date', { 'data-target': 'date' }, 'MM/YY'),
          )))),
    el('div.paycard__face paycard__face-back',
      el('div.paycard__band'),
      el('div.paycard__wrap',
        el('div.paycard__cvv',
          el('span.descr', 'CVV'),
          el('div.cvv-band',
            el('div.cvv-band__item cvv-band__signature'),
            el('div.cvv-band__item cvv-band__code cvv-code',
              el('span#cvv', { 'data-target': 'code' }, '***')))))));

  setChildren(form, { action: '#' },
    el('label.form__label',
      el('span.descr', 'номер карты'),
      inputs[0],
      logo),
    el('label.form__label form__label-half',
      el('span.descr', 'срок действия карты'),
      inputs[2]),
    el('label.form__label form__label-half',
      el('span.descr', 'CVV'),
      inputs[3]),
    el('label.form__label form__label-large',
      el('span.descr', 'email'),
      inputs[1]),
    el('button.btn btn-primary', { type: 'submit', disabled: 'true' }, 'Оплатить'));

  setChildren(wrapper, title, paycard, form);

  paycard.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('flip');
  });

  form.addEventListener('submit', (e) => { e.preventDefault(); });

  return wrapper;
}
