import fs from 'fs';
import ExcelJS from 'exceljs';

const filePath = 'files/PROSOL_workers3.xlsx';
const outputFilePath = 'src/files/tempDatabase.json';

async function parseExcelAndSaveToJson() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1); // assuming the names are in the first sheet

  const names = [];
  worksheet.eachRow((row) => {
    const name = row.getCell('J').value; // assuming names are in column J
    if (name) {
      names.push({ name: name.toString() });
    }
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(names, null, 2), 'utf-8');
  console.log('Names saved to JSON file');
}

export async function parseExcelAndSaveChangesToJson() {
  console.log("ParseExcelandSaveChangesToJson");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);

  const newNames = [];
  const columnValues = worksheet.getColumn('J').values.slice(2);

  columnValues.forEach((value) => {
    if (value) {
      newNames.push({ name: value.toString() });
    }
  });
  let existingNames = [];
  if (fs.existsSync(outputFilePath)) {
    const data = fs.readFileSync(outputFilePath, 'utf8');
    existingNames = JSON.parse(data);
  }
  const newNamesSet = new Set(newNames.map(item => item.name));
  const existingNamesSet = new Set(existingNames.map(item => item.name));

  const additions = newNames.filter(item => !existingNamesSet.has(item.name));
  const deletions = existingNames.filter(item => !newNamesSet.has(item.name));
  const updatedNames = [...existingNames.filter(item => !deletions.includes(item)), ...additions];

  fs.writeFileSync(outputFilePath, JSON.stringify(updatedNames, null, 2), 'utf-8');
  console.log('Changes saved to JSON file');
}


export default {parseExcelAndSaveToJson , parseExcelAndSaveChangesToJson};
