import coreApi from "./api";
import yargs from "yargs";

yargs(process.argv.slice(2))
  .scriptName("mb")
  .command(coreApi)
  .strict()
  .help()
  .parse();
