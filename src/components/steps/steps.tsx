import {
  faClock,
  faCogs,
  faDownload,
  faFile
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentStore from '@store/componentStore'
import keyboardStore from '@store/keyboardStore'
import { useActiveUsers } from '@store/userStore'
import { observer } from 'mobx-react'
import Steps, { Step } from 'rc-steps'
import React, { useEffect, useState } from 'react'

type Status = 'wait' | 'finish' | 'error'

type Statuses = {
  file: Status
  settings: Status
  processing: Status
  download: Status
}

const defaultStatus: Statuses = {
  file: 'wait',
  settings: 'wait',
  processing: 'wait',
  download: 'wait'
}

const StepComponent = () => {
  const [current, setCurrent] = useState(0)

  const [statues, setStatues] = useState<Statuses>(defaultStatus)

  const { processed, globalReset, CluiStore, FileStore } = ComponentStore

  const { allFiles } = FileStore

  const { isSubmitted } = CluiStore

  const displayable = useActiveUsers()

  useEffect(() => {
    if (allFiles.length > 0) {
      setStatues(cur => ({ ...cur, file: 'finish' }))
      setCurrent(1)
    }
  }, [allFiles])

  useEffect(() => {
    if (globalReset) {
      setStatues(defaultStatus)
      setCurrent(0)
    }
  }, [globalReset])

  useEffect(() => {
    if (isSubmitted) {
      setStatues(cur => ({ ...cur, settings: 'finish' }))
      setCurrent(2)
    }
  }, [isSubmitted])

  useEffect(() => {
    if (processed) {
      setStatues(cur => ({ ...cur, processing: 'finish', download: 'finish' }))
      setCurrent(3)
    }
  }, [processed])
  if (!displayable) {
    return (
      <div className="step-wrapper">
        <Steps current={current}>
          <Step
            title="Add File"
            icon={<FontAwesomeIcon icon={faFile} />}
            status={statues.file}
            onClick={() => {
              ComponentStore.FileStore.openFileDrawer()
            }}
            className={isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}
          />
          <Step
            title="Choose Settings"
            icon={<FontAwesomeIcon icon={faCogs} />}
            status={statues.settings}
            onClick={() => {
              if (keyboardStore.toggleModal) {
                keyboardStore.toggleModal()
              }
            }}
            className={isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}
          />
          <Step
            title="Processing"
            icon={<FontAwesomeIcon icon={faClock} />}
            status={statues.processing}
            className="cursor-not-allowed"
          />
          <Step
            title="Download"
            icon={<FontAwesomeIcon icon={faDownload} />}
            status={statues.download}
            className="cursor-not-allowed"
          />
        </Steps>
        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
            .step-wrapper {
              color: #3fbd71 !important;
              padding-top: ${isSubmitted ? '15vh' : '2vh'};
              width: 80vw;
            }
          `}
        </style>
      </div>
    )
  } else {
    return null
  }
}
export default observer(StepComponent)
