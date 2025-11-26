import fs from 'fs';
export const readTemplateFile = async ( filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
};

export default readTemplateFile;