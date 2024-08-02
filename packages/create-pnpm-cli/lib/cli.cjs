"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/cli.ts
var cli_exports = {};
__export(cli_exports, {
  cli: () => cli
});
module.exports = __toCommonJS(cli_exports);

// package.json
var version = "0.0.4";

// src/constants.ts
var import_path = __toESM(require("path"), 1);
var ROOT_PATH = import_path.default.join(__dirname, "..");
var TEMPLATE_PATH = import_path.default.join(ROOT_PATH, "template");
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
var import_process = require("process");
function handleError(err, message) {
  console.log(message + "\uFF1A", err);
  (0, import_process.exit)(1);
}

// src/cli.ts
var import_prompts = require("@inquirer/prompts");
var import_commander = require("commander");
var import_fast_glob = __toESM(require("fast-glob"), 1);
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_package_manager_install = __toESM(require("package-manager-install"), 1);
var import_path2 = __toESM(require("path"), 1);
var cli = import_commander.program;
cli.name("create-pnpm-cli").version(version);
cli.command("create", { isDefault: true }).description("create pnpm cli").argument("[path]", "path to mkdir", "./").action(async (targetPath) => {
  const names = await (0, import_fast_glob.default)(`**`, {
    deep: 1,
    cwd: TEMPLATE_PATH,
    onlyFiles: false
  });
  const template = await (0, import_prompts.select)({
    message: "\u8BF7\u9009\u62E9\u6A21\u677F",
    choices: names.map((item) => ({ name: item, value: item }))
  });
  const name = await (0, import_prompts.input)({
    message: "\u8BF7\u8F93\u5165\u5305\u540D",
    default: template
  });
  const target = import_path2.default.join(targetPath, name);
  await import_fs_extra.default.ensureDir(target).catch((err) => handleError(err, "\u6587\u4EF6\u5939\u4E0D\u5B58\u5728"));
  await import_fs_extra.default.copy(import_path2.default.join(TEMPLATE_PATH, template), target).catch((err) => handleError(err, "\u62F7\u8D1D\u6587\u4EF6\u9519\u8BEF"));
  await (0, import_package_manager_install.default)({ cwd: target });
});
cli.parse();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cli
});
