const { google } = require("googleapis");
const { axios } = require("axios");

// Replace these values with your own
const spreadsheetId = "1G8W0h8axQLWt-2UmABL72j4y1et3vCB6BpQvg1OUTe0";
const credentials = require("./strava-test-credentials.json");
const range = "Sheet1"; // Update the sheet name or range as needed

// Function to authenticate and upload data
async function uploadData() {
  try {
    const auth = await authorize(credentials);
    console.log("auth" + auth);

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
  console.log("oAuth2Client" + oAuth2Client);

  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    oAuth2Client.getToken((err, token) => {
      if (err) return reject(err);
      oAuth2Client.setCredentials(token);
      resolve(oAuth2Client);
    });
  });
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

// Call the function to upload data
uploadData();
