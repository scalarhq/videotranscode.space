const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const yaml = require('js-yaml');
const path = require('path');

const DIR_NAME = './src';
let CODEC_TYPES = {};

// eslint-disable-next-line consistent-return
const validateCodec = (key, codec) => {
  const propNames = ['name', 'compressionRange', 'ffmpegLib'];
  let err;
  propNames.forEach((name) => {
    if (codec[name] === null || codec[name] === undefined)
      err = new Error(`Missing required codec property: ${name}`);
  });

  if (err) return err;

  if (!codec.compressionRange.min || !codec.compressionRange.max)
    return new Error('Invalid compression range');

  if (CODEC_TYPES[key]) return new Error(`Codec type for: (${key}) already exists`);
};

const init = () => {
  const errs = [];
  fs.readdirSync(path.join(__dirname, DIR_NAME))
    .filter((file) => file.slice(file.length - 4) === '.yml' && file !== path.basename(__filename))
    .map((file) => [
      file.slice(0, -4).replace('-', '').replace('.', '').replace(' ', '_').toUpperCase(),
      yaml.safeLoad(fs.readFileSync(path.join(__dirname, DIR_NAME, file))),
    ])
    .forEach((e) => {
      const err = validateCodec(...e);
      if (err) {
        errs.push(err);
      } else {
        const [name, obj] = e;
        CODEC_TYPES[name] = obj;
      }
    });

  if (errs.length !== 0) throw new Error(`Error(s) occurred while parsing: ${errs.join(', ')}`);
};

const deleteCodecTypes = () => {
  CODEC_TYPES = {};
};

init();

const fileData = `const codecs = ${JSON.stringify(CODEC_TYPES)}; export default codecs;`;

fs.writeFileSync(path.join(__dirname, '../src/dist/codecs.ts'), fileData);

module.exports = {
  init,
  deleteCodecTypes,
  validateCodec,
  codecsTypes: CODEC_TYPES,
};
