
import { Terminal } from "./terminal.js";
import React, { useEffect } from "react"
import { observer } from "mobx-react"
import componentStore from "../../store/componentStore"


import "./terminal.css"





const TerminalComponent: React.FC = () => {
	const terminalRef = React.useRef<null | HTMLDivElement>(null);
	const { updateTerminalText, loaded } = componentStore

	useEffect(() => {
		// mount


		let t1 = new Terminal("terminal");
		t1.setBackgroundColor("#272C31");
		t1.setTextColor("#3FBD7");
		t1.blinkingCursor(true);
		t1.html.style.fontFamily = "Ubuntu Mono";
		t1.html.id = "terminalEmulator";
		t1.html.style.overflow = "auto";
		t1.html.className = "terminal-emulator"
		componentStore.t1 = t1
		let terminalEmulator = document.getElementById("terminalEmulator");
		componentStore.terminalEmulator = terminalEmulator

		let el = terminalRef.current;
		if (el) {
			el.appendChild(t1.html);
		}

		t1.clear();
		updateTerminalText("Hello, I am a Video Transcoder!", true);
		updateTerminalText(
			"But I am slightly different than other online video tools, because I don't upload your files anywhere.",
			true
		);
		updateTerminalText(
			"Instead I protect your privacy by doing all the computation on your browser locally.",
			true
		);
		addSpecialMessage(
			`I do this by using the amazing new technology called <a style="color: #ff3e00" href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">web assembly</a>.`
		);

		return () => {
			delete componentStore.t1;
			delete componentStore.terminalEmulator;
			delete componentStore.updateTerminalText;

			// unmount
		}
	}, [])

	const addSpecialMessage = (message: string) => {
		let terminalEmulator = document.getElementById("terminalEmulator");
		if (terminalEmulator) {
			let mainDiv = terminalEmulator.childNodes[0];
			let pTag = mainDiv.childNodes[0];
			let newDiv = document.createElement("div");
			newDiv.innerHTML = message;
			pTag.appendChild(newDiv);
		}
	};


	useEffect(() => {
		if (loaded) {
			updateTerminalText("Loaded FFmpeg!");
		}
	}, [loaded])




	return (
		<>
			<div id="terminal" ref={terminalRef} style={{ display: "flex", flex: "0 1", height: "100%" }} />
		</>
	)
}

export default observer(TerminalComponent)