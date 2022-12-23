import { Crud } from '@averoa/utilities';

class UsersController {
  async create(req, res) {
    const data = await Crud.create('Users', req);
    res.send(data);
  }

  async findAll(req, res) {
    const data = await Crud.findAll('Users', req);
    res.send(data);
  }

  async findOne(req, res) {
    const data = await Crud.findOne('Users', req);
    res.send(data);
  }

  async update(req, res) {
    const data = await Crud.update('Users', req);
    res.send(data);
  }

  async delete(req, res) {
    const data = await Crud.delete('Users', req);
    res.send(data);
  }
}

export default new UsersController;
