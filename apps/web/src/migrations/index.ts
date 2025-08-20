import * as migration_20250310_042530_initial from './20250310_042530_initial';
import * as migration_20250820_184941 from './20250820_184941';

export const migrations = [
  {
    up: migration_20250310_042530_initial.up,
    down: migration_20250310_042530_initial.down,
    name: '20250310_042530_initial',
  },
  {
    up: migration_20250820_184941.up,
    down: migration_20250820_184941.down,
    name: '20250820_184941'
  },
];
