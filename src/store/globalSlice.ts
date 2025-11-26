import { createSlice } from '@reduxjs/toolkit';

interface iInitialState {
  theme: 'dark' | 'light';
  selectedTemplateName: string | null;
}

const initialState: iInitialState = {
  theme: 'dark',
  selectedTemplateName: null,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    selectedTemplateName: (state, action) => {
      state.selectedTemplateName = action.payload;
    },
  },
});

export const { toggleTheme, selectedTemplateName } = globalSlice.actions;
export default globalSlice.reducer;
