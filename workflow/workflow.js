const fs = require('fs')
// eslint-disable-next-line import/no-extraneous-dependencies
const yaml = require('js-yaml')
const path = require('path')

const features = require('../src/features/featureKeys.json')

const DIR_NAME = './src'
let WORKFLOWS = {}

// eslint-disable-next-line consistent-return
const validateWorkflow = (key, workflow) => {
  const propNames = ['name', 'steps']
  let err
  propNames.forEach(name => {
    if (workflow[name] === null || workflow[name] === undefined) {
      err = new Error(`Missing required codec property: ${name}`)
    }
  })

  workflow.steps.forEach(step => {
    if (!(step.name in features)) {
      err = new Error(`Not Valid Feature: ${step.name}`)
    }
  })

  if (err) return err

  // if (workflow.steps.length < 2) return new Error('Workflows require minimum two steps');

  if (WORKFLOWS[key])
    return new Error(`Codec type for: (${key}) already exists`)
}

const init = () => {
  const errs = []
  fs.readdirSync(path.join(__dirname, DIR_NAME))
    .filter(
      file =>
        file.slice(file.length - 4) === '.yml' &&
        file !== path.basename(__filename)
    )
    .map(file => [
      file.slice(0, -4).replace('.', '').replace(' ', '_').toUpperCase(),
      yaml.safeLoad(fs.readFileSync(path.join(__dirname, DIR_NAME, file)))
    ])
    .forEach(e => {
      // console.log(e);
      e[1].steps = e[1].steps.map(step => {
        if (!(typeof step === 'object')) {
          return { name: step.toUpperCase() }
        }
        console.log('Step', step)
        const stepName = step.name.toUpperCase()
        const configuration = { ...step }
        if (step.steps) {
          const objectSteps = step.steps.map(s => ({ name: s.toUpperCase() }))
          Object.assign(configuration, { steps: objectSteps })
        }
        return { configuration, name: stepName }
      })
      const err = validateWorkflow(...e)
      if (err) {
        errs.push(err)
      } else {
        const [name, obj] = e
        if (!obj.ui) {
          obj.ui = null
        }
        if (!obj.child) {
          obj.child = null
        }
        WORKFLOWS[name] = obj
      }
    })

  if (errs.length !== 0)
    throw new Error(`Error(s) occurred while parsing: ${errs.join(', ')}`)
}

const deleteWorkflow = () => {
  WORKFLOWS = {}
}

// const features = getFeatures();
init()

const fileData = `
import features from "../features/features"

export type WorkflowStep = {
  name : keyof typeof features,
  configuration? : {steps? : Array<WorkflowStep>, [name:string] : any}
}

export type WorkflowElement = { 
  name: string;
  description: string;
  ui: JSX.Element | string | null;
  child?: any;
  steps: Array<WorkflowStep>;
};

export type WorkflowType = {
 [name:string] : WorkflowElement
};

 const workflows : WorkflowType = ${JSON.stringify(
   WORKFLOWS
 )}; export default workflows;`

fs.writeFileSync(path.join(__dirname, '../src/dist/workflow.ts'), fileData)

module.exports = {
  init,
  deleteWorkflow,
  validateWorkflow,
  WORKFLOWS
}
