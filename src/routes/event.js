
import {
  getMine,
  getOne,
  create,
  update,
  remove,
  join,
  leave,
  getCategories
} from '../controller/events';

export default [
  { method: 'GET', path: '/events', config: getMine },
  { method: 'GET', path: '/events/{sid}', config: getOne},
  { method: 'POST', path: '/events', config: create },
  { method: ['PATCH', 'PUT'], path: '/events/{sid}', config: update },
  { method: 'DELETE', path: '/events/{sid}', config: remove },
  { method: 'POST', path: '/events/{sid}/attendants', config: join },
  { method: 'DELETE', path: '/events/{sid}/attendants', config: leave },
  { method: 'GET', path: '/events/categories', config: getCategories }
];
