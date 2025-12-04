import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface NameEntry {
  name: string;
  imageUrl?: string;
}

export const tempDatabaseApi = createApi({
  reducerPath: 'tempDatabaseApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://email-automation-7hrg.onrender.com/api' }),
  endpoints: (builder) => ({
    fetchNames: builder.query<NameEntry[], void>({
      query: () => 'tempDatabase',
    }),
  }),
});

export const { useFetchNamesQuery } = tempDatabaseApi;
