const fs = require("fs");
const path = require("path");
var exports = module.exports;
const codecs = require("../codecs/codecs").codecsTypes;

const DIR_NAME = "../formats";
const FORMAT_TYPES = {};

const init = (CODEC_TYPES) => {
  const errs = [];
  fs.readdirSync(path.join(__dirname, DIR_NAME))
    .filter(
      (file) =>
        file.slice(file.length - 3) === ".js" &&
        file !== path.basename(__filename)
    )
    .map((file) => [
      file
        .slice(0, -3)
        .replace("-", "")
        .replace(".", "")
        .replace(" ", "_")
        .toUpperCase(),
      require(path.join(__dirname, DIR_NAME, file))(CODEC_TYPES),
    ])
    .forEach((e) => {
      const err = validateFormat(...e);
      if (err) {
        errs.push(err);
      } else {
        FORMAT_TYPES[e[0]] = e[1];
      }
    });

  if (errs.length !== 0)
    throw new Error(`Error(s) occurred while parsing: ${errs.join(", ")}`);

  return FORMAT_TYPES;
};

const validateFormat = (key, format) => {
  const propNames = ["name", "extension", "display", "codecs"];
  let err;
  propNames.forEach((name) => {
    if (format[name] === null || format[name] === undefined)
      err = new Error(`Missing required format property: ${name}`);
  });

  if (err) return err;

  if (format.extension.charAt(0) !== ".") return new Error("Invalid extension");
  if (format.display !== true && format.display !== false)
    return new Error("Invalid value for display");
  if (format.codecs.includes(undefined)) return new Error("Invalid codec");

  if (FORMAT_TYPES[key])
    return new Error(`Format type for: (${key}) already exists`);
};

init(codecs);

const fileData = `const formats = ${JSON.stringify(
  FORMAT_TYPES
)}; export default formats`;

fs.writeFileSync(path.join(__dirname, "./dist.ts"), fileData);

module.exports = FORMAT_TYPES;
