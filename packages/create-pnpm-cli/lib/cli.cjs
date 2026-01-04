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
var version = "0.0.11";

// src/constants.ts
var import_path = __toESM(require("path"), 1);
var ROOT_PATH = import_path.default.join(__dirname, "..", "..", "..");
var TEMPLATE_PATH = import_path.default.join(ROOT_PATH, "template");
var TEMPLATE_REPO_URL = "https://github.com/houhongxu/create-pnpm-cli";
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
var import_child_process = require("child_process");
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_os = __toESM(require("os"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_process = require("process");
function handleError(err, message) {
  console.log(message + "\uFF1A", err);
  (0, import_process.exit)(1);
}
function getTempDir() {
  return import_path2.default.join(import_os.default.tmpdir(), "repositories");
}
function cloneRepository(repoUrl, targetPath) {
  const gitRepoUrl = repoUrl.endsWith(".git") ? repoUrl : `${repoUrl}.git`;
  (0, import_child_process.execSync)(
    `git clone --depth 1 --branch main "${gitRepoUrl}" "${targetPath}"`,
    {
      stdio: "inherit"
    }
  );
}
async function fetchTemplateFromRepo(repoUrl, templateName) {
  const tempDir = getTempDir();
  const [gitRepoUrl] = repoUrl.split("#");
  const repoTempPath = import_path2.default.join(
    tempDir,
    gitRepoUrl.split("/").pop()?.replace(".git", "") || "unknown"
  );
  const templateTempPath = import_path2.default.join(repoTempPath, "templates", templateName);
  await import_fs_extra.default.ensureDir(tempDir);
  if (await import_fs_extra.default.pathExists(repoTempPath)) {
    await import_fs_extra.default.remove(repoTempPath);
  }
  try {
    cloneRepository(gitRepoUrl, repoTempPath);
    if (!await import_fs_extra.default.pathExists(templateTempPath)) {
      throw new Error(
        `\u6A21\u677F\u76EE\u5F55\u4E0D\u5B58\u5728: templates/${templateName}\uFF0C\u8BF7\u68C0\u67E5\u4ED3\u5E93\u4E2D\u662F\u5426\u5B58\u5728\u8BE5\u6A21\u677F`
      );
    }
    return templateTempPath;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`\u4ECE\u4ED3\u5E93\u62C9\u53D6\u6A21\u677F\u5931\u8D25: ${repoUrl}\u3002\u9519\u8BEF\u4FE1\u606F: ${errorMessage}`);
  }
}

// src/cli.ts
var import_prompts = require("@inquirer/prompts");
var import_commander = require("commander");
var import_fast_glob = __toESM(require("fast-glob"), 1);
var import_fs_extra2 = __toESM(require("fs-extra"), 1);
var import_package_manager_install = __toESM(require("package-manager-install"), 1);
var import_path3 = __toESM(require("path"), 1);
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
  console.log("\u6B63\u5728\u4ECE\u4ED3\u5E93\u62C9\u53D6\u6A21\u677F...");
  let templateTempPath;
  try {
    templateTempPath = await fetchTemplateFromRepo(
      TEMPLATE_REPO_URL,
      template
    );
  } catch (err) {
    handleError(err, "\u62C9\u53D6\u6A21\u677F\u5931\u8D25");
    return;
  }
  const target = import_path3.default.join(targetPath, name);
  await import_fs_extra2.default.ensureDir(target).catch((err) => handleError(err, "\u521B\u5EFA\u6587\u4EF6\u5939\u5931\u8D25"));
  console.log("\u6B63\u5728\u62F7\u8D1D\u6587\u4EF6...");
  await import_fs_extra2.default.copy(templateTempPath, target).catch((err) => handleError(err, "\u62F7\u8D1D\u6587\u4EF6\u9519\u8BEF"));
  await (0, import_package_manager_install.default)({ cwd: target });
});
cli.parse();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cli
});
