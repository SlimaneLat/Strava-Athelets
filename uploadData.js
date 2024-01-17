const { google } = require("googleapis");
const { axios } = require("axios");

// Replace these values with your own
const spreadsheetId = "1G8W0h8axQLWt-2UmABL72j4y1et3vCB6BpQvg1OUTe0";
const credentials = require("./strava-test-credentials.json");
const range = "Sheet1"; // Update the sheet name or range as needed

// Function to authenticate and upload data
async function uploadData(auth) {
  try {
    // Your fake data
    const fakeData = [
      ["John", 25, "Engineer"],
      ["Jane", 30, "Designer"],
      // Add more rows as needed
    ];

    // Values to be written
    const resource = {
      values: fakeData,
    };

    // Update values in the spreadsheet
    await appendDataToSheet(auth, spreadsheetId, range, resource);

    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error.message);
  }
}

// Function to authorize with credentials
async function authorize(credentials) {
  console.log("test");
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  console.log("oAuth2Client", oAuth2Client);
  
  try {
    const token = await getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(token);
    // Continue with whatever you need to do after authentication
  } catch (error) {
    console.error('Authorization error:', error);
  }
}

// Function to append data to a sheet
async function appendDataToSheet(auth, spreadsheetId, range, resource) {
  const sheetsAPI = google.sheets({ version: "v4", auth });
  const sheets = sheetsAPI.spreadsheets.values;

  // Check if resource.values is an array and not empty
  if (!Array.isArray(resource.values) || resource.values.length === 0) {
    throw new Error("Invalid data array provided.");
  }

  const request = {
    spreadsheetId,
    range: `${range}!A1`, // Assuming data starts from A1
    valueInputOption: "RAW",
    resource: {
      values: resource.values,
    },
  };

  try {
    const response = await sheets.append(request);

    if (response.status !== 200) {
      throw new Error(`Failed to append data. Status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Error appending data: ${error.message}`);
  }
}

function getAccessToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('Authorize this app by visiting this URL:', authUrl);

    // For simplicity, you may assume that the user enters the code manually
    const code = '...'; // Replace with the actual authorization code

    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token:', err);
        reject(err);
        return;
      }

      console.log('Token obtained successfully:', token);
      resolve(token);
    });
  });
}

module.exports = { uploadData };