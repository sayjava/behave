import server from "../server";

// Load config and expectations
server({
  debugLevel: "verbose",
  expectations: [],
}).start();
