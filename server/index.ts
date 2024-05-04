const express = require("express");
const { createServer } = require("vite");
const helmet = require("helmet");
const cors = require("cors");


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
  app.use(cors());
  app.listen(process.env.PORT || 3000);
})();