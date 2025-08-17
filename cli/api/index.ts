import start from "./start";

export default {
  command: "core-api",
  description: "Manage core API",
  aliases: ["c"],
  builder: (yargs) => {
    yargs.command(start);
    yargs.strict().demandCommand();
    return yargs;
  },
  handler: () => {},
};
