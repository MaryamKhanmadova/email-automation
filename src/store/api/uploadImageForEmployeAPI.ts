import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const uploadImageForEmployeApi = createApi({
  reducerPath: 'uploadImageForEmployeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://email-automation-hr.vercel.app/api' }),
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
