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
cli.command("create", { isDefault: true }).description("create pnpm cli").argument("[path]", "path to mkdir", "./").action(async (targetPath) => {
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
  const target = path3.join(targetPath, name);
  await fse.ensureDir(target).catch((err) => handleError(err, "\u6587\u4EF6\u5939\u4E0D\u5B58\u5728"));
  await fse.copy(path3.join(TEMPLATE_PATH, template), target).catch((err) => handleError(err, "\u62F7\u8D1D\u6587\u4EF6\u9519\u8BEF"));
  await packageManagerInstall({ cwd: target });
});
cli.parse();
export {
  cli
};
