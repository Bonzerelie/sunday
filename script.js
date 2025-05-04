document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('main-menu');
  const modeSelectScreen = document.getElementById('mode-select-screen');
  const gameScreen = document.getElementById('game-screen');
  const noteButtonsContainer = document.getElementById('note-buttons-container');
  const promptText = document.getElementById('prompt');
  const playRefBtn = document.getElementById('play-reference');
  const playScaleBtn = document.getElementById('play-scale');
  const replayNoteBtn = document.getElementById('replay-note');
  const nextBtn = document.getElementById('next-button');
  const resetScoreBtn = document.getElementById('reset-score');
  const backButton = document.getElementById('back-button');
  const backToScaleSelect = document.getElementById('back-to-scale-select');
  const displayNotesBtn = document.getElementById('display-notes');
  const displayDegreesBtn = document.getElementById('display-degrees');
  const scaleLabel = document.getElementById('scale-label');
  const octaveLabel = document.getElementById('octave-label');
  const correctCount = document.getElementById('correct-count');
  const incorrectCount = document.getElementById('incorrect-count');
  const totalCount = document.getElementById('total-count');
  const accuracyDisplay = document.getElementById('accuracy');
  const addNoteBtn = document.getElementById('add-note');
  const removeNoteBtn = document.getElementById('remove-note');
  const selectedScaleLabel = document.getElementById('selected-scale-label');

  let audio = new Audio();
  let correct = 0;
  let incorrect = 0;
  let isAnswered = false;
  let showDegrees = false;
  let currentMode = 8;
  let currentNotes = [];
  let currentNote = '';
  let currentScale = '';

  const scaleData = {
    "C": {
      noteMap: { "C": ['c4', 'c5'], "D": ['d4'], "E": ['e4'], "F": ['f4'], "G": ['g4'], "A": ['a4'], "B": ['b4'] },
      degreeMap: { "C": '1st', "D": '2nd', "E": '3rd', "F": '4th', "G": '5th', "A": '6th', "B": '7th' },
      noteOrder: ["C", "D", "E", "F", "G", "A", "B"],
      referenceNote: 'c4',
      scaleAudio: 'cmajorscale',
      label: 'C Major Scale (Ionian Mode)',
      octave: 'One Octave (Notes C4–C5)'
    },
    "G": {
      noteMap: { "G": ['g3', 'g4'], "A": ['a3'], "B": ['b3'], "C": ['c4'], "D": ['d4'], "E": ['e4'], "F#": ['f#4'] },
      degreeMap: { "G": '1st', "A": '2nd', "B": '3rd', "C": '4th', "D": '5th', "E": '6th', "F#": '7th' },
      noteOrder: ["G", "A", "B", "C", "D", "E", "F#"],
      referenceNote: 'g3',
      scaleAudio: 'gmajorscale',
      label: 'G Major Scale (Ionian Mode)',
      octave: 'Notes G3–G4'
    },
    "D": {
      noteMap: { "D": ['d3', 'd4'], "E": ['e3'], "F#": ['f#3'], "G": ['g3'], "A": ['a3'], "B": ['b3'], "C#": ['c#4'] },
      degreeMap: { "D": '1st', "E": '2nd', "F#": '3rd', "G": '4th', "A": '5th', "B": '6th', "C#": '7th' },
      noteOrder: ["D", "E", "F#", "G", "A", "B", "C#"],
      referenceNote: 'd3',
      scaleAudio: 'dmajorscale',
      label: 'D Major Scale (Ionian Mode)',
      octave: 'Notes D3–D4'
    },
    "A": {
      noteMap: { "A": ['a3', 'a4'], "B": ['b3'], "C#": ['c#4'], "D": ['d4'], "E": ['e4'], "F#": ['f#4'], "G#": ['g#4'] },
      degreeMap: { "A": '1st', "B": '2nd', "C#": '3rd', "D": '4th', "E": '5th', "F#": '6th', "G#": '7th' },
      noteOrder: ["A", "B", "C#", "D", "E", "F#", "G#"],
      referenceNote: 'a3',
      scaleAudio: 'amajorscale',
      label: 'A Major Scale (Ionian Mode)',
      octave: 'Notes A3–A4'
    },
    "E": {
      noteMap: { "E": ['e3', 'e4'], "F#": ['f#3'], "G#": ['g#3'], "A": ['a3'], "B": ['b3'], "C#": ['c#4'], "D#": ['d#4'] },
      degreeMap: { "E": '1st', "F#": '2nd', "G#": '3rd', "A": '4th', "B": '5th', "C#": '6th', "D#": '7th' },
      noteOrder: ["E", "F#", "G#", "A", "B", "C#", "D#"],
      referenceNote: 'e3',
      scaleAudio: 'emajorscale',
      label: 'E Major Scale (Ionian Mode)',
      octave: 'Notes E3–E4'
    },
    "F": {
      noteMap: { "F": ['f3', 'f4'], "G": ['g3'], "A": ['a3'], "Bb": ['a#3'], "C": ['c4'], "D": ['d4'], "E": ['e4'] },
      degreeMap: { "F": '1st', "G": '2nd', "A": '3rd', "Bb": '4th', "C": '5th', "D": '6th', "E": '7th' },
      noteOrder: ["F", "G", "A", "Bb", "C", "D", "E"],
      referenceNote: 'f3',
      scaleAudio: 'fmajorscale',
      label: 'F Major Scale (Ionian Mode)',
      octave: 'Notes F3–F4'
    },
    "Bb": {
      noteMap: { "Bb": ['a#3', 'a#4'], "C": ['c4'], "D": ['d4'], "Eb": ['d#4'], "F": ['f4'], "G": ['g4'], "A": ['a4'] },
      degreeMap: { "Bb": '1st', "C": '2nd', "D": '3rd', "Eb": '4th', "F": '5th', "G": '6th', "A": '7th' },
      noteOrder: ["Bb", "C", "D", "Eb", "F", "G", "A"],
      referenceNote: 'a#3',
      scaleAudio: 'bbmajorscale',
      label: 'Bb Major Scale (Ionian Mode)',
      octave: 'Notes Bb3–Bb4'
    },
    "Eb": {
      noteMap: { "Eb": ['d#3', 'd#4'], "F": ['f3'], "G": ['g3'], "Ab": ['g#3'], "Bb": ['a#3'], "C": ['c4'], "D": ['d4'] },
      degreeMap: { "Eb": '1st', "F": '2nd', "G": '3rd', "Ab": '4th', "Bb": '5th', "C": '6th', "D": '7th' },
      noteOrder: ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
      referenceNote: 'd#3',
      scaleAudio: 'ebmajorscale',
      label: 'Eb Major Scale (Ionian Mode)',
      octave: 'Notes Eb3–Eb4'
    },
    "Ab": {
      noteMap: { "Ab": ['g#3', 'g#4'], "Bb": ['a#3'], "C": ['c4'], "Db": ['c#4'], "Eb": ['d#4'], "F": ['f4'], "G": ['g4'] },
      degreeMap: { "Ab": '1st', "Bb": '2nd', "C": '3rd', "Db": '4th', "Eb": '5th', "F": '6th', "G": '7th' },
      noteOrder: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
      referenceNote: 'g#3',
      scaleAudio: 'abmajorscale',
      label: 'Ab Major Scale (Ionian Mode)',
      octave: 'Notes Ab3–Ab4'
    },
    "B": {
      noteMap: { "B": ['b3', 'b4'], "C#": ['c#4'], "D#": ['d#4'], "E": ['e4'], "F#": ['f#4'], "G#": ['g#4'], "A#": ['a#4'] },
      degreeMap: { "B": '1st', "C#": '2nd', "D#": '3rd', "E": '4th', "F#": '5th', "G#": '6th', "A#": '7th' },
      noteOrder: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
      referenceNote: 'b3',
      scaleAudio: 'bmajorscale',
      label: 'B Major Scale (Ionian Mode)',
      octave: 'Notes B3–B4'
    },
    "F#": {
      noteMap: { "F#": ['f#3', 'f#4'], "G#": ['g#3'], "A#": ['a#3'], "B": ['b3'], "C#": ['c#4'], "D#": ['d#4'], "E#": ['f4'] },
      degreeMap: { "F#": '1st', "G#": '2nd', "A#": '3rd', "B": '4th', "C#": '5th', "D#": '6th', "E#": '7th' },
      noteOrder: ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
      referenceNote: 'f#3',
      scaleAudio: 'fsharpmajorscale',
      label: 'F# Major Scale (Ionian Mode)',
      octave: 'Notes F#3–F#4'
    },
    "C#": {
      noteMap: { "C#": ['c#3', 'c#4'], "D#": ['d#3'], "E#": ['f3'], "F#": ['f#3'], "G#": ['g#3'], "A#": ['a#3'], "B#": ['c4'] },
      degreeMap: { "C#": '1st', "D#": '2nd', "E#": '3rd', "F#": '4th', "G#": '5th', "A#": '6th', "B#": '7th' },
      noteOrder: ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
      referenceNote: 'c#3',
      scaleAudio: 'csharpmajorscale',
      label: 'C# Major Scale (Ionian Mode)',
      octave: 'Notes C#3–C#4'
    }
  };

  function playNote(noteFile) {
    audio.src = `audio/${encodeURIComponent(noteFile)}.mp3`;
    audio.play();
  }

function generateNoteRangeText() {
  const data = scaleData[currentScale];
  const noteNames = data.noteOrder.slice(0, currentMode);
  const tonic = noteNames[0]; // First note in the scale
  const tonicFiles = data.noteMap[tonic];

  if (currentMode === 8 && tonicFiles.length === 2) {
    // Extract octaves from filenames like "ab3" → "3"
    const [note1, note2] = tonicFiles.map(f => f.match(/\d+/)?.[0]);
    return `${data.octave} — the ${tonic} button works for both ${tonic}${note1} and ${tonic}${note2}!`;
  }

  const formattedList = noteNames.length === 2
    ? `${noteNames[0]} and ${noteNames[1]}`
    : `${noteNames.slice(0, -1).join(', ')} and ${noteNames[noteNames.length - 1]}`;
  return `Notes ${formattedList} from one octave`;
}

  function getNoteName(filename, scale) {
    const reverseMap = {};
    const map = scaleData[scale].noteMap;
    for (const [name, files] of Object.entries(map)) {
      files.forEach(file => reverseMap[file] = name);
    }
    return reverseMap[filename] || '';
  }

  function buildNoteButtons() {
    noteButtonsContainer.innerHTML = '';
    const data = scaleData[currentScale];
    const keys = data.noteOrder.slice(0, currentMode);
    currentNotes = keys.map(key => data.noteMap[key][0]);
    keys.forEach(note => {
      const btn = document.createElement('button');
      btn.className = 'blue-button';
      btn.setAttribute('data-note', note);
      btn.textContent = showDegrees
        ? (currentMode === 8 && note === data.noteOrder[0] ? '1st/8th' : data.degreeMap[note])
        : note;
      if (currentMode === 8 && showDegrees && note === data.noteOrder[0]) {
  btn.classList.add('wide-label');
      }
      btn.addEventListener('click', handleAnswer);
      noteButtonsContainer.appendChild(btn);
    });
}
  }

  function loadNewNote() {
    isAnswered = false;
    buildNoteButtons();
    const buttons = noteButtonsContainer.querySelectorAll('.blue-button');
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('correct', 'incorrect');
    });
    const candidates = [...currentNotes];
    if (currentMode === 8 && scaleData[currentScale].noteMap[scaleData[currentScale].noteOrder[0]].length === 2) {
      candidates.push(scaleData[currentScale].noteMap[scaleData[currentScale].noteOrder[0]][1]);
    }
    currentNote = candidates[Math.floor(Math.random() * candidates.length)];
    playNote(currentNote);
    promptText.textContent = 'Which note was played?';
    nextBtn.disabled = true;
    updateModeButtonsState();
  }

  function handleAnswer(e) {
    if (isAnswered) return;
    isAnswered = true;
    const selected = e.target.getAttribute('data-note');
    const correctName = getNoteName(currentNote, currentScale);
    if (selected === correctName) {
      correct++;
      e.target.classList.add('correct');
      promptText.textContent = showDegrees
        ? `Correct! ✅ The note was the ${currentMode === 8 && correctName === scaleData[currentScale].noteOrder[0] ? '1st/8th' : scaleData[currentScale].degreeMap[correctName]} scale degree`
        : `Correct! ✅ The note was ${correctName}`;
    } else {
      incorrect++;
      e.target.classList.add('incorrect');
      const correctBtn = [...noteButtonsContainer.querySelectorAll('.blue-button')]
        .find(btn => btn.getAttribute('data-note') === correctName);
      if (correctBtn) correctBtn.classList.add('correct');
      promptText.textContent = showDegrees
        ? `Incorrect! ❌ The note was the ${currentMode === 8 && correctName === scaleData[currentScale].noteOrder[0] ? '1st/8th' : scaleData[currentScale].degreeMap[correctName]} scale degree`
        : `Incorrect! ❌ The note played was actually ${correctName}`;
    }
    updateScore();
    nextBtn.disabled = false;
    [...noteButtonsContainer.querySelectorAll('.blue-button')].forEach(btn => btn.disabled = true);
  }

  function updateScore() {
    const total = correct + incorrect;
    correctCount.textContent = correct;
    incorrectCount.textContent = incorrect;
    totalCount.textContent = total;
    accuracyDisplay.textContent = total ? ((correct / total) * 100).toFixed(1) + '%' : '0.0%';
  }

  function resetScore() {
    correct = 0;
    incorrect = 0;
    updateScore();
  }

  function toggleDisplay(mode) {
    showDegrees = mode === 'degrees';
    updateNoteButtonLabels();
    displayNotesBtn.classList.toggle('selected', !showDegrees);
    displayDegreesBtn.classList.toggle('selected', showDegrees);
    scaleLabel.textContent = scaleData[currentScale].label;
    octaveLabel.textContent = generateNoteRangeText();
    playRefBtn.textContent = `Play Reference (${scaleData[currentScale].noteOrder[0]} - Tonic)`;
    promptText.textContent = 'Which note was played?';
  }

  function updateNoteButtonLabels() {
  const buttons = noteButtonsContainer.querySelectorAll('.blue-button');
  const data = scaleData[currentScale];

  buttons.forEach(btn => {
    const note = btn.getAttribute('data-note');
    btn.textContent = showDegrees
      ? (currentMode === 8 && note === data.noteOrder[0] ? '1st/8th' : data.degreeMap[note])
      : note;

    btn.classList.toggle('wide-label', showDegrees && currentMode === 8 && note === data.noteOrder[0]);

    // Force reflow (optional but helps in some rendering edge cases)
    btn.style.display = 'none';
    btn.offsetHeight; // trigger reflow
    btn.style.display = '';
  });
}

  function updateModeButtonsState() {
    addNoteBtn.disabled = currentMode >= 8;
    removeNoteBtn.disabled = currentMode <= 2;
  }

  document.querySelectorAll('.scale-select').forEach(btn => {
    btn.addEventListener('click', () => {
      currentScale = btn.getAttribute('data-scale');
      startScreen.classList.add('hidden');
      selectedScaleLabel.textContent = scaleData[currentScale].label;
      modeSelectScreen.classList.remove('hidden');
      playNote(scaleData[currentScale].scaleAudio);
    });
  });

  document.querySelectorAll('.mode-button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = parseInt(btn.getAttribute('data-mode'), 10);
      modeSelectScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      resetScore();
      toggleDisplay('notes');
      scaleLabel.textContent = scaleData[currentScale].label;
      playRefBtn.textContent = `Play Reference (${scaleData[currentScale].noteOrder[0]} - Tonic)`;
      loadNewNote();
    });
  });

  backToScaleSelect.addEventListener('click', () => {
    modeSelectScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  backButton.addEventListener('click', () => {
    gameScreen.classList.add('hidden');
    modeSelectScreen.classList.remove('hidden');
  });

  playRefBtn.addEventListener('click', () => playNote(scaleData[currentScale].referenceNote));
  playScaleBtn.addEventListener('click', () => playNote(scaleData[currentScale].scaleAudio));
  replayNoteBtn.addEventListener('click', () => playNote(currentNote));
  nextBtn.addEventListener('click', loadNewNote);
  resetScoreBtn.addEventListener('click', resetScore);
  displayNotesBtn.addEventListener('click', () => toggleDisplay('notes'));
  displayDegreesBtn.addEventListener('click', () => toggleDisplay('degrees'));

  addNoteBtn.addEventListener('click', () => {
    if (currentMode < 8) {
      currentMode++;
      resetScore();
      toggleDisplay(showDegrees ? 'degrees' : 'notes');
      loadNewNote();
    }
  });

  removeNoteBtn.addEventListener('click', () => {
    if (currentMode > 2) {
      currentMode--;
      resetScore();
      toggleDisplay(showDegrees ? 'degrees' : 'notes');
      loadNewNote();
    }
  });
});
