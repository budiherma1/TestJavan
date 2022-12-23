import { FamilyAssets } from '@averoa/models';
import family_details from '../files/family_details.js';

export const seed = async function (knex) {
  await knex(FamilyAssets.tableName).del();

  const data = [];
  for (const detail of family_details) {
    if (detail.assets.length > 0) {
      for (const asset of detail.assets) {
        data.push({ family_member_id: detail.id, asset_name: asset });
      }
    }
  }
  await knex(FamilyAssets.tableName).insert(data);
};
