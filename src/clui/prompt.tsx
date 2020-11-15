/* eslint-disable indent */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useCallback, useEffect, useRef } from 'react'
import classnames from 'classnames'
import Downshift from 'downshift'
import PromptIcon from './promptIcon'
import MatchSubString from './subString'
import useCluiInput from './useCluiInput'
import ComponentStore from '../store/componentStore'
import { observer } from 'mobx-react'

const { CluiStore } = ComponentStore
const { setInputMessage } = CluiStore

type MenuItemProps = {
  item: any
  highlighted: any
  theme?: any
}

type PromptProps = {
  command?: {
    commands: {
      [name: string]: any
    }
  }
  item?: any
  value?: any
  autoRun?: boolean
  autoFocus?: boolean
  theme?: any
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
  const { item, highlighted } = props

  return (
    <div className={classnames('root', { highlighted })}>
      <div className="value">
        {item.searchValue ? (
          <MatchSubString source={item.value} match={item.searchValue} />
        ) : (
          item.value
        )}
      </div>
      {item.data && item.data.description ? (
        <div className="description">{item.data.description}</div>
      ) : null}
    </div>
  )
}

const Prompt: React.FC<PromptProps> = (props: PromptProps) => {
  // @ts-ignore
  const input = useRef<HTMLInputElement | null>(null)

  // console.log(input)
  const ran = useRef(false)
  const [focused, setFocused] = useState(false)

  const { command } = props as {
    command: { commands: { [name: string]: any } }
  }

  const { cluiFocused, setCluiFocused } = CluiStore

  useEffect(() => {
    setCluiFocused(focused)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused])

  useEffect(() => {
    if (CluiStore.ran) {
      return
    }
    if (cluiFocused) {
      if (input && input.current) {
        input.current.focus()
      }
    }
  }, [cluiFocused])

  const [state, update] = useCluiInput({
    command,
    value: props.value || '',
    index: props.value ? props.value.length : 0
  }) // like useState but for clui stuff

  const onKeyUp = useCallback(e => update({ index: e.target.selectionStart }), [
    update
  ])

  const run = useCallback(() => {
    if (!props.item || !state.run) {
      return
    }

    ran.current = true

    if (input.current) {
      const { value } = input.current
      if (value !== 'Clear') {
        setInputMessage(value)
      }
      input.current.blur()
    }

    props.item
      .insertAfter(state.run(), <Prompt {...props} autoRun={false} value="" />)
      .next()
  }, [props, state])

  useEffect(() => {
    if (ran.current) {
      return
    }

    if (props.autoRun && state.run) {
      run()
    }
  }, [props.autoRun, state.run, run])

  useEffect(() => {
    console.info('Prompt autofocus', props.autoFocus)
    if (input.current && props.autoFocus) {
      const { value } = input.current
      input.current.focus()
      input.current.selectionStart = value.length
    }
    // eslint-disable-next-line
  }, [props.autoFocus, input.current])

  const isLastSession =
    props.item && props.item.index === props.item.session.currentIndex

  return (
    <Downshift
      defaultHighlightedIndex={0}
      initialHighlightedIndex={0}
      inputValue={state.value}
      onChange={option => {
        if (!option) {
          return
        }

        update({
          value: `${option.inputValue} `,
          index: option.cursorTarget + 1
        })
      }}
      itemToString={() => state.value}>
      {ds => {
        const inputProps = ds.getInputProps({
          autoFocus: true,
          spellCheck: false,
          autoComplete: 'on',
          id: 'clui-input',
          placeholder: 'Set your configuration here... (? for help)',
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          onKeyUp,
          onChange: ({ currentTarget }: { currentTarget: any }) => {
            update({
              value: currentTarget.value,
              index: currentTarget.selectionStart || 0
            })
          },
          onKeyDown: (event: any) => {
            if (event.key === 'Enter') {
              if (state.run) {
                run()
                return
              }

              if (ds.highlightedIndex !== undefined) {
                ds.selectHighlightedItem()
              }
            }

            if (event.key === 'ArrowUp' && ds.highlightedIndex === 0) {
              // eslint-disable-next-line no-param-reassign
              event.nativeEvent.preventDownshiftDefault = true
              event.preventDefault()
              ds.setState({ highlightedIndex: null })
            }
          }
        })

        return (
          <div
            className={classnames('prompt', {
              active: isLastSession || focused
            })}>
            <PromptIcon />
            <div className="input">
              {(isLastSession || focused) && state.run ? (
                <div className="input-shadow">
                  <span>{state.value}</span>
                  <button type="button" onClick={run}>
                    run ↵
                  </button>
                </div>
              ) : null}
              <input
                className="clui-input"
                style={{ wordWrap: 'break-word' }}
                ref={input}
                {...inputProps}
              />
              {focused ? (
                <div className="menu-anchor">
                  <div className="menu">
                    <div className="menu-offset">
                      {state.value.slice(0, state.nodeStart || 0)}
                    </div>
                    <ul {...ds.getMenuProps()}>
                      {state.options.map((item: any, index: any) => (
                        <li
                          {...ds.getItemProps({ item })}
                          key={item.value}
                          className={classnames('item', {
                            active: ds.highlightedIndex === index
                          })}>
                          <MenuItem
                            item={item}
                            highlighted={ds.highlightedIndex === index}
                            theme={props.theme}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )
      }}
    </Downshift>
  )
}

export default observer(Prompt)
