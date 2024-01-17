// const axios = require("axios");
const fs = require("fs");

/* const stravaClientSecret = "578c7d816b7e7897edbf885b66204c674738ff42";
const refreshToken = "f64bf66889139099a23d739af8eee2919198f74d";
const stravaApiUrl = "https://www.strava.com/api/v3/athlete"; */

//get stats/id
let accessToken = "ae1a7b18199aededc6caa1b87b41bb54566d67a6";
async function fetchData(apiEndpoint, accessToken) {
  try {
    // Construct headers with Authorization
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make a GET request using the fetch API
    const response = await fetch(apiEndpoint, { headers });

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error; // Rethrow the error to handle it at the calling site if needed
  }
}

const AthID = 129626941;
const apiEndpoint = `https://www.strava.com/api/v3/athletes/${AthID}/stats`;

// function stores data
function storeDataToFile(data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON format with indentation
  fs.appendFileSync("data.json", jsonData, "utf-8");
  console.log("Data has been stored in data.json");
}

async function main() {
  try {
    const data = await fetchData(apiEndpoint, accessToken);
    storeDataToFile(data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
// run the app
main();

// Call the fetchData function
/* fetchData(apiEndpoint, accessToken)
  .then((data) => {
    // Handle the fetched data
    console.log("Fetched data:", data);
  })
  .catch((error) => {
    // Handle errors
    console.error("Error:", error.message);
  }); */

/* function refreshAccessToken(clientSecret, refreshToken) {
  const refreshUrl = "https://www.strava.com/api/v3/oauth/token";
  const refreshPayload = {
    client_id: "12273039", // Add your client ID if required
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  const response = axios.post(refreshUrl, null, {
    params: refreshPayload,
  });
  return response.data.access_token;
} */

// Check if access token is still valid
/* const headers = { Authorization: `Bearer ${accessToken}` };

makeStravaApiRequest(stravaApiUrl, headers)
  .then((response) => {
    if (response.status === 401) {
      // Unauthorized, token may have expired
      // Refresh the access token
      return refreshAccessToken(stravaClientSecret, refreshToken);
    } else {
      // Print the response
      console.log(response.data);
      return null;
    }
  })
  .then((newResponse) => {
    if (newResponse) {
      // Make the request again with the new access token
      accessToken = newResponse.data.access_token;
      headers["Authorization"] = `Bearer ${accessToken}`;
      return makeStravaApiRequest(stravaApiUrl, headers);
    }
  })
  .then((finalResponse) => {
    if (finalResponse) {
      // Print the final response
      console.log(finalResponse.data);
    }
  })
  .catch((error) => {
    console.error(error.message);
  });
 */
