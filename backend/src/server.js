import app, { init } from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 4000;

init().then(() => {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
});
