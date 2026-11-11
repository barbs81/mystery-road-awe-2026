import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const port = 3001;
const dataDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
);
const resources = {
  "/api/case": "case.json",
  "/api/evidence": "evidence.json",
  "/api/people": "people.json",
  "/api/locations": "locations.json",
  "/api/timeline": "timeline.json",
};

function getDelay(requestUrl) {
  const requestedDelay = Number(requestUrl.searchParams.get("delay") ?? "0");
  if (!Number.isFinite(requestedDelay) || requestedDelay < 0) {
    return 0;
  }

  return Math.min(requestedDelay, 10000);
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(
    request.url ?? "/",
    `http://${request.headers.host ?? "localhost"}`,
  );

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Only GET requests are supported." });
    return;
  }

  const fileName = resources[requestUrl.pathname];
  if (!fileName) {
    sendJson(response, 404, { error: "Resource not found." });
    return;
  }

  await wait(getDelay(requestUrl));

  if (requestUrl.searchParams.get("error") === "1") {
    sendJson(response, 500, {
      error: "Simulated server error for Exercise 6 testing.",
    });
    return;
  }

  try {
    const fileContents = await readFile(join(dataDirectory, fileName), "utf8");
    sendJson(response, 200, JSON.parse(fileContents));
  } catch (error) {
    console.error(`Could not serve ${fileName}:`, error);
    sendJson(response, 500, { error: "The resource could not be loaded." });
  }
});

server.listen(port, () => {
  console.log(`Investigation API listening at http://localhost:${port}`);
});
