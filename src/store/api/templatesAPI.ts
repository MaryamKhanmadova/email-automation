import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { pause } from '@/lib/utils';

export const templatesAPI = createApi({
  reducerPath: 'templatesAPI',
  baseQuery: fetchBaseQuery({
    //baseUrl: import.meta.env.VITE_BASE_URL_API + '/api',
    baseUrl: 'https://email-automation-7hrg.onrender.com/api',
    fetchFn: async (...args) => {
      await pause(2000);
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      fetchTemplates: builder.query({
        query: () => ({
          url: '/templates',
        }),
      }),
    };
  },
});

export const { useFetchTemplatesQuery, useLazyFetchTemplatesQuery } = templatesAPI;
