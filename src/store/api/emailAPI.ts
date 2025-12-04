import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emailAPI = createApi({
  reducerPath: 'emailAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://email-automation-7hrg.onrender.com/api', // Adjust the base URL as needed
  }),
  endpoints(builder) {
    return {
      sendEmail: builder.mutation({
        query: (emailData) => ({
          url: '/send-email',
          method: 'POST',
          body: emailData,
        }),
      }),
    };
  },
});

export const { useSendEmailMutation } = emailAPI;
