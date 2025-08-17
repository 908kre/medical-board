import { App } from "@md/core-api/app";

export default {
  command: "start",
  description: "start core api server",
  handler: async () => {
    const app = App();
    app.listen({
      port: 80,
      host: "0.0.0.0",
    });
  },
};
