import React, { useEffect, useRef, useState } from 'react';
import Tone from 'tone';

const SYNE_IS_LISTENING = 'Syne is listening...';

const Welcome = ({ username, currentUsers }) => {
  const [syneText, setSyneText] = useState(SYNE_IS_LISTENING);
  const [noteRegister, setNoteRegister] = useState(1);

  const naturalNotes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const flatNotes = naturalNotes.map(note => note + ' flat');
  const sharpNotes = naturalNotes.map(note => note + ' sharp');
  const notes = naturalNotes.concat(flatNotes, sharpNotes).sort();
  
  const flatToSharp = {};
  naturalNotes.forEach((note, i) => {
    const key = note + ' flat';
    const value = (i === 0)
      ? 'g#'
      : naturalNotes[i-1] + '#';
    flatToSharp[key] = value;
  });

  const grammar = 'grammar notes; public <note> = ' + notes.join(' | ') + ' ;'
  const speechRecognitionList = new window.webkitSpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);

  const recognition = new window.webkitSpeechRecognition();
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

  const ref = useRef();
  const synth = new Tone.Synth().toMaster();

  const handleClick = () => {
    if (syneText === SYNE_IS_LISTENING) {
      recognition.stop();
      setSyneText('Say another command');
    } else {
      setSyneText(SYNE_IS_LISTENING);
    }
  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  useEffect(() => {
    recognition.onresult = (e) => {
      const note = e.results[0][0].transcript;

      ref.current.textContent =
        'Received input: ' + note + '. \n Click to speak again.';

      const randomIdx = getRandomInt(7);
      let noteToPlay = naturalNotes[randomIdx];

      if (notes.includes(note.toLowerCase())) {
        noteToPlay = note;

        if (note.split(' ').length !== 1) {
          const noteParts = note.split(' ');
          noteToPlay =
            noteParts[1] === 'sharp'
              ? noteParts[0] + '#'
              : flatToSharp[note.toLowerCase()];
        }
      } else {
        ref.current.style.backgroundColor = note;
      }

      console.log(noteToPlay + noteRegister);
      synth.triggerAttackRelease(noteToPlay + noteRegister, '10');
      console.log(synth);

      console.log('Confidence: ' + e.results[0][0].confidence);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onnomatch = (e) => {
      ref.current.textContent = "Syne didn't recognize that note.";
    };

    recognition.onerror = (e) => {
      ref.current.textContent = 'Error occurred in recognition: ' + e.error;
    };
  }, [
    recognition,
    syneText,
    flatToSharp,
    naturalNotes,
    noteRegister,
    notes,
    synth,
  ]);
  
  const changeNoteRegister = (e) => setNoteRegister(e.target.value);
  const users = currentUsers.filter((user) => user.username !== username);

  return (
    <div id="welcome" onClick={handleClick}>
      <h2>Welcome, {username}!</h2>
      <h3 id="wave">Click to begin waving.</h3>
      <div className="current-users">
        <h4>You are currently waving sines with...</h4>
        {users.map(({ id, username }, i) => {
          let name = username;

          if (users.length === 2 && i === 1) {
            name = ` and ${username}.`;
          } else if (i !== 0) {
            i < users.length - 1
              ? (name = `, ${username}`)
              : (name = `, and ${username}.`);
          }

          return <span key={id}>{name}</span>;
        })}
      </div>
      <h3>Low or High</h3>
      <h4>Current selected note register: {noteRegister}</h4>
      <input
        type="range"
        min="1"
        max="7"
        value={noteRegister}
        onChange={changeNoteRegister}
      />

      {syneText}
      <div ref={ref} id="syne"></div>
    </div>
  );
}

export default Welcome;
