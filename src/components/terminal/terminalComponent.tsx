/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-tabs */
/* eslint-disable indent */
import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Terminal } from './terminal'
import componentStore from '../../store/componentStore'

import './terminal.css'

const TerminalComponent: React.FC = () => {
  const terminalRef = React.useRef<null | HTMLDivElement>(null)
  const { terminalStore, loaded } = componentStore

  const updateTerminalText = terminalStore.updateTerminalText as (
    message: string,
    noflag?: boolean
  ) => void

  const addSpecialMessage = (message: string) => {
    const terminalEmulator = document.getElementById('terminalEmulator')
    if (terminalEmulator) {
      const mainDiv = terminalEmulator.childNodes[0]
      const pTag = mainDiv.childNodes[0]
      const newDiv = document.createElement('div')
      newDiv.innerHTML = message
      pTag.appendChild(newDiv)
    }
  }

  useEffect(() => {
    // mount

    const t1 = new Terminal('terminal')
    t1.setBackgroundColor('rgb(39, 44, 49, 0.6)')
    t1.setTextColor('#3FBD7')
    t1.blinkingCursor(true)
    t1.html.style.fontFamily = 'Ubuntu Mono'
    t1.html.id = 'terminalEmulator'
    t1.html.style.overflow = 'auto'
    t1.html.className = 'terminal-emulator'
    componentStore.terminalStore.t1 = t1

    const el = terminalRef.current
    if (el) {
      el.appendChild(t1.html)
    }
    const terminalEmulator = document.getElementById('terminalEmulator')
    componentStore.terminalStore.terminalEmulator = terminalEmulator
    t1.clear()
    updateTerminalText('Hello, I am a Video Transcoder!', true)
    updateTerminalText(
      "But I am slightly different than other online video tools, because I don't upload your files anywhere.",
      true
    )
    updateTerminalText(
      'Instead I protect your privacy by doing all the computation on your browser locally.',
      true
    )
    addSpecialMessage(
      'I do this by using the amazing new technology called <a style="color: #ff3e00" href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">web assembly</a>.'
    )

    return () => {
      // Void Expression
      // eslint-disable-next-line no-unused-expressions
      document.getElementById('terminalEmulator')?.remove()
      delete componentStore.terminalStore.t1
      componentStore.terminalStore.terminalEmulator = null
      componentStore.terminalStore.updateTerminalText = null

      // unmount
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (loaded) {
      updateTerminalText('Loaded FFmpeg!')
    }
  }, [loaded, updateTerminalText])

  return (
    <>
      <div
        id="terminal"
        ref={terminalRef}
        style={{ display: 'flex', flex: '0 1', height: '100%' }}
      />
    </>
  )
}

export default observer(TerminalComponent)
