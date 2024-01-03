require("dotenv").config();
const startApp = require("./boot/setup").startApp;

(async () => {
  try {
    await startApp();
  } catch (error) {
    console.log("Error in index.js => startApp");
    console.log(`Error: ${JSON.stringify(error, undefined, 2)}`);
    throw error;
  }
})();
