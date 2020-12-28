import { action, computed, observable } from 'mobx'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import AbstractStore from './store'

type UserData = {
  uuid: string
  count: number
  disabled?: { state: boolean; count: number }
  [name: string]: any
}

class UserStore extends AbstractStore {
  constructor() {
    super()
    this.init()
  }

  init = () => {
    const { usageData } = this
    if (usageData) {
      this.localUsageCounter = usageData
    }
  }

  @observable localUsageCounter: number = 0

  @observable disabled: boolean = false

  /**
   * Returns a string uuid from either local storage or creates and stores a new one.
   */
  @computed get uuid(): string {
    const user = window.localStorage.getItem('uuid')
    if (!user) {
      const uuid = v4()
      window.localStorage.setItem('uuid', uuid)
      return uuid
    }

    return user
  }

  /**
   * Retruns userData based on {@link UserData} as a string
   * If userData is not set or there is a uuid mismatch it will return null.
   */
  @computed get userData(): UserData | null {
    const userData = window.localStorage.getItem('userData')
    if (!userData) {
      return null
    }
    const jsonData = JSON.parse(userData) as UserData
    const { uuid } = jsonData
    if (uuid === this.uuid) {
      return jsonData
    }
    window.localStorage.removeItem('userData')
    return null
  }

  @computed get usageData(): number | null {
    const userData = this.userData
    if (!userData) {
      return null
    }
    return userData.count
  }

  @computed get isActiveUser(): boolean {
    const { userData, localUsageCounter } = this
    if (!userData) return false
    const { count, disabled } = userData
    const localCount = Math.max(count, localUsageCounter)
    if (disabled && disabled.state) {
      /**
       * Here we determine when to show the banner to a user who has disabled it.
       * There are two cases:
       *
       * 1. They completed between 2-9 more operations since last disabled
       * 2. There is random chance they get the banner based on how many operations they completed
       */
      return (
        localCount >= disabled.count + Math.max(Math.random() * 10, 2) ||
        Math.random() > Math.min(0.9, Math.max(disabled.count * 0.05, 0.5))
      )
    } else if (localCount >= 3) {
      return true
    }
    return false
  }

  /**
   * Updates userData in localStorage
   *
   * @param data an object of type {@Link UserData}
   *
   * Will not update data if uuid mismatch
   */
  @action setUserData = (data: UserData) => {
    if (data && data.uuid === this.uuid) {
      const stringData = JSON.stringify(data)
      window.localStorage.setItem('userData', stringData)
    }
  }

  @action setDisabled = () => {
    const { userData, localUsageCounter } = this
    if (!userData) {
      return
    }
    const newUserData: UserData = {
      ...userData,
      disabled: { state: true, count: localUsageCounter }
    }
    this.disabled = true
    this.setUserData(newUserData)
  }

  /**
   * Updates the count of userData
   *
   * @param newCount : number - optional number of count
   *
   * If newCount is not provided, the function will just increment the count
   */
  @action updateUsageCount = (newCount?: number) => {
    const userData = this.userData
    const increment = !newCount
    if (!userData) {
      const newUsageData = { uuid: this.uuid, count: newCount || 1 }
      this.setUserData(newUsageData)
      this.localUsageCounter = newCount || 1
      return
    } else {
      if (increment) {
        Object.assign(userData, { count: userData.count + 1 })
      } else {
        Object.assign(userData, { count: newCount as number })
      }
    }
    this.setUserData(userData as UserData)
    const { usageData } = this
    if (usageData) {
      this.localUsageCounter = usageData
    } else {
      this.localUsageCounter += 1
    }
  }
}
const defaultUserStore = new UserStore()

export default defaultUserStore

export const useActiveUsers = () => {
  const { isActiveUser, localUsageCounter, disabled } = defaultUserStore

  const [displayable, setDisplay] = useState(isActiveUser)

  useEffect(() => {
    if (localUsageCounter && localUsageCounter >= 3) {
      setDisplay(isActiveUser)
    }
  }, [localUsageCounter, isActiveUser])

  useEffect(() => {
    if (disabled === true) {
      setDisplay(false)
    }
  }, [disabled])

  return displayable
}
