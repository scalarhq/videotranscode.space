import { useEffect } from 'react';

const useEventListener = (target: any, type: any, listener: Function, ...options: any) => {
  useEffect(() => {
    const targetIsRef = Object.prototype.hasOwnProperty.call(target, 'current');
    const currentTarget = targetIsRef ? target.current : target;
    if (currentTarget) {
      currentTarget.addEventListener(type, listener, ...options);
    }
    return () => {
      if (currentTarget) {
        currentTarget.removeEventListener(type, listener, ...options);
      }
    };
  }, [target, type, listener, options]);
};

export default useEventListener;
