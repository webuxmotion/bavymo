import { useEffect, useState } from "react";

interface MidiKey {
  note: number;
  pressed: boolean;
}

const MidiTest = () => {
  const [keys, setKeys] = useState<MidiKey[]>(
    Array.from({ length: 96 - 36 + 1 }, (_, i) => ({
      note: 36 + i,
      pressed: false,
    }))
  );

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      console.log("Web MIDI API not supported in this browser.");
      return;
    }

    navigator.requestMIDIAccess().then(
      (midiAccess: MIDIAccess) => {
        // ✅ Use native types
        midiAccess.inputs.forEach((input: MIDIInput) => {
          input.onmidimessage = handleMIDIMessage;
        });
      },
      () => console.log("Could not access your MIDI devices.")
    );

    function handleMIDIMessage(message: MIDIMessageEvent) {
      if (!message.data) return; // ← guard against null

      const [command, note, velocity] = message.data;

      if (command === 144 && velocity > 0) {
        setKeys((prev) =>
          prev.map((k) => (k.note === note ? { ...k, pressed: true } : k))
        );
      } else if (command === 128 || (command === 144 && velocity === 0)) {
        setKeys((prev) =>
          prev.map((k) => (k.note === note ? { ...k, pressed: false } : k))
        );
      }
    }
  }, []);

  const isBlackKey = (note: number) => [1, 3, 6, 8, 10].includes(note % 12);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">
        Press a key on your Yamaha synth 🎹
      </h2>

      <div className="relative flex">
        {keys
          .filter((k) => !isBlackKey(k.note))
          .map((key) => {
            const mod = key.note % 12;
            return (
              <div
                key={key.note}
                className={`relative w-12 h-48 border border-black ${key.pressed ? "bg-blue-300" : "bg-white"
                  }`}
              >
                {[0, 2, 5, 7, 9].includes(mod) && (
                  <div
                    className={`absolute top-0 left-8 w-8 h-32 border border-black z-10 ${keys.find((k) => k.note === key.note + 1)?.pressed
                        ? "bg-blue-600"
                        : "bg-black"
                      }`}
                  ></div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MidiTest;