import { useReducer, useCallback, useRef } from 'react';
import inputState from '@replit/clui-input';

type OptionsType = {
  value: string;
  index: number;
  command: {
    commands: any;
  };
};

type UpdateType = { index?: number | undefined; value?: string | undefined };

type InputType = React.MutableRefObject<null | {
  current: (updates: UpdateType) => void;
}>;

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        ...action.updates,
      };
    default:
      return state;
  }
};

const useCluiInput = (options: OptionsType) => {
  const input: InputType = useRef(null);

  const [state, dispatch] = useReducer(reducer, {
    value: options.value || '',
    index: options.index || 0,
    options: [],
    loading: false,
    commands: [],
    exhausted: false,
  });

  if (!input.current) {
    Object.assign(input, {
      current: inputState({
        command: options.command,
        value: options.value,
        index: options.index,
        onUpdate: (updates) => {
          dispatch({ type: 'UPDATE', updates: { loading: false, ...updates } });
        },
      }),
    });
  }

  const update = useCallback(
    (updates: UpdateType) => {
      if (input.current) {
        const different: UpdateType = {};

        if (updates.value !== undefined && updates.value !== state.value) {
          different.value = updates.value;
        }

        if (updates.index !== undefined && updates.index !== state.index) {
          different.index = updates.index;
        }

        if (!Object.keys(different).length) {
          return;
        }
        // @ts-ignore
        input.current(different);
        dispatch({ type: 'UPDATE', updates: { loading: true, ...different } });
      }
    },
    [dispatch, state.value, state.index]
  );

  return [state, update];
};

export default useCluiInput;
