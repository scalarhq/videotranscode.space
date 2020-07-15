
import { Terminal } from "./terminal.js";
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react"
import { action } from "mobx"

import "./terminal.css"

type TerminalProps = {
  terminalText: string
  clearTerminal: boolean
  loaded: boolean
  updateTerminalText: (value: string) => void
  updateClearTerminal: (value: boolean) => void
}


class TerminalMutator {
  @action("Terminal Text Mutator")
  handleNewMessage = function (t1: any, message: string, noflag?: boolean) {
    if (message) {
      // terminalMessage = message;
      console.log("HandleNewMessage", t1, message);
      t1.print(`${noflag ? "" : "$"} ${message}`);
      let terminalEmulator = document.getElementById("terminalEmulator");
      if (terminalEmulator) {
        terminalEmulator.scrollTop = terminalEmulator.scrollHeight;
      }
    }
  };
  @action("Terminal Special Mutator")
  addSpecialMessage = function (message: string) {
    let terminalEmulator = document.getElementById("terminalEmulator");
    if (terminalEmulator) {
      let mainDiv = terminalEmulator.childNodes[0];
      let pTag = mainDiv.childNodes[0];
      let newDiv = document.createElement("div");
      newDiv.innerHTML = message;
      pTag.appendChild(newDiv);
    }
  };
}

// const handleNewMessage = function (t1: any, message: string, noflag?: boolean) {
//   if (message) {
//     // terminalMessage = message;
//     console.log("HandleNewMessage", t1, message);
//     t1.print(`${noflag ? "" : "$"} ${message}`);
//     let terminalEmulator = document.getElementById("terminalEmulator");
//     if (terminalEmulator) {
//       terminalEmulator.scrollTop = terminalEmulator.scrollHeight;
//     }
//   }
// };


// const addSpecialMessage = function (message: string) {
//   let terminalEmulator = document.getElementById("terminalEmulator");
//   if (terminalEmulator) {
//     let mainDiv = terminalEmulator.childNodes[0];
//     let pTag = mainDiv.childNodes[0];
//     let newDiv = document.createElement("div");
//     newDiv.innerHTML = message;
//     pTag.appendChild(newDiv);
//   }
// };



const TerminalComponent: React.FC<TerminalProps> = ({ terminalText, clearTerminal, loaded, updateTerminalText, updateClearTerminal }) => {
  let t1 = new Terminal("terminal");

  let newTerminal = function (oldTerminal: typeof t1) {
    return {
      ...oldTerminal,
      print: function (text: any) {
        console.log("Terminal Emulator Printing", text);
        oldTerminal.print(text);
      }
    }
  }
  t1 = newTerminal(t1)

  const { handleNewMessage, addSpecialMessage } = new TerminalMutator()
  //@ts-ignore
  window.t1 = t1;
  const previous: { text: string, clear: boolean } = { text: "", clear: false };

  useEffect(() => {



    // if (!ready) {



    t1.setBackgroundColor("#272C31");
    t1.setTextColor("#3FBD7");
    t1.blinkingCursor(true);
    t1.html.style.fontFamily = "Ubuntu Mono";
    t1.html.id = "terminalEmulator";
    t1.html.style.overflow = "auto";
    t1.html.className = "terminal-emulator"
    // t1.html.style = {
    //   flex: "0 1 auto", border: "1px solid #4A5063", borderRadius: "5px", height: "35vh", textAlign: "left", fontFamily: "Ubuntu Mono", overflow: "auto", width: "60vh", display: "flex", fontSize: "16px", backgroundColor: "#272C31", color: "#3FBD71"
    // }

    let terminalDiv = document.getElementById("terminal");
    if (terminalDiv) {
      terminalDiv.appendChild(t1.html);
    } else {
      console.error("Terminal Not Found")
    }
    t1.clear();
    handleNewMessage(t1, "Hello, I am a Video Transcoder!", true);
    handleNewMessage(t1,
      "But I am slightly different than other online video tools, because I don't upload your files anywhere.",
      true
    );
    handleNewMessage(t1,
      "Instead I protect your privacy by doing all the computation on your browser locally.",
      true
    );
    addSpecialMessage(
      `I do this by using the amazing new technology called <a style="color: #ff3e00" href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">web assembly</a>.`
    );
    // setReady(true)
    // }
  }, []);

  useEffect(() => {
    if (loaded) {
      handleNewMessage(t1, "Loaded FFmpeg!");
    }
  }, [loaded])

  useEffect(() => {
    console.log("IN USE EFFECT");


    if (terminalText) {
      console.log("Updating Terminal Text with", terminalText)
      handleNewMessage(t1, terminalText)
      // previous.text = terminalText
      updateTerminalText("")
    }
    if (clearTerminal) {
      console.log("Clearing Terminal")
      t1.clear()
      // previous.clear = clearTerminal
      updateClearTerminal(false)
    }
  }, [t1, addSpecialMessage, handleNewMessage, terminalText, clearTerminal, updateClearTerminal, updateTerminalText]);



  return (<div id="terminal" style={{ display: "flex", flex: "0 1", height: "100%" }} />
  )
}

export default observer(TerminalComponent)