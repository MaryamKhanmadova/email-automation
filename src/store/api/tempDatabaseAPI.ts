import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface NameEntry {
  name: string;
  imageUrl?: string;
}

export const tempDatabaseApi = createApi({
  reducerPath: 'tempDatabaseApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
  endpoints: (builder) => ({
    fetchNames: builder.query<NameEntry[], void>({
      query: () => 'tempDatabase',
    }),
  }),
});

export const { useFetchNamesQuery } = tempDatabaseApi;
