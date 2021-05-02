// -----------------------------------------------------------------------------
// Program:  index.js
// Purpose:  1) Handle Event Requests:
//             a) Display Note Detail
//             b) Save Note
//             c) Delete Note
//             d) Create New Note
//           2) Build Notes List.
// Input:    <none>   
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 1, 2021
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Global Variables Section
// -----------------------------------------------------------------------------
let activeNote = {};   // activeNote is used to keep track of the note in the textarea
let newNoteBtn;
let noteList;
let noteText;
let noteTitle;
let saveNoteBtn;

// If this is the notes window, use ajax to retrieve html elements
if (window.location.pathname === '/notes') {
  noteTitle = $('.note-title');
  noteText = $('.note-textarea');
  saveNoteBtn = $('.save-note');
  newNoteBtn = $('.new-note');
  noteList = $('.list-container .list-group');
}


// -----------------------------------------------------------------------------
// Function: show
// Purpose:  Make an element visible
// Input:    <html element> 
// Returns:  <none> 
// -----------------------------------------------------------------------------
const show = (elem) => {
  elem.show();
};


// -----------------------------------------------------------------------------
// Function: hide
// Purpose:  Make an element invisible
// Input:    <html element> 
// Returns:  <none> 
// -----------------------------------------------------------------------------
const hide = (elem) => {
  elem.hide();
};


// -----------------------------------------------------------------------------
// Function: getNotes
// Purpose:  Call Web Service API to get notes that are displayed on left side
// Input:    <none> 
// Returns:  <JSON> Jason object of notes (in an array) 
// -----------------------------------------------------------------------------
const getNotes = () => {
  return $.ajax({
    url: '/api/notes',
    method: 'GET'
  });
};


// -----------------------------------------------------------------------------
// Function: saveNotes
// Purpose:  Call Web Service API to save notes
// Input:    <none> 
// Returns:  <JSON> Jason object of notes (in an array) 
// -----------------------------------------------------------------------------
const saveNote = (note) => {
  return $.ajax({
    url: '/api/notes',
    data: note,
    method: 'POST',
  });
};


// -----------------------------------------------------------------------------
// Function: deleteNote
// Purpose:  Call Web Service API to delete a specific note, indicated by id
// Input:    <none> 
// Returns:  <JSON> Jason object of notes (in an array) 
// -----------------------------------------------------------------------------
const deleteNote = (id) => {
  return $.ajax({
    url: `api/notes/${id}`,
    method: 'DELETE',
  });
};


// -----------------------------------------------------------------------------
// Function: renderActiveNote
// Purpose:  Set value and readonly attribute to the note detail
// Input:    <none> 
// Returns:  <none>
// -----------------------------------------------------------------------------
const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote) {
    noteTitle.attr('readonly', true);
    noteTitle.val(activeNote.title);
    noteText.attr('readonly', true);
    noteText.val(activeNote.text);
  } else {
    noteTitle.attr('readonly', false);
    noteTitle.val('');
    noteText.attr('readonly', false);
    noteText.val('');
  };
};


// -----------------------------------------------------------------------------
// Function: handleNoteSave
// Purpose:  Save the active note, update notes list, prepare for new note
// Input:    <none> 
// Returns:  <none>
// -----------------------------------------------------------------------------
const handleNoteSave = () => {
  // build object needed for sve
  const newNote = {
    title: noteTitle.val(),
    text: noteText.val(),
  };
  saveNote(newNote);
  getAndRenderNotes();
  renderActiveNote();
};


// -----------------------------------------------------------------------------
// Function: handleNoteDelete
// Purpose:  Delete selected note, update notes list, prepare for note entry
// Input:    <none> 
// Returns:  <none>
// -----------------------------------------------------------------------------
const handleNoteDelete = (event) => {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();
  const noteId = JSON.parse(event.target.parentElement.getAttribute('data-note')).id;

  if (activeNote && activeNote.id === noteId) {
    activeNote = {};
  };
  deleteNote(noteId);
  getAndRenderNotes();
  renderActiveNote();
};


// -----------------------------------------------------------------------------
// Function: handleNoteView
// Purpose:  Sets the activeNote and displays it
// Input:    <none> 
// Returns:  <none>
// -----------------------------------------------------------------------------
const handleNoteView = (event) => {
  event.preventDefault();
  activeNote = JSON.parse(event.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};


// -----------------------------------------------------------------------------
// Function: handleNewNoteView
// Purpose:  Sets the activeNote to an empty object and allows the user to enter a new note
// Input:    <none> 
// Returns:  <none>
// -----------------------------------------------------------------------------
const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};


// -----------------------------------------------------------------------------
// Function: handleRenderSaveBtn
// Purpose:  Sets if the save button should be displayed
// Input:    <none> 
// Returns:  <none>
// -----------------------------------------------------------------------------
const handleRenderSaveBtn = () => {
  if (!noteTitle.val().trim() || !noteText.val().trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  };
};


// -----------------------------------------------------------------------------
// Function: renderNoteList
// Purpose:  Renders the list of notes.
// Input:    <JSON> Jason object of notes (in an array) 
// Returns:  <none>
// -----------------------------------------------------------------------------
const renderNoteList = (notes) => {
  // Empty out the HTML elements inside of the noteList container.
  noteList.empty();

  let noteListItems = [];  // Reset array that holds the notes

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.innerText = text;
    // Create a listener so user can click to get details
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    // Add a delete button so user can delete this note
    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      // Create a listener for this delete button
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    };

    return liEl;
  };

  if (notes.length === 0) {  // No notes saved in the JSON file on disk
    noteListItems.push(createLi('No saved Notes', false));
  };

  // Write out the notes 
  notes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li); // Add to the array
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  };

};


// -----------------------------------------------------------------------------
// Function: getAndRenderNotes
// Purpose:  Get Notes and then call renderNoteList to display them..
// Input:    <none>
// Returns:  <none>
// -----------------------------------------------------------------------------
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
}

if (window.location.pathname === '/notes') {
  newNoteBtn.on("click", handleNoteView);
  noteList.on("click", ".list-group-item", handleNoteView);
  noteText.on("keyup", handleRenderSaveBtn);
  noteTitle.on("keyup", handleRenderSaveBtn);
  saveNoteBtn.on("click", handleNoteSave);
};


// On page load get the saved notes and display them.
getAndRenderNotes();
