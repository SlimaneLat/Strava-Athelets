const express = require('express');
const { google } = require('googleapis');
const credentials = require("./strava-test-credentials.json");
const { uploadData } = require('./uploadData.js');
const fs = require('fs').promises;

const app = express();
const port = 3000;



const oAuth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

app.get('/', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await uploadData(oAuth2Client)  
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    // Save tokens to a file
    await saveTokensToFile(tokens);

    res.send('Authentication successful. You can close this tab now.');
  } catch (error) {
    console.error('Error obtaining tokens:', error);
    res.status(500).send('Error obtaining tokens. Please try again.');
  }
});

app.get('/process', async (req, res) => {
    loadTokensFromFile()
    await uploadData(oAuth2Client)  
    res.send('Authentication successful. You can close this tab now.');
  });



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function saveTokensToFile(tokens) {
    try {
      // Specify the path where you want to save the tokens
      const filePath = 'tokens.json';
      
      // Write tokens to the file
      await fs.writeFile(filePath, JSON.stringify(tokens));
      
      console.log('Tokens saved to:', filePath);
    } catch (error) {
      console.error('Error saving tokens to file:', error);
      throw error;
    }
}

async function loadTokensFromFile() {
    try {
      const filePath = 'tokens.json';
      const data = await fs.readFile(filePath);
      const tokens = JSON.parse(data);
      oAuth2Client.setCredentials(tokens);
    } catch (error) {
      console.error('Error loading tokens from file:', error);
    }
}