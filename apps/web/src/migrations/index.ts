import * as migration_20250310_042530_initial from './20250310_042530_initial';

export const migrations = [
  {
    up: migration_20250310_042530_initial.up,
    down: migration_20250310_042530_initial.down,
    name: '20250310_042530_initial'
  },
];
