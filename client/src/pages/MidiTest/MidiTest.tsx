import { useEffect } from "react";

function MidiTest() {
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log("Web MIDI API not supported in this browser.");
    }

    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
      console.log("MIDI ready!");

      for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
      }
    }

    function onMIDIFailure() {
      console.log("Could not access your MIDI devices.");
    }

    function handleMIDIMessage(message: WebMidi.MIDIMessageEvent) {
        
      const [command, note, velocity] = message.data;

      if (command === 144 && velocity > 0) {
        console.log(message.data);
        // Note ON
        console.log(`Key pressed: ${note}, velocity: ${velocity}`);
      } else if (command === 128 || (command === 144 && velocity === 0)) {
        // Note OFF
        console.log(`Key released: ${note}`);
      }
    }
  }, []);

  return <h2>Press a key on your Yamaha synth 🎹 and check the console!</h2>;
}

export default MidiTest;