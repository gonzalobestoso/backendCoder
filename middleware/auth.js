const checkAdmin = (req, res, next) => {
    if (!isAdmin) {
      return res.status(403).send({ error: "Acceso no autorizado" });
    } else {
      return next();
    }
  };

  module.exports = checkAdmin;