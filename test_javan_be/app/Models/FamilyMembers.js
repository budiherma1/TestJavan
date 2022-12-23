import { Model } from '@averoa/utilities';
import FamilyAssets from './FamilyAssets.js';

class FamilyMembers extends Model {
  static tableName = 'family_members';

  static timestamp = true;

  static column = {
    id: {
      migration: (m) => m.table.increments(m.column).primary(),
      flag: { required: false },
    },
    name: {
      migration: (m) => m.table.string(m.column, 50).notNullable(),
      seed: (f) => f.name.firstName(),
      flag: { required: true },
      validation: [{ run: (v) => v.value !== '', msg: 'field name required' }],
    },
    gender: {
      migration: (m) => m.table.smallint(m.column).nullable(),
      seed: (f) => f.datatype.number({ min: 1, max: 2 }),
      validation: [{ run: (v) => v.value == 1 || v.value == 2, msg: 'value should be 1 or 2 (1: man, 2: women)' }, { run: (v) => v.value !== '', msg: 'field gender required' }],
      flag: { required: true },
    },
    parent_id: {
      migration: (m) => m.table.integer(m.column, 50).nullable(),
      seed: (f) => f.datatype.number({ min: 1, max: 20 }),
      flag: { required: false },
    },
  };

  static relationMappings = () => ({
    parent: {
      relation: Model.HasOneRelation,
      modelClass: FamilyMembers,
      join: {
        from: 'family_members.parent_id',
        to: 'family_members.id',
      },
    },
    family_assets: {
      relation: Model.HasManyRelation,
      modelClass: FamilyAssets,
      join: {
        from: 'family_members.id',
        to: 'family_assets.family_member_id',
      },
    },
  });
}

export default FamilyMembers;
