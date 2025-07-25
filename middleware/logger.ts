import { NextFunction, Request, Response } from "express";

interface ExtendedResponse extends Response {
  responseData?: any;
}

export function logger(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  // Shows the method, protocol, host and url
  console.log(`${req.method} ${req.protocol}://${req.hostname}${req.url}`);

  // Shows the body
  if (
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length > 0
  ) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`Query: ${JSON.stringify(req.query)}`);
  }

  if (req.params && Object.keys(req.params).length > 0) {
    console.log(`Params: ${JSON.stringify(req.params)}`);
  }

  // Store original methods
  const originalJson = res.json;
  const originalSend = res.send;

  // Override res.json
  res.json = function (body: any) {
    res.responseData = body;
    return originalJson.call(this, body);
  };

  // Override res.send
  res.send = function (body: any) {
    res.responseData = body;
    return originalSend.call(this, body);
  };

  // Shows the response status and data
  res.on("finish", () => {
    console.log(`Response status: ${res.statusCode}`);
    console.log(
      `Response status message: ${JSON.stringify(res.statusMessage)}`
    );
    if (res.responseData !== undefined) {
      console.log(`Response data: ${JSON.stringify(res.responseData)}`);
    }
  });

  // Make a next line
  console.log("");

  // Pass the request to the next middleware
  next();
}
