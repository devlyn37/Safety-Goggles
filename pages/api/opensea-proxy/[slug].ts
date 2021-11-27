import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
const config = { headers: { "X-API-KEY": process.env.OS_API_KEY } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let baseUrl = `https://api.opensea.io/api/v1/`;

  if (!req.url) {
    return res.status(400).end();
  }

  const route = "/api/opensea-proxy/";
  const url = baseUrl + req.url.slice(route.length);

  try {
    const response = await axios.get(url, config);
    res.status(response.status).json(response.data);
  } catch (e) {
    const status = e.response.status ?? 500;
    res.status(status).end();
  }
}
