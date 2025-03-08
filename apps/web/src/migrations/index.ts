import * as migration_20250308_021006_initial from './20250308_021006_initial';

export const migrations = [
  {
    up: migration_20250308_021006_initial.up,
    down: migration_20250308_021006_initial.down,
    name: '20250308_021006_initial'
  },
];
