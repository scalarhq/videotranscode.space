const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const yaml = require('js-yaml');

// const { exports } = module;
const codecs = require('../codecs/codecs').codecsTypes;

const DIR_NAME = './src';
const FORMAT_TYPES = {};

const validateFormat = (key, format) => {
  const propNames = ['name', 'extension', 'display', 'codecs'];
  let err;
  propNames.forEach((name) => {
    if (format[name] === null || format[name] === undefined)
      err = new Error(`Missing required format property: ${name}`);
  });

  if (err) return err;

  if (format.extension.charAt(0) !== '.') return new Error('Invalid extension');
  if (format.display !== true && format.display !== false)
    return new Error('Invalid value for display');
  if (format.codecs.includes(undefined)) return new Error('Invalid codec');

  if (FORMAT_TYPES[key]) return new Error(`Format type for: (${key}) already exists`);
};

const init = (CODEC_TYPES) => {
  const errs = [];
  fs.readdirSync(path.join(__dirname, DIR_NAME))
    .filter((file) => file.slice(file.length - 4) === '.yml' && file !== path.basename(__filename))
    .map((file) => [
      file.slice(0, -4).replace('-', '').replace('.', '').replace(' ', '_').toUpperCase(),
      yaml.safeLoad(fs.readFileSync(path.join(__dirname, DIR_NAME, file))),
    ])
    .forEach((e) => {
      console.log(e);

      e[1].defaultCodec = codecs[e[1].defaultCodec];
      e[1].codecs = e[1].codecs.map((key) => codecs[key]);
      console.log(e);
      const err = validateFormat(...e);
      if (err) {
        errs.push(err);
      } else {
        const [name, obj] = e;
        FORMAT_TYPES[name] = obj;
      }
    });

  if (errs.length !== 0) throw new Error(`Error(s) occurred while parsing: ${errs.join(', ')}`);

  return FORMAT_TYPES;
};

init(codecs);

const fileData = `const formats = ${JSON.stringify(FORMAT_TYPES)}; export default formats`;

fs.writeFileSync(path.join(__dirname, '../src/dist/formats.ts'), fileData);

module.exports = FORMAT_TYPES;
