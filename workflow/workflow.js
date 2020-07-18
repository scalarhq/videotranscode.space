const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const yaml = require('js-yaml');
const path = require('path');

// const features = require('')

const getFeatures = () => {
  const featuresFile = fs.readFileSync(path.join(__dirname, '../features/features.ts'), 'utf-8');
  let start = featuresFile.indexOf('const FEATURES');
  let featuresObject = featuresFile.slice(start);
  const end = featuresObject.indexOf('};');
  featuresObject = featuresObject.slice(0, end + 1);
  start = featuresObject.indexOf('{');
  featuresObject = featuresObject.slice(start);
  let lineByLine = featuresObject.split('\n').slice(1, -1);
  lineByLine = lineByLine.map((line) => {
    const splitByColon = line.split(':');
    const newLine = `"${splitByColon[0].replace(/ /g, '')}":"${splitByColon[1]
      .slice(0, -1)
      .replace(/ /g, '')}",`;

    return newLine;
  });

  lineByLine[lineByLine.length - 1] = lineByLine[lineByLine.length - 1].slice(0, -1);
  lineByLine.push('}');
  lineByLine = ['{'].concat(lineByLine);
  lineByLine = lineByLine.join('\n');

  const featuresJSON = JSON.parse(lineByLine);
  return featuresJSON;
};

const DIR_NAME = './src';
let WORKFLOWS = {};

// eslint-disable-next-line consistent-return
const validateWorkflow = (key, workflow, features) => {
  const propNames = ['name', 'steps'];
  let err;
  propNames.forEach((name) => {
    if (workflow[name] === null || workflow[name] === undefined)
      err = new Error(`Missing required codec property: ${name}`);
  });

  workflow.steps.forEach((step) => {
    if (!(step in features)) {
      err = new Error(`Not Valid Feature: ${step}`);
    }
  });

  if (err) return err;

  if (workflow.steps.length < 2) return new Error('Workflows require minimum two steps');

  if (WORKFLOWS[key]) return new Error(`Codec type for: (${key}) already exists`);
};

const init = (features) => {
  const errs = [];
  fs.readdirSync(path.join(__dirname, DIR_NAME))
    .filter((file) => file.slice(file.length - 4) === '.yml' && file !== path.basename(__filename))
    .map((file) => [
      file.slice(0, -4).replace('.', '').replace(' ', '_').toUpperCase(),
      yaml.safeLoad(fs.readFileSync(path.join(__dirname, DIR_NAME, file))),
    ])
    .forEach((e) => {
      e[1].steps = e[1].steps.map((step) => step.toUpperCase());
      const err = validateWorkflow(...e, features);
      if (err) {
        errs.push(err);
      } else {
        const [name, obj] = e;
        // obj.steps = obj.
        WORKFLOWS[name] = obj;
      }
    });

  if (errs.length !== 0) throw new Error(`Error(s) occurred while parsing: ${errs.join(', ')}`);
};

const deleteWorkflow = () => {
  WORKFLOWS = {};
};

const features = getFeatures();
init(features);

const fileData = `const workflows = ${JSON.stringify(WORKFLOWS)}; export default workflows;`;

fs.writeFileSync(path.join(__dirname, './workflow.ts'), fileData);

module.exports = {
  init,
  deleteWorkflow,
  validateWorkflow,
  codecsTypes: WORKFLOWS,
};
