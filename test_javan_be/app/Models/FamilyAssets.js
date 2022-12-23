import { Model } from '@averoa/utilities';
import FamilyMembers from './FamilyMembers.js';

class FamilyAssets extends Model {
  static tableName = 'family_assets';

  static timestamp = true;

  static column = {
    id: {
      migration: (m) => m.table.increments(m.column).primary(),
      flag: { required: false },
    },
    family_member_id: {
      migration: (m) => m.table.integer(m.column, 50).nullable(),
      seed: (f) => f.datatype.number({ min: 1, max: 20 }),
    },
    asset_name: {
      migration: (m) => m.table.string(m.column, 50).nullable(),
      seed: (f) => f.name.firstName(),
    },
  };

  static relationMappings = () => ({
    family_members: {
      relation: Model.BelongsToOneRelation,
      modelClass: FamilyMembers,
      join: {
        from: 'family_assets.family_member_id',
        to: 'family_members.id',
      },
    },
  });
}

export default FamilyAssets;
