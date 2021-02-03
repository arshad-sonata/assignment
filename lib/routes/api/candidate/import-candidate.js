/**
 * Import Data
 */

module.exports = (service) => {

  return (req, res, next) => {
  	service.importData(req.body, (err, data) => {
      if (err) return next(err);

      res.send(data);
    });
  };
};
