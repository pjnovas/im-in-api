
const bedwetter = {
  model: 'event'
};

export default [{
  path: '/events', // TODO: change this route to "my-events"
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
    auth: 'simple',
    handler: {
      bedwetter
    }
  }
}, {
  path: '/events/{id}',
  method: ['PATCH', 'POST'],
  config: {
    auth: 'simple',
    handler: {
      bedwetter
    }
  }
}, {
  path: '/events/{id}',
  method: 'DELETE',
  config: {
    auth: 'simple',
    handler: {
      bedwetter
    }
  }
}];
