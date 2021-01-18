import CluiStore from '@store/cluiStore'
import React from 'react'

const Clear = (props: any) => {
  React.useEffect(() => {
    if (props.item) {
      props.item.session.reset()
    }
    CluiStore.updateRun(false)

    window.scrollTo({ top: 0, left: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div />
}

const clearObject = {
  description: 'Clears screen',
  // eslint-disable-next-line react/display-name
  run: () => <Clear />
}

export default clearObject
