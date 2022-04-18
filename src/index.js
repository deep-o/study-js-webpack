import 'babel-polyfill';
// import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  el, setChildren,
} from 'redom';
import './styles/style.scss';

const app = el('div.app container pt-3');

const createCard = import('./card')
  .then(
    (res) => {
      const element = res.default();
      return element;
    },
  );

Promise.all([createCard])
  .then(([element]) => {
    setChildren(app, element);
    setChildren(window.document.body, app);
  });
