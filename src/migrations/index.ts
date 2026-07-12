import * as migration_20260607_205054 from './20260607_205054';
import * as migration_20260616_183918_add_factory_storage from './20260616_183918_add_factory_storage';
import * as migration_20260617_150154_add_problem_pages from './20260617_150154_add_problem_pages';

export const migrations = [
  {
    up: migration_20260607_205054.up,
    down: migration_20260607_205054.down,
    name: '20260607_205054',
  },
  {
    up: migration_20260616_183918_add_factory_storage.up,
    down: migration_20260616_183918_add_factory_storage.down,
    name: '20260616_183918_add_factory_storage',
  },
  {
    up: migration_20260617_150154_add_problem_pages.up,
    down: migration_20260617_150154_add_problem_pages.down,
    name: '20260617_150154_add_problem_pages'
  },
];
