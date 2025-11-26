import ExcelJS from 'exceljs';
import moment from 'moment-timezone'; // For date parsing
import fs from 'fs';
import uploadDirFiles from './upload.js';

const filePath = 'files/PROSOL_workers3.xlsx';
const workbook = await new ExcelJS.Workbook();
let formattedValue;
export let birthdayDate = {};

export async function readAndFormatColumnI() {
  try {
    const files = await fs.promises.readdir(uploadDirFiles);
    const xlsxFile = files.find(file => file.endsWith('.xlsx'));
    
    if (!xlsxFile) {
      console.log('No Excel file found in the files folder.');
      return; 
    }
    await workbook.xlsx.readFile(filePath);
    const formattedData = []; 

    workbook.eachSheet((worksheet, sheetNumber) => {
      const targetColumn = 'I'; 
      const column = worksheet.getColumn(targetColumn);

      if (!column) {
        console.log(`Sheet ${sheetNumber + 1} - Column ${targetColumn}: Not found`);
        return; 
      }

      const values = column.values.slice(2); 

      values.forEach((value, rowNumber) => {

        if (moment(value, moment.ISO_8601, true).isValid()) {
          formattedValue = moment(value).format('YYYY-MM-DD');
        } else {
          formattedValue = moment.parseZone(value, 'ddd MMM DD YYYY HH:mm:ss [GMT]Z').format('YYYY-MM-DD');
        }

        formattedData.push({
          sheetNumber: sheetNumber + 1,
          rowNumber: rowNumber + 2, // Adjust for 1-based indexing if needed
          originalValue: value,
          formattedValue: formattedValue,
        });
      });
    });
    checkBirthdays(formattedData);
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

function checkBirthdays(data) {
  // const todaysDate = moment.utc().format('YYYY-MM-DD'); // Get today's date in UTC (YYYY-MM-DD)
  const upcomingBirthdays = data.filter(
    (person) => {
      // Assuming 'formattedValue' in 'person' object contains the formatted date
      const birthday = moment(person.formattedValue); // Parse birthday using formatted date
      const birthdayMonth = birthday.month()+1;
      const birthdayDay = birthday.date();

      const currentMonth = moment.utc().month()+1;
      const currentDay = moment.utc().date();
      // const nextMonth = (currentMonth + 2) % 12; // Adjust for wrapping around December
      return birthdayMonth === currentMonth && birthdayDay === currentDay;
    });

  upcomingBirthdays.forEach((person) => {
    getNameByRow(person.rowNumber);
    console.log(`Row ${person.rowNumber}: ${person.formattedValue}\n`); 
  });
}

async function getNameByRow(rowNumber) {
    try {
      let name = '';
      await workbook.eachSheet(async (worksheet) => {
        const targetColumn = 'J'; 
        if (rowNumber < 1 || rowNumber > worksheet.actualRowCount) {
          console.error(`Invalid row number: ${rowNumber}. Row number must be between 1 and ${worksheet.actualRowCount}`);
          return; 
        }
        const value = worksheet.getRow(rowNumber).getCell(targetColumn).value;
        if (value) {
          console.log(value);
          name = value;
          birthdayDate[rowNumber] = { name };
        } else {
          console.log(`Not found`);
        }
      });
      return name;
    } catch (error) {
      console.error("Error reading file:", error);
    }
}

export default {readAndFormatColumnI, birthdayDate}
