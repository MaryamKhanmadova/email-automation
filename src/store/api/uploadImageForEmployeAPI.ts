import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const uploadImageForEmployeApi = createApi({
  reducerPath: 'uploadImageForEmployeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ filename: string }, FormData>({
      query: (formData) => ({
        url: '/uploadImage',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadImageForEmployeApi;