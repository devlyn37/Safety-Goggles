import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
const config = { headers: { "X-API-KEY": process.env.OS_API_KEY } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  let url = `https://api.opensea.io/api/v1/${query.slug}?`;
  const keys = Object.keys(query);
  keys.forEach((key: string, i: number) => {
    if (key === "slug") return;
    url += `${key}=${query[key]}&`;
  });

  url = url.slice(0, -1);

  try {
    const response = await axios.get(url, config);
    res.status(response.status).json(response.data);
  } catch (e) {
    console.log(e);
    const status = e.response.status ?? 500;
    res.status(status).end();
  }
}
