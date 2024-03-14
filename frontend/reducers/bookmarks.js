import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark: (state, action) => {
      //console.log(' ****** action.payload =>', action.payload);
      state.value.push(action.payload);
    },
    removeBookmark: (state, action) => {
      state.value = state.value.filter(
        (el) => el.title !== action.payload.title
      );
    },
    removeAllBookmarks: (state, action) => {
      state.value = [];
    },
  },
});

export const { addBookmark, removeBookmark, removeAllBookmarks } =
  bookmarksSlice.actions;
export default bookmarksSlice.reducer;
