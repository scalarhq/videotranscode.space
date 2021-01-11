import { observer, useObserver } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import ReactToolTip from 'react-tooltip'

import ComponentStore from '../store/componentStore'

/**
 * Basic Submit button that tells store that configuration is locked
 */
const Submit = observer(() => {
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
      if (submit && submit.current) {
        submit.current.removeAttribute('data-tooltip')
      }
    }
    // eslint-disable-next-line
  }, [loaded, allFiles, submit, submit.current])

  return useObserver(() => (
    <>
      <button
        className={`text-white font-bold py-2 px-4 mb-12 rounded ${
          !loaded || allFiles.length === 0 ? 'bg-gray-500 ' : 'bg-blue-500'
        } `}
        data-tip
        data-for="tooltip"
        ref={submit}
        type="submit"
        onClick={handleSubmit}
        disabled={!loaded || allFiles.length === 0}>
        Submit
      </button>
      <ReactToolTip id="tooltip" place="bottom" effect="solid" type="dark">
        {disabledTip}
      </ReactToolTip>
    </>
  ))
})

export default Submit
