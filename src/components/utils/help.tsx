import { faHandsHelping, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentStore from '@store/componentStore'
import keyboardStore from '@store/keyboardStore'
import styles from '@styles/help.module.css'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { Fade } from 'react-reveal'

const keyboardShorcuts = [
  { key: 'alt+p', action: 'Set configuration' },
  { key: 'Shift+F', action: 'Open File Menu' },
  { key: 'Cntrl+Enter/Shift+Enter', action: 'Start processing' },
  { key: 'Alt+c', action: 'Toggle Advanced Mode' },
  { key: 'W/▲', action: 'Move up' },
  { key: 'S/▼', action: 'Move down' },
  { key: 'Shift+/', action: 'Keyboard shortcuts' }
]

const HelpSvg = ({ width }: { width: string }) => (
  <svg
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    fill="rgba(255,255,255,0.6)"
    viewBox="0 0 24 24">
    <path d="M11.29,15.29a1.58,1.58,0,0,0-.12.15.76.76,0,0,0-.09.18.64.64,0,0,0-.06.18,1.36,1.36,0,0,0,0,.2.84.84,0,0,0,.08.38.9.9,0,0,0,.54.54.94.94,0,0,0,.76,0,.9.9,0,0,0,.54-.54A1,1,0,0,0,13,16a1,1,0,0,0-.29-.71A1,1,0,0,0,11.29,15.29ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,7A3,3,0,0,0,9.4,8.5a1,1,0,1,0,1.73,1A1,1,0,0,1,12,9a1,1,0,0,1,0,2,1,1,0,0,0-1,1v1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,12,7Z" />
  </svg>
)

const HoverGuide = ({ close }: { close: () => void }) => (
  <div className="fixed top-0 left-0  w-screen h-full" onClick={() => close()}>
    <div className="flex w-full h-full items-start justify-center">
      <div className="w-3/4 h-full items-start p-20 flex justify-center">
        <div
          className={
            'flex flex-col items-center rounded-lg p-4 leading-normal w-1/2 bg-indigo-900'
          }
          id="keyboard-shortcuts-tour"
          onClick={e => {
            e.stopPropagation()
          }}>
          <div className="flex flex-col w-3/4">
            <div className="text-white text-center font-bold text-xl mb-2">
              <FontAwesomeIcon icon={faKeyboard} /> Keyboard shortcuts
            </div>
            {keyboardShorcuts.map(({ key, action }) => {
              return (
                <div key={key} className="flex flex-row py-1">
                  <p className="w-1/2 uppercase text-center text-gray-50">
                    {key}
                  </p>
                  <p className="w-1/2 capitalize text-center text-gray-50">
                    {action}
                  </p>
                </div>
              )
            })}
            <div className="text-white text-center font-bold text-xl mb-2">
              <FontAwesomeIcon icon={faHandsHelping} /> Need help?
            </div>
            <p className="text-gray-50 text-center">
              Reach out to{' '}
              <a
                className="text-default font-semibold"
                href="mailto:support@modfy.video">
                support@modfy.video
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const HelpUtl = () => {
  const [clicked, setClicked] = useState(false)

  const { CluiStore } = ComponentStore

  const { isSubmitted } = CluiStore

  const keyMap = {
    HELP: ['shift+/'],
    EXIT: ['esc']
  }
  const handlers = {
    HELP: (e?: KeyboardEvent) => {
      e?.preventDefault()
      setClicked(c => !c)
    },
    EXIT: () => {
      setClicked(false)
    }
  }

  useEffect(() => {
    keyboardStore.showShortcuts = () => {
      setClicked(c => !c)
    }
    return () => {
      keyboardStore.showShortcuts = null
    }
  }, [])

  if (!isSubmitted) {
    return (
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <div className="fixed top-0 z-10 left-0">
          <div className="fixed xl:top-2 xl:left-2  bottom-3 left-3">
            <div
              className={styles.hoverable}
              onClick={() => {
                setClicked(c => !c)
              }}>
              <HelpSvg width="2.5rem" />
            </div>
          </div>
          <Fade when={clicked} collapse>
            <HoverGuide
              close={() => {
                setClicked(false)
              }}
            />
          </Fade>
        </div>
      </GlobalHotKeys>
    )
  }
  return <div />
}
export default observer(HelpUtl)
