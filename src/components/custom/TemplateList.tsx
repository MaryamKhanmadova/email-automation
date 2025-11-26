import { Mail } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';

import { useFetchTemplatesQuery } from '@/store/api';
import { AppDispatch, selectedTemplateName } from '@/store';

export interface iTemplate {
  name: string;
  content: string;
  inputs: {
    type: string;
    name: string;
    placeholder: string;
  }[];
}

function TemplateList() {
  const dispatch: AppDispatch = useDispatch();
  const { data: templateList, isLoading, isError } = useFetchTemplatesQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      {templateList.map((template: iTemplate) => (
        <Button
          variant='link'
          className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
          key={template.name}
          onClick={() => dispatch(selectedTemplateName(template.name))}
        >
          <Mail className='h-5 w-5' />
          {template.name}
          
        </Button>
      ))}
    </>
  );
}

export default TemplateList;
