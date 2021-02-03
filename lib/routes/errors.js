/**
 * Default errors.
 */


exports.notfound = (req, res) => {
  res.status(404).send({ message: 'Resource not found' });
};

exports.error = (err, req, res, next) => {
  console.log(err.stack);

  res.status(500).send({ message: 'Internal Server Error' });
};
