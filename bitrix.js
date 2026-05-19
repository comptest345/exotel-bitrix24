const axios = require("axios");
const webhook = process.env.BITRIX_WEBHOOK;

async function call(method, params = {}) {
  const response = await axios.post(`${webhook}${method}.json`, params);
  return response.data.result;
}

async function findContact(phone) {
  const res = await call("crm.contact.list", {
    filter: { PHONE: phone },
    select: ["ID", "NAME"]
  });
  return res.length ? res[0] : null;
}

async function createLead(phone) {
  return await call("crm.lead.add", {
    fields: {
      TITLE: `Incoming Call - ${phone}`,
      PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }]
    }
  });
}

module.exports = { call, findContact, createLead };
