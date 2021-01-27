import ComponentStore from '@store/componentStore'
import { observer, useObserver } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import ReactToolTip from 'react-tooltip'

/**
 * Basic Submit button that tells store that configuration is locked
 */
const Submit = observer(
  ({
    customText,
    customStyling
  }: {
    customText?: string
    customStyling?: string
  }) => {
    const { CluiStore, FileStore, loaded } = ComponentStore

    const { setSubmitStatus } = CluiStore

    const { allFiles } = FileStore

    const submit = React.useRef<HTMLButtonElement | null>(null)

    const [disabledTip, setTip] = useState(
      'Please wait while FFmpeg loads in the background, the entire process can take up to 30 seconds'
    )

    const handleSubmit = () => {
      setSubmitStatus(true)
    }

    useEffect(() => {
      if (loaded && allFiles.length === 0) {
        setTip('Please Add A File!')
      }
      if (loaded && allFiles.length > 0) {
        setTip('')
        if (submit && submit.current) {
          submit.current.removeAttribute('data-tip')
          submit.current.removeAttribute('data-for')
        }
      }
      // eslint-disable-next-line
    }, [loaded, allFiles, submit, submit.current])

    return useObserver(() => (
      <>
        <button
          className={`${
            customStyling || 'text-white font-bold py-2 px-4 mb-12 rounded'
          } ${
            !loaded || allFiles.length === 0
              ? 'bg-gray-500 '
              : 'bg-indigo-500 hover:bg-indigo-600'
          } `}
          data-tip
          data-for="tooltip"
          ref={submit}
          type="submit"
          onClick={handleSubmit}
          disabled={!loaded || allFiles.length === 0}>
          {customText || 'Submit'}
        </button>

        <ReactToolTip id="tooltip" place="bottom" effect="solid" type="dark">
          {disabledTip}
        </ReactToolTip>
      </>
    ))
  }
)

export default Submit
