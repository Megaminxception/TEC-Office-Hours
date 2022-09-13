export default {
  addComment(context, payload) {
    context.commit('addComment', payload);
  },
  clearComment(context, payload) {
    context.commit('clearComment', payload);
  },
  editNote(context, payload) {
    context.commit('editNote', payload);
  },
  favoriteComment(context, payload) {
    context.commit('favoriteComment', payload);
  },
};
