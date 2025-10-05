import packageJson from './package.json' assert { type: 'json' };
import { AuthSystem } from './packages/sequelize-rest-framework/src/index.js';

import { initializeModels } from "./src/models/index.js";
import { initializeAPIs } from "./src/apis/index.js";
import { initializeSwagger } from "./src/apis/swagger.js";
import { initializeMigrations } from './src/models/migrations/index.js';

const app = await (async () => {

  console.log(packageJson)
  const { models, sequelize } = await initializeModels();
  await initializeMigrations({ models });

  // Initialize AuthSystem from library
  const authSystem = new AuthSystem(sequelize, {
    modelPrefix: 'EB',
    tablePrefix: 'eb_',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  });
  authSystem.initialize();

  const app = await initializeAPIs({ models, authSystem });
  initializeSwagger({ app, models, packageJson });

  return app;
})();

const PORT = 3000;

app.listen(PORT, (e) => {
  console.log(`Server is running on http://localhost:${PORT}`, e);
});




