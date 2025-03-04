
import { initializeModels } from "./src/models/index.js";

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'tmp/sqlite/database.sqlite'
// });



(async () => {

    await initializeModels();

})();






