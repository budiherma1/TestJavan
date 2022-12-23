import fs from 'fs';
import path from 'path';

class UploadController {
  async upload(req, res) {
    const { files } = req;
    const { prefix = '', oldFile = [] } = req.body;
    const selection = await this.local(files, prefix, oldFile);
    res.send(selection);
  }

  async local(files, route, oldFiles) {
    const resData = {};
    const folder = path.join(path.resolve(), '/storages/upload/', route);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    for (const file of files) {
      const fileName = `${new Date().getTime()}${file.originalname}`;

      await fs.createWriteStream(path.join(folder, fileName)).write(file.buffer);
      resData[file.fieldname] = `${route}/${fileName}`;
    }

    if (oldFiles.length) {
      for (const oldFile of oldFiles) {
        fs.unlink(path.join(path.resolve(), '/storages/upload', oldFile), (err) => {
          if (err && err.code === 'ENOENT') {
            console.info("Error! File doesn't exist.");
          } else if (err) {
            console.error('Something went wrong. Please try again later.');
          } else {
            console.info('File successfully removed');
          }
        });
      }
    }
    return resData;
  }

  async awsS3(file, route, oldFile) {
    //
  }
}

export default new UploadController;
