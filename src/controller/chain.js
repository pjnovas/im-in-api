import Series from 'hapi-next';

export default function(funcs, req, rep) {
  return (new Series(funcs)).execute(req, rep);
}
