import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import cron  from 'node-cron';
import bodyParser from 'body-parser';
import {upload, uploadFiles, uploadDirFiles, uploadImage, uploadDir, __dirname} from '../src/upload.js';
import readTemplateFile from '../src/readTemplate.js'
import {parseExcelAndSaveChangesToJson} from '../src/parseExcel.js'
import { birthdayDate, readAndFormatColumnI} from '../src/readAndChaeckBirthday.js'
import sendBirthdayEmails from '../src/sendBirthdayEmail.js'

const app = express();
// const port = 3000;

app.use(
  cors({
    origin: 'https://email-automation-hr.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true })); // Use express middleware to parse multi-part form data
app.use(express.json());

app.post('/api/uploadFile',
  (req, res, next) => {
    uploadFiles.single('file')(req, res, async function (err) {
      await parseExcelAndSaveChangesToJson();
      console.log(req.body);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: 'File size exceeds the limit.',
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const filePath = path.join(uploadDirFiles, 'PROSOL_workers3.xlsx');
      await parseExcelAndSaveChangesToJson(filePath); // Process the file and update JSON
      res.status(200).json({ message: 'File Uploaded and Processed Successfully' });
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ message: 'Error processing file' });
    }
  }
);

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/uploadImage', uploadImage.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const { name } = req.body;
  console.log(req.body.imageUrl)
  const namesFilePath = path.join(__dirname, '/files/tempDatabase.json');
  console.log("namesFILEPath" + namesFilePath + "dirname" + __dirname);
  fs.readFile(namesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading names file:', err);
      return res.status(500).send('Error reading names file');
    }
    const names = JSON.parse(data);
    const updatedNames = names.map((item) =>
      item.name === name ? { ...item, imageUrl: req.body.imageUrl } : item
    );
    
    fs.writeFile(namesFilePath, JSON.stringify(updatedNames, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error updating names file:', err);
        return res.status(500).send('Error updating names file');
      }
      res.json({ filename: req.body.imageUrl });
    });
  });
});

app.get('/api/tempDatabase', async (req, res) => {
  fs.readFile(path.join(__dirname, '/files/tempDatabase.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading names file:', err, __dirname);
      res.status(500).send('Error reading names file');
      return;
    }try {
        const jsonData = JSON.parse(data);
        jsonData;
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        console.error('Invalid JSON data:', data);
      }
    res.json(JSON.parse(data));
  });
});

app.get('/api/templates', (req, res) => {
  const templatesDir = uploadDir;
  fs.readdir(templatesDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
      return;
    }
    const templates = files.map((file) => {
      const filePath = path.join(templatesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return { name: file, content };
    })
    res.json(templates);
  });
});

app.post('/api/send-email', upload.single('image'), async (req, res) => {
  const { to, cc, subject, imageUrl, templateName, ...replacements } = req.body;
  const filePath = path.join(__dirname, '..', 'templates', templateName);

  try {
    const htmlContent = await readTemplateFile(filePath);

    let htmlContentWithValues = htmlContent;
    if (req.file) {
      htmlContentWithValues = htmlContentWithValues.replaceAll('{{image}}', req.file.filename);
    }
    if (imageUrl) {
      htmlContentWithValues = htmlContentWithValues.replaceAll('{{imageUrl}}', imageUrl);
    }
    for (const [placeholder, value] of Object.entries(replacements)) {
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
      const placeholderRegex = new RegExp(`{{${escapedPlaceholder}}}`, 'g');
      htmlContentWithValues = htmlContentWithValues.replace(placeholderRegex, value);
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'programmer.bsu@gmail.com',
        pass: 'dejs rirr udfh mgwu',
      },
    });

    let mailOptions = {
      from: 'programmer.bsu@gmail.com',
      to: to,
      cc: cc,
      subject: subject,
      html: htmlContentWithValues,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', res});
  }
});

//*/30 * * * * *
cron.schedule('0 12 * * *', async () => {
  await readAndFormatColumnI();
  console.log('Checking for upcoming birthdays...');
  try {
    let count = await Object.keys(birthdayDate).length;
    if (count > 0) {
      console.log('Sending birthday emails...');
      await sendBirthdayEmails(birthdayDate);
    } else {
      console.log('No birthdays today.');
    }
  } catch (error) {
    console.error('Error occurred while reading and formatting Excel file:', error);
  }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(() => {
  console.log(`Server running at https://email-automation-hr.vercel.app`);
});
export default birthdayDate;
