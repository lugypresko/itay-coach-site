import * as migration_20260607_205054 from './20260607_205054';
import * as migration_20260616_183918_add_factory_storage from './20260616_183918_add_factory_storage';
import * as migration_20260617_150154_add_problem_pages from './20260617_150154_add_problem_pages';
import * as migration_20260713_073552_task071_publication_governance_source_fields from './20260713_073552_task071_publication_governance_source_fields';
import * as migration_20260713_091235_task073_reader_facing_page_artifacts from './20260713_091235_task073_reader_facing_page_artifacts';

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
    name: '20260617_150154_add_problem_pages',
  },
  {
    up: migration_20260713_073552_task071_publication_governance_source_fields.up,
    down: migration_20260713_073552_task071_publication_governance_source_fields.down,
    name: '20260713_073552_task071_publication_governance_source_fields',
  },
  {
    up: migration_20260713_091235_task073_reader_facing_page_artifacts.up,
    down: migration_20260713_091235_task073_reader_facing_page_artifacts.down,
    name: '20260713_091235_task073_reader_facing_page_artifacts'
  },
];
