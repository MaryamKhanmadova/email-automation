import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUploadImageMutation as useUploadImageBBMutation } from '@/store/api/createImagebbAPI.ts';
import { useFetchNamesQuery } from '@/store/api/tempDatabaseAPI';
import { useUploadImageMutation } from '@/store/api/uploadImageForEmployeAPI';

interface NameEntry {
  name: string;
  imageUrl?: string;
}

const DataTable: React.FC = () => {
  const { data: names = [], isFetching } = useFetchNamesQuery();
  const [uploadImageBB] = useUploadImageBBMutation();
  const [uploadImageForEmployee] = useUploadImageMutation();
  const [nameEntries, setNameEntries] = useState<NameEntry[]>([]);

  // Use effect to set nameEntries only when names data is initially fetched or changes
  useEffect(() => {
    if (!isFetching) {
      setNameEntries(names);
    }
  }, [names, isFetching]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, name: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const formDataImage = new FormData();
      formDataImage.append('image', file);

      try {
        const { data } = await uploadImageBB(formDataImage).unwrap();
        const imageUrl = data?.url ?? '';
        console.log('Image uploaded successfully:bb', imageUrl);

        const updatedEntries = nameEntries.map(entry =>
          entry.name === name ? { ...entry, imageUrl } : entry
        );
        setNameEntries(updatedEntries);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', file);
        formData.append('imageUrl', imageUrl);

        try {
          const response = await uploadImageForEmployee(formData).unwrap();
          console.log('Image uploaded successfully:', response);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      } catch (error) {
        console.error('Error uploading image to ImageBB:', error);
      }
    }
  };

  return (
    <Table>
      <TableCaption>Worker List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Upload</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nameEntries.map((item, index) => (
          <TableRow key={index}>
            <TableCell className='font-medium'>{item.name}</TableCell>
            <TableCell>
              {item.imageUrl && (
                <img
                  src={`${item.imageUrl}`}
                  alt={item.name}
                  style={{ width: '50px' }}
                />
              )}
            </TableCell>
            <TableCell>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => handleImageUpload(e, item.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
