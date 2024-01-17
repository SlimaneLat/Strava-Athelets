const { google } = require("googleapis");
const keys = require("./strava-test-credentials.json");

const client = new google.auth.JWT(keys.web.client_email, null, keys.web.key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

client.authorize(function (err, tokens) {
  gsrun(client);
});
async function gsrun(cl) {
  const gsapi = google.sheets({ version: "v4", auth: cl });

  const opt = {
    spreadsheetId: "1G8W0h8axQLWt-2UmABL72j4y1et3vCB6BpQvg1OUTe0",
    range: "Data!A1:B5",
  };

  let data = await gsapi.spreadsheets.values.get(opt);
  console.log(data.data.values);
}
