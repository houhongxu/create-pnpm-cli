// ../../node_modules/.pnpm/tsup@8.2.3_typescript@5.5.4/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// package.json
var version = "0.0.2";

// src/constants.ts
import path2 from "path";
var ROOT_PATH = path2.join(__dirname, "..");
var TEMPLATE_PATH = path2.join(ROOT_PATH, "template");
var PACKAGE_CHOICES = [
  "prettier" /* prettier */
].map((item) => ({ name: item, value: item }));
var PACKAGE_MAP = {
  ["prettier" /* prettier */]: {
    packages: ["prettier", "@trivago/prettier-plugin-sort-imports"],
    options: ["--save-dev"]
  }
};

// src/utils.ts
import { exit } from "process";
function handleError(err, message) {
  console.log(message + "\uFF1A", err);
  exit(1);
}

// src/cli.ts
import { input, select } from "@inquirer/prompts";
import { program } from "commander";
import glob from "fast-glob";
import fse from "fs-extra";
import packageManagerInstall from "package-manager-install";
import path3 from "path";
var cli = program;
cli.name("create-pnpm-cli").version(version);
cli.command("create", { isDefault: true }).description("create pnpm cli").action(async () => {
  const names = await glob(`**`, {
    deep: 1,
    cwd: TEMPLATE_PATH,
    onlyFiles: false
  });
  const template = await select({
    message: "\u8BF7\u9009\u62E9\u6A21\u677F",
    choices: names.map((item) => ({ name: item, value: item }))
  });
  const name = await input({
    message: "\u8BF7\u8F93\u5165\u5305\u540D",
    default: template
  });
  fse.mkdir(name).catch((err) => handleError(err, "\u521B\u5EFA\u6587\u4EF6\u5939\u9519\u8BEF"));
  fse.copy(path3.join(TEMPLATE_PATH, template), name).catch((err) => handleError(err, "\u62F7\u8D1D\u6587\u4EF6\u9519\u8BEF"));
  packageManagerInstall({ cwd: name });
});
cli.parse();
export {
  cli
};
