import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface UploadResponse {
    data?: {
      url?: string; // Make the URL property optional to handle cases where it might not be present
    };
  }

export const imgbbApi = createApi({
  reducerPath: 'imgbbApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.imgbb.com/1' }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadResponse, FormData>({
      query: (imageData) => ({
        url: '/upload',
        method: 'POST',
        body: imageData,
        params: {
          key: '3bb9e7cb5fb4ceb64bace9da063b45e3', // Replace with your ImageBB API key
        },
      }),
    }),
  }),
});

export const { useUploadImageMutation } = imgbbApi;
