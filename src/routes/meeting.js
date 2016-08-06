
const bedwetter = {
  model: 'meeting'
};

export default [{
  path: '/meetings',
  method: 'GET',
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/meetings/{id}',
  method: 'GET',
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/meetings',
  method: 'POST',
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/meetings/{id}',
  method: ['PATCH', 'POST'],
  config: {
    handler: {
      bedwetter
    }
  }
}, {
  path: '/meetings/{id}',
  method: 'DELETE',
  config: {
    handler: {
      bedwetter
    }
  }
}];
