const axios = require("axios");

async function makeCall(to) {
  const url =
    `${process.env.EXOTEL_BASE}/v1/Accounts/${process.env.EXOTEL_SID}/Calls/connect`;

  const response = await axios.post(
    url,
    new URLSearchParams({
      From: process.env.EXOTEL_CALLER_ID,
      To: to,
      CallerId: process.env.EXOTEL_CALLER_ID
    }),
    {
      auth: {
        username: process.env.EXOTEL_API_KEY,
        password: process.env.EXOTEL_API_TOKEN
      }
    }
  );

  return response.data;
}

module.exports = { makeCall };
