import '../style.css';
// State + Reusable Component things
import './comment.js';
import store from './store/index.js';
import Comment from './components/comments.js';
// IDB things
import { openDB } from 'idb';
import Note from './components/notes';

window.addEventListener('DOMContentLoaded', async () => {
  // Set up Database.
  openDB('comment-store', 1, {
    upgrade(db) {
      // Creates 'comments' Object Store if it doesn't already exist.
      db.createObjectStore('comments', { autoIncrement: true });
      db.createObjectStore('note', {autoIncrement: true});
      console.log('hi');
    },
  });

  // Get comments from database, and add to state (see ./store/state.js).
  const db = await openDB('comment-store', 1);
  const comments = ((await db.getAll('comments')) || {});
  for (let i = 0; i < comments.length; i++) {
    store.dispatch('addComment', comments[i]);
  }
  // Add note
  const noteValue = document.querySelector('#note');
  let note = await(db.getAll('note'));
  if (note.length != 0) {
    noteValue.value = note[note.length-1];
  }

  db.close();
});

const formElement = document.querySelector('.comment-form');
const nameElement = document.querySelector('#name');
const emailElement = document.querySelector('#email');
const commentElement = document.querySelector('#new-comment-field');

formElement.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  let name = nameElement.value.trim();
  let email = emailElement.value.trim();
  let contents = commentElement.value.trim();
  if (name.length && email.length && contents.length) {
    let comment = { name: name, email: email, contents: contents }
    // Add comment to state.
    store.dispatch('addComment', comment);
    // Add comment to database.
    const db = await openDB('comment-store', 1);
    await db.put('comments', comment);
    db.close();
    // Prepare form to recieve another comment.
    commentElement.value = '';
    commentElement.focus();
  }
});

const commentInstance = new Comment();
const noteInstance = new Note();
commentInstance.render();
noteInstance.render();

const noteElement = document.querySelector('.notes');
const noteValue = document.querySelector('#note');
noteElement.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  let note = noteValue.value.trim();

  const db = await openDB('comment-store', 1);
  await db.put('note', note);
  db.close();
  store.dispatch('editNote', note);
});

const showFavorites = document.querySelector('#show-favorites');
showFavorites.addEventListener('click', async() => {
  // console.log('button pressed');
  // let x = i++; != let x = i + 1;
  // let y = ++i; == let y = i + 1;

  // clear old comments
  const commentLength = store.state.comments.length;
  /**
   * comments = []
   * length = comments.length; == 3
   * while i < length: i = 3
   *  deleteComment(comments[0]);
   *  i++
   */
  for (let i = 0; i < commentLength; i++) {
    store.dispatch('clearComment', { index: 0 });
  }

  const db = await openDB('comment-store', 1);
  const comments = ((await db.getAll('comments')) || {});
  for (let i = 0; i < comments.length; ++i) {
    if (store.state.favorites.includes(i)) {
      store.dispatch('addComment', comments[i]);
    }
  }
});
