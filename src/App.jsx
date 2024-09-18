import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';

const App = () => {
  const [notes, setNotes] = useState(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes === null) return [];
    return JSON.parse(storedNotes);
  });

  const [noteText, setNoteText] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    updateProgress();
  }, [notes]);

  const handleNoteTextChange = (event) => {
    setNoteText(event.target.value);
  };

  const handleAddNote = () => {
    if (noteText.trim() !== '') {
      setNotes([...notes, { text: noteText, completed: false }]);
      setNoteText('');
    }
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const handleToggleNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].completed = !updatedNotes[index].completed;
    setNotes(updatedNotes);
  };

  const updateProgress = () => {
    const completedNotes = notes.filter((note) => note.completed);
    const percentage = (completedNotes.length / notes.length) * 100;
    setProgress(percentage);
  };

  const downloadNotes = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `${currentDate}_notes.json`;
    const dataWithDate = {
      date: currentDate,
      notes: notes
    };
    const data = JSON.stringify(dataWithDate);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return (
    <div>
      <TextField
        label="Add Note"
        value={noteText}
        onChange={handleNoteTextChange}
      />
      <Button variant="contained" color="primary" onClick={handleAddNote}>
        Add
      </Button>
      {notes.length > 0 && (
        <div>
          {notes.map((note, index) => (
            <div key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={note.completed}
                    onChange={() => handleToggleNote(index)}
                  />
                }
                label={note.text}
              />
              <Button variant="contained" color="secondary" onClick={() => handleDeleteNote(index)}>
                Delete
              </Button>
            </div>
          ))}
          <div>
            Progress: {progress}%
            <CircularProgress variant="determinate" value={progress} />
          </div>
          <Button variant="contained" color="primary" onClick={downloadNotes}>
            Download Notes
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
