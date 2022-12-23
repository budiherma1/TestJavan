import { FamilyMembers } from '@averoa/models';
import family_details from '../files/family_details.js';

export const seed = async function (knex) {
  await knex(FamilyMembers.tableName).del();

  const data = family_details.map(({
    id, name, gender, parent_id,
  }, i) => ({
    id, name, gender, parent_id,
	  }));
  await knex(FamilyMembers.tableName).insert(data);
};
