import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendBirthdayEmails(birthdays) {
    try {
      const filePathTemplate = path.join(__dirname, '..', 'templates', 'template2.txt');
      const contentTemplate = fs.readFileSync(filePathTemplate, 'utf-8');
  
      const tempDatabasePath = path.join(__dirname, 'files', 'tempDatabase.json');
      const tempDatabase = JSON.parse(fs.readFileSync(tempDatabasePath, 'utf-8'));
  
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'programmer.bsu@gmail.com',
          pass: 'dejs rirr udfh mgwu',
        },
      });
      if(birthdays != null){
        Object.values(birthdays).forEach(val => {
            const name = val.name;
      
            const personData = tempDatabase.find(person => person.name === name);
            const imageUrl = personData ? personData.imageUrl : ''; 
      
            const replacements = {
              fullName: name,
              imageUrl: imageUrl
            };
      
            const emailBody = replacePlaceholders(contentTemplate, replacements);
      
            const mailOptions = {
              from: 'programmer.bsu@gmail.com',
              to: 'maryam.khanmadov@gmail.com', 
              subject: `Happy Birthday, ${name}! 🎉`,
              html: emailBody,
            };
      
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(`Error sending email to ${name}:`, error);
              } else {
                console.log(`Birthday email sent to ${name}: ${info.response} - ${imageUrl}`);
              }
            });
          });

        }
        else{
            console.log("No birthdays today!send")
        }
    } catch (error) {
      console.error('Error sending birthday emails:', error);
    }
}

function replacePlaceholders(template, replacements) {
    return template.replace(/{{(\w+)}}/g, (match, key) => {
      return replacements[key] || match;
    });
}

export default sendBirthdayEmails;