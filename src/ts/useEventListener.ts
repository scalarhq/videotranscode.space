import { useEffect } from 'react';

const useEventListener = (ref: any, type: any, listener: Function, ...options: any) => {
  useEffect(() => {
    // console.info('Use Event Listener', ref, ref.current);
    if (ref?.current) {
      ref.current.addEventListener(type, listener, ...options);
    }
    return () => {
      if (ref?.current) {
        ref.current.removeEventListener(type, listener, ...options);
      }
    };
    // eslint-disable-next-line
  }, [ref, ref.current, type, listener, options]);
};

export default useEventListener;
