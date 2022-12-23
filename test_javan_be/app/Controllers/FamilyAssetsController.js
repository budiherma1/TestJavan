import { Crud } from '@averoa/utilities';

class FamilyAssetsController {
  async create(req, res) {
    const data = await Crud.create('FamilyAssets', req);
    res.send(data);
  }

  async findAll(req, res) {
    const data = await Crud.findAll('FamilyAssets', req);
    res.send(data);
  }

  async findOne(req, res) {
    const data = await Crud.findOne('FamilyAssets', req);
    res.send(data);
  }

  async update(req, res) {
    const data = await Crud.update('FamilyAssets', req);
    res.send(data);
  }

  async delete(req, res) {
    const data = await Crud.delete('FamilyAssets', req);
    res.send(data);
  }
}

export default new FamilyAssetsController;
