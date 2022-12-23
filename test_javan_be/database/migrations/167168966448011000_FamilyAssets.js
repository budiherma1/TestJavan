import { FamilyAssets } from '@averoa/models';

export const up = FamilyAssets.migrationUp.bind(FamilyAssets);
export const down = FamilyAssets.migrationDown.bind(FamilyAssets);
