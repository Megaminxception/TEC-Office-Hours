import '../idb_actions.js';

export default {
  addComment(state, payload) {
    state.comments.push(payload);
    return state;
  },
  clearComment(state, payload) {
    state.comments.splice(payload.index, 1);
    // deleteComment(payload.index);
    return state;
  },
  editNote(state, payload) { // payload is a string
    state.notes = payload;
    return state;
  },
  favoriteComment(state, payload) { // payload is an int index
    if (!state.favorites.includes(payload.index)) {
      state.favorites.push(payload.index);
    }
    console.log(state.favorites);
    return state;
  }
};
