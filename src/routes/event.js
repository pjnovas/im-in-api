
import {
  getMine,
  getOne,
  create,
  update,
  remove
} from '../controller/events';

export default [
  { method: 'GET', path: '/events', config: getMine },
  { method: 'GET', path: '/events/{sid}', config: getOne},
  { method: 'POST', path: '/events', config: create },
  { method: ['PATCH', 'PUT'], path: '/events/{sid}', config: update },
  { method: 'DELETE', path: '/events/{sid}', config: remove }

  //{ method: 'POST', path: '/events/{id}/attendants', config: join } // JOIN
  //{ method: 'DELETE', path: '/events/{id}/attendants', config: leave } // LEAVE
];
