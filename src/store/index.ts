import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { imgbbApi } from './api/createImagebbAPI';
import { templatesAPI } from '@/store/api';
import { globalSlice, toggleTheme, selectedTemplateName } from '@/store/globalSlice';
import { tempDatabaseApi } from './api/tempDatabaseAPI';
import { uploadImageForEmployeApi } from './api/uploadImageForEmployeAPI';

export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    [templatesAPI.reducerPath]: templatesAPI.reducer,
    [imgbbApi.reducerPath]: imgbbApi.reducer,
    [tempDatabaseApi.reducerPath]: tempDatabaseApi.reducer,
    [uploadImageForEmployeApi.reducerPath]: uploadImageForEmployeApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    templatesAPI.middleware, 
    imgbbApi.middleware, 
    tempDatabaseApi.middleware,
    uploadImageForEmployeApi.middleware)
});

setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export { toggleTheme, selectedTemplateName };
