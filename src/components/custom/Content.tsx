import React, { useState, useEffect } from 'react';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useFetchTemplatesQuery } from '@/store/api';
import { iTemplate } from '@/components/custom/TemplateList';
import { Input } from '@/components/ui/input';
import {
  handleImageChange,
  handleSubmit,
  updateEmailContent,
} from '@/emailUtils';
import { EmailInputs } from '@/emailUtils';
import { useUploadImageMutation } from '@/store/api/createImagebbAPI';

function Content() {
  const { data: templateData } = useFetchTemplatesQuery({});
  const templateList = templateData || [];

  const [inputs, setInputs] = useState<EmailInputs>({
    to: '',
    cc: '',
    subject: '',
    fullName: '',
    position: '',
    image: null,
    imageUrl: '',
    emailContent: '',
  });

  const selectedTemplateName = useSelector((state: RootState) => state.global.selectedTemplateName);
  const selectedTemplateContent = selectedTemplateName
    ? templateList.find((template: iTemplate) => template.name === selectedTemplateName)
    : null;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  useEffect(() => {
    const composedContent = updateEmailContent(selectedTemplateContent, inputs);
  
    if (composedContent !== inputs.emailContent) {
      setInputs(prevInputs => ({
        ...prevInputs,
        emailContent: composedContent,
      }));
    }
  }, [selectedTemplateContent, inputs]);

  const [uploadImageBB] = useUploadImageMutation();
  
  const renderInputsForTemplate = () => {
    if (!selectedTemplateContent) return null;
    const templateContent = selectedTemplateContent.content;
    const matches = templateContent.match(/{{\w+}}/g);
    if (!matches) return null;
    return matches.map((match: string, index: number) => {
      const fieldName = match.slice(2, -2); // remove {{ and }} from match
      const placeholder = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      const fieldValue = inputs[fieldName as keyof typeof inputs];
      return (
        <Input
          key={index}
          type={fieldName === 'email' ? 'email' : 'text'}
          name={fieldName}
          placeholder={placeholder}
          value={String(fieldValue) || ''} // Set the value from state
          onChange={handleEmailChange} // Update the state
        />
      );
    });
  };

  return (
    <main className="flex flex-1 flex-row gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col w-1/2 gap-4">
        <div className='flex items-center'>
          {selectedTemplateName && (
            <h1 className='text-lg font-semibold md:text-2xl'>
              Email template - {selectedTemplateName}
            </h1>
          )}
        </div>
        <Input type="email" name="to" placeholder="To" value={inputs.to} onChange={handleEmailChange} />
        <Input type="email" name="cc" placeholder="Cc" value={inputs.cc} onChange={handleEmailChange} />
        <Input type="text" name="subject" placeholder="Subject" value={inputs.subject} onChange={handleEmailChange} />
        {renderInputsForTemplate()}
        <Input type="file" name="image" onChange={(e) => handleImageChange(e, setInputs, uploadImageBB)} accept="image/*" />
        <button onClick={() => handleSubmit(inputs, selectedTemplateContent)} className="bg-blue-500 text-white p-2 rounded-md">Send Email</button>
      </div>
      <div className="flex flex-col w-1/2 border border-gray-300 p-4">
        <h2 className="text-lg font-semibold mb-4">Email Template Preview</h2>
        <div className="email-preview" dangerouslySetInnerHTML={{ __html: inputs.emailContent }} />
      </div>
    </main>
  );
}

export default Content;
