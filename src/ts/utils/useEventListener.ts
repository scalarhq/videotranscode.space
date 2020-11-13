import { useEffect } from 'react'

const useEventListener = (
  ref: any,
  type: any,
  listener: Function,
  ...options: any
) => {
  const cur = ref.current
  useEffect(() => {
    // console.info('Use Event Listener', ref, ref.current);
    if (cur) {
      cur.addEventListener(type, listener, ...options)
    }
    return () => {
      if (cur) {
        cur.removeEventListener(type, listener, ...options)
      }
    }
    // eslint-disable-next-line
  }, [ref, ref.current, type, listener, options])
}

export default useEventListener
