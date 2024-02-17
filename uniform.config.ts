import type { CLIConfiguration } from '@uniformdev/cli';

const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      aggregate: {},
      // IMPORTANT: disabled assets since there is a LOT to pull down
      // asset: {},
      category: {},
      composition: { publish: true },
      contentType: {},
      component: {},
      dataType: {},
      enrichment: {},
      entry: { publish: true },
      locale: {},
      pattern: { publish: true },
      projectMapDefinition: {},
      projectMapNode: {},
      quirk: {},
      redirect: {},
      signal: {},
      test: {},
    },
    directory: './content',
    format: 'yaml',
  },
};

module.exports = config;
