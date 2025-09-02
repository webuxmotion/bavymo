import React, { useState } from "react";
import { Midi } from "@tonejs/midi";

interface Note {
  name: string;
  time: number;
  duration: number;
  velocity: number;
}

const MidiUploader: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const midi = new Midi(arrayBuffer);

    const allNotes: Note[] = [];
    midi.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        allNotes.push({
          name: note.name,
          time: note.time,
          duration: note.duration,
          velocity: note.velocity,
        });
      });
    });

    setNotes(allNotes);
    console.log(allNotes); // Logs all notes
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Upload MIDI file 🎵</h2>
      <input type="file" accept=".mid" onChange={handleFile} />
      <div className="mt-4">
        <h3>Notes:</h3>
        <ul>
          {notes.map((note, idx) => (
            <li key={idx}>
              {note.name} — time: {note.time.toFixed(2)}, duration: {note.duration.toFixed(2)}, velocity: {note.velocity.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MidiUploader;