class SessionJwtValidationMiddleware {
  handle(req, res, next) {
    if (req.session.token) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

export default new SessionJwtValidationMiddleware;
