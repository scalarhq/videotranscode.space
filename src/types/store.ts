import ComponentStore from '@store/componentStore'

export type ComponentStoreType = typeof ComponentStore

export type ConfigType = { [name: string]: { value: any; [name: string]: any } }
