
import { initializeModels } from "./src/models/index.js";
import { initializeAPIs } from "./src/apis/index.js";
import { initializeSwagger } from "./src/apis/swagger.js";


const app = await (async () => {
  
  const models = await initializeModels();
  const app = initializeAPIs({ models });
  initializeSwagger({ app });
  
  return app;
})();

const PORT = 3000;



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





