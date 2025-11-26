import { Menu, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from "@/components/ui/switch"
import React, { useState } from 'react';

import Sidebar from '@/components/custom/Sidebar';
import Content from '@/components/custom/Content';
import SearchBar from '@/components/custom/SearchBar';
import TemplateList from '@/components/custom/TemplateList';
import { ThemeProvider } from '@/components/theme-provider';
import DropdownProfile from '@/components/custom/DropdownProfile';
import DataTable from '@/components/custom/DataTable';

const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  console.log('file burda: ', file);
  if (file?.name == 'PROSOL_workers3.xlsx') {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
      try {
        const response = await fetch('http://localhost:3000/uploadFile', {
          method: 'POST',
          body: formData,
        });
        console.log('Response:', response);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  } else {
    console.log('File name is not correct!');
  }
};
function App() {
  const [showContent, setShowContent] = useState(true);

  const toggleContent = () => {
    setShowContent((prevShowContent) => !prevShowContent);
  };

  return(
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
          <div className='hidden border-r bg-muted/40 md:block'>
            <Sidebar />
          </div>
          <div className='flex flex-col'>
            <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='flex flex-col'>
                  <nav className='grid gap-2 text-lg font-medium'>
                    <Button variant='link' className='flex items-center gap-2 text-lg font-semibold'>
                      <Package2 className='h-6 w-6' />
                      <span className='sr-only'>Acme Inc</span>
                    </Button>
                    <TemplateList />
                  </nav>
                </SheetContent>
              </Sheet>
              <SearchBar />
              <input type='file' id='file-upload' onChange={handleImageChange} name='file' />
              Email Content<Switch onClick={toggleContent}/> Worker List
              <DropdownProfile />
            </header>
            {showContent ? <Content /> : <DataTable />}
          </div>
        </div>
      </ThemeProvider>
  )
  
}

export default App;
