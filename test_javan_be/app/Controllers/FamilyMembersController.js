import { Crud } from '@averoa/utilities';

class FamilyMembersController {
  async create(req, res) {
    const data = await Crud.create('FamilyMembers', req);
    res.send(data);
  }

  async findAll(req, res) {
    const data = await Crud.findAll('FamilyMembers', req);
    res.send(data);
  }

  async findOne(req, res) {
    const data = await Crud.findOne('FamilyMembers', req, { relations: '[parent,family_assets]' });
    res.send(data);
  }

  async update(req, res) {
    const data = await Crud.update('FamilyMembers', req);
    res.send(data);
  }

  async delete(req, res) {
    const data = await Crud.delete('FamilyMembers', req);
    res.send(data);
  }
}

export default new FamilyMembersController;
