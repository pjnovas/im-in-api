
const bedwetter = {
  model: 'event'
};

export default [{
  path: '/events',
  method: 'GET',
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/events/{id}',
  method: 'GET',
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/events',
  method: 'POST',
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/events/{id}',
  method: ['PATCH', 'POST'],
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/events/{id}',
  method: 'DELETE',
  config: {
    handler: {
      bedwetter
    }
  }
}];
