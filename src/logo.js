import american from './assets/images/american-express.png';
import visa from './assets/images/visa.png';
import diners from './assets/images/diners-club.png';
import discover from './assets/images/discover.png';
import jcb from './assets/images/jcb.png';
import maestro from './assets/images/maestro.png';
import master from './assets/images/master-card.png';
import mir from './assets/images/mir.png';
import unionpay from './assets/images/unionpay.png';
import def from './assets/images/logo.png';

export default function defineLogo(value) {
  let logo;

  switch (value) {
    case 'american-express':
      logo = american;
      break;
    case 'visa':
      logo = visa;
      break;
    case 'diners-club':
      logo = diners;
      break;
    case 'discover':
      logo = discover;
      break;
    case 'jcb':
      logo = jcb;
      break;
    case 'maestro':
      logo = maestro;
      break;
    case 'master-card':
      logo = master;
      break;
    case 'mira':
      logo = mir;
      break;
    case 'unionpay':
      logo = unionpay;
      break;
    default:
      logo = def;
      break;
  }

  return logo;
}
