import cluiStore from '@store/cluiStore'
import { toJS } from 'mobx'

type Output = {
  key: string
  value: any
  [name: string]: any
}

type useExistingSettingsType = (props: {
  main: string[]
  child?: string[]
  other?: [string[]]
  defaults: {
    main: Output
    child?: Output
    other?: Output[]
  }
}) => { main: Output; child?: Output; other?: Output[] }

const getObject = (
  arr: string[],
  defaultObject: {
    [name: string]: {
      [name: string]: any
      value: any
    }
  }
): Output | false => {
  let currentObj = Object.assign({}, defaultObject)
  for (const [index, key] of arr.entries()) {
    if (index === arr.length - 1 && key in currentObj) {
      return { ...currentObj[key], key, value: currentObj[key].value }
    } else {
      if (!(key in currentObj)) {
        break
      }

      currentObj = currentObj[key]
    }
  }
  return false
}

const useExistingSettings: useExistingSettingsType = ({
  main,
  child,
  other,
  defaults
}) => {
  const { configuration } = cluiStore

  const jsConifg = toJS(configuration)
  if (Object.keys(jsConifg).length > 0) {
    const mainOutput = getObject(main, jsConifg)
    const output = { main: mainOutput || defaults.main }
    if (child) {
      const childOutput = getObject(child, jsConifg)

      Object.assign(output, { child: childOutput || defaults.child })
    }
    if (other) {
      const otherOutputs: Output[] = []
      let noFalse = true
      for (const value of other) {
        const otherObj = getObject(value, jsConifg)
        if (otherObj) {
          otherOutputs.push(otherObj)
        } else {
          noFalse = false
          break
        }
      }
      Object.assign(output, { other: noFalse ? otherOutputs : defaults.other })
    }
    return output
  } else {
    return defaults
  }
}

export default useExistingSettings
