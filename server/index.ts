const express = require("express");
const { createServer } = require("vite");
const helmet = require("helmet");


(async () => {
  const app = express();

  if(process.env.NODE_ENV === "development") {
    const vite = await createServer({
      server: { 
          middlewareMode: true,
        },
        root: "../client",
        base: "/"
    });

    app.use(vite.middlewares);
  } else {
     app.use(helmet(), express.static('../client/dist'));
  }

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
})();