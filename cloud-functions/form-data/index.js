const gSheet = require('google-spreadsheet');

const axios = require('axios');

const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const secrets = require('./secrets');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json()); // Using Body Parser
app.use(cors()); // Cors to Handle Url Authentication
// const server = app.listen(5000); // Set Port

const sheetUrl = secrets.googleSheetsUrl; // Google Spreadsheet ID

const webHookUrl = secrets.discordWebhookUrl; // Discord Webhook URL

const credentials = {
  clientEmail: secrets.gcpServiceAccountCredentials.client_email,
  privateKey: secrets.gcpServiceAccountCredentials.private_key,
};

const doc = new gSheet.GoogleSpreadsheet(sheetUrl);

const updateSheet = async (newRow) => {
  await doc.useServiceAccountAuth({
    client_email: credentials.clientEmail,
    private_key: credentials.privateKey,
  });

  await doc.loadInfo(); // loads document properties and worksheets

  console.log(doc.title);

  const mainSheet = await doc.sheetsByIndex[0];
  // console.log(mainSheet);
  console.log(mainSheet.title);
  console.log(mainSheet.rowCount);

  await mainSheet.addRow(newRow);
};

app.get('/hello', (_, res) => {
  res.send('Hello World');
});

app.post('/', async (req, res) => {
  const { data } = req.body;
  // console.log(req.body, data);
  const newRow = {
    inputFileData: data.inputFileData,
    encodeTime: data.encodeTime,
    threads: data.threads,
    configuration: data.configuration,
    browser: data.browser,
    os: data.os,
    navigator: data.navigator,
    tester: data.tester ? data.tester : 'null',
    created_at: new Date().toISOString(),
  };
  console.log(newRow);
  try {
    await updateSheet(newRow);
  } catch (err) {
    console.log('Failed to update sheet ', err);
    res.status(200).json({
      status: false,
      error: err,
    });
    return;
  }
  const embeds = [
    {
      fields: [
        {
          name: 'Input File Data',
          value: JSON.stringify(data.inputFileData),
        },
        {
          name: 'Encode Time',
          value: JSON.stringify(data.encodeTime),
        },
        {
          name: 'Threads',
          value: JSON.stringify(data.threads),
        },
        {
          name: 'Configuration',
          value: JSON.stringify(data.configuration),
        },
        {
          name: 'Browser',
          value: JSON.stringify(data.browser),
        },
        {
          name: 'Os',
          value: JSON.stringify(data.os),
        },
        {
          name: 'Navigator',
          value: JSON.stringify(data.navigator),
        },
      ],
    },
  ];

  const webhookConfig = {
    username: 'Modfy Bot',
    avatar_url: 'https://modfy.video/images/logo.png',
    content: 'New Submission',
    embeds,
  };
  console.log(JSON.stringify(webhookConfig));
  try {
    await axios.post(webHookUrl, webhookConfig);
  } catch (err) {
    console.log('Failed here!');
    res.status(200).json({
      status: false,
      error: err,
    });
    return;
  }

  res.status(200).json({
    status: true,
  });
});

exports.handler = app;
// const server = app.listen(3000);
