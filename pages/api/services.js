import axios, {HttpStatusCode} from "axios";

export default async function handler(
  req,
  res
) {
  if (req.method === "POST") {
    const endpoint = req.query.endpoint;
    const response = await axios.post(
      `${process.env.LEXURGY_SERVICES_URL}/${endpoint}`,
      req.body,
      {
        headers: { ...req.headers, Authorization: process.env.LEXURGY_SERVICES_API_KEY },
        // Don't reject the promise on an HTTP error code
        // That's the frontend's job!
        validateStatus: () => true,
      }
    );
    res.status(response.status).json(response.data);
  } else if (req.method === "GET") {
    const endpoint = req.query.endpoint;
    const response = await axios.get(
      `${process.env.LEXURGY_SERVICES_URL}/${endpoint}`,
      {
        headers: { ...req.headers, Authorization: process.env.LEXURGY_SERVICES_API_KEY },
        // Don't reject the promise on an HTTP error code
        // That's the frontend's job!
        validateStatus: () => true,
      }
    );
    res.status(response.status).json(response.data);
  } else {
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .setHeader("allow", "POST")
      .json("");
  }
}
