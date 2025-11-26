// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { iTemplate } from '@/components/custom/TemplateList';
import { useUploadImageMutation } from './store/api/createImagebbAPI'; 

export interface EmailInputs {
    to: string;
    cc: string;
    subject: string;
    fullName: string;
    position: string;
    image: File | null;
    imageUrl: string;
    emailContent: string;
  }  

  // export const uploadImageToImageBB = createApi({
  //   reducerPath: 'uploadImageToImageBB',
  //   baseQuery: fetchBaseQuery({
  //     //baseUrl: import.meta.env.VITE_BASE_URL_API + '/api',
  //     baseUrl: 'https://api.imgbb.com/1/'
  //   }),
  //   endpoints: (builder) => ({
  //       uploadImageBB: builder.mutation<string, FormData>({
  //         query: (file: FormData) => ({
  //           url: '/upload?key=3bb9e7cb5fb4ceb64bace9da063b45e3',
  //           method: 'POST', 
  //           body: file,
  //         }),
  //         transformResponse: (response: { data: { url: string } }) => response.data.url,
  //       }),
  //   })
  // });
   
  // export const { useUploadImageBBMutation } = uploadImageToImageBB;


export const handleImageChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setInputs: React.Dispatch<React.SetStateAction<EmailInputs>>,
  uploadImageBB: ReturnType<typeof useUploadImageMutation>[0]
) => {
  const file = e.target.files?.[0];
  console.log('file burda: ', file);
  if (file) {
    setInputs(prevInputs => ({
      ...prevInputs,
      image: file,
    }));
    const formData = new FormData();
    formData.append('image', file);
    try {
      const {data} = await uploadImageBB(formData).unwrap();
      const imageUrl = data?.url ?? '';
      setInputs(prevInputs => ({
        ...prevInputs,
        imageUrl,
      }));
        console.log('Image uploaded successfully:bb', imageUrl);
    } catch (error) {
      console.error('Error uploading image to ImageBB:', error);
    }
  }
};

export const handleSubmit = async (inputs: EmailInputs, selectedTemplateContent: iTemplate | null) => {
  const { to, cc, subject, imageUrl } = inputs;
  if (!to || !cc || !subject) {
    console.error('Recipient(s) not defined');
    return;
  }

  const formData = new FormData();
  for (const key in inputs) {
    if (Object.prototype.hasOwnProperty.call(inputs, key)) {
      const value = inputs[key as keyof typeof inputs];
      formData.append(key, value || ''); // Set default value as empty string if value is null or undefined
    }
  }

  formData.append('imageUrl', imageUrl || ''); // Send image URL to the server
  formData.append('templateName', selectedTemplateContent?.name || '');

  for (const [key, value] of formData.entries()) {
    console.log(`FormData ${key}: ${value}`);
  }
  
  try {
    const response = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      body: formData,
    });

    console.log('Response:', response);

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        console.log('Email sent successfully');
      } else {
        console.log('Failed to send email');
      }
    } else {
      console.log('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const updateEmailContent = (
  selectedTemplateContent: iTemplate | null,
  inputs: EmailInputs
): string => {
  let composedContent = '';
  if (selectedTemplateContent) {
    composedContent = selectedTemplateContent.content;

    for (const key in inputs) {
      if (Object.prototype.hasOwnProperty.call(inputs, key)) {
        const value = inputs[key as keyof typeof inputs];
        const placeholder = `{{${key}}}`;
        composedContent = composedContent.replace(placeholder, value ? value.toString() : '');
      }
    }

    composedContent = composedContent.replace('{{image}}', inputs.image ? inputs.image.name : '');
    composedContent = composedContent.replace('{{imageUrl}}', inputs.imageUrl);
  }

  return composedContent;
};
