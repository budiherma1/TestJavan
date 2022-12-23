import multer from 'multer';

class UploadFilesMiddleware {
  handle(req, res, next) {
    const upload = multer();
    upload.any()(req, res, next);
  }
}

export default new UploadFilesMiddleware;
