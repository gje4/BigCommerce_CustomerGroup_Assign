"use strict";
const request = require("request-promise");
var _ = require("lodash");

async function addToGroup(orderData, customer_id) {
  //update customer object to the customer group you want
  const optionsCustomer = {
    method: "PUT",
    uri: `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/customers`,
    headers: {
      accept: "application/json",
      "X-Auth-Client": process.env.BC_CLIENT,
      "X-Auth-Token": process.env.BC_TOKEN
    },
    body: [
      {
        id: customer_id,
        customer_group_id: 70
      }
    ],
    json: true
  };

  var updateGroup = await request(optionsCustomer);
  return updateGroup;
}

async function getOrderData(orderDataId) {
  const options = {
    method: "GET",
    uri: `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v2/orders/${orderDataId}`,
    headers: {
      accept: "application/json",
      "X-Auth-Client": process.env.BC_CLIENT,
      "X-Auth-Token": process.env.BC_TOKEN
    }
  };
  var orderData = await request(options);
  console.log("order data", orderData);
  return orderData;
}

async function getOrderDataProducts(orderDataId) {
  const options = {
    method: "GET",
    uri: `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v2/orders/${orderDataId}/products`,
    headers: {
      accept: "application/json",
      "X-Auth-Client": process.env.BC_CLIENT,
      "X-Auth-Token": process.env.BC_TOKEN
    }
  };
  var orderData = await request(options);
  return orderData;
}

module.exports.members = async event => {
  let membershipData = JSON.parse(event.body);
  //get order order data
  const orderDataRaw = await getOrderData(membershipData.data.id);
  const orderData = JSON.parse(orderDataRaw);
  const orderItemsRaw = await getOrderDataProducts(membershipData.data.id);
  const orderItemsData = JSON.parse(orderItemsRaw);
  //if it is a memebership udate customers
  if (orderItemsData[0].sku == 12311) {
    //update customers
    const updateCustomer = await addToGroup(orderData, orderData.customer_id);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify("handle customers")
  };
};
