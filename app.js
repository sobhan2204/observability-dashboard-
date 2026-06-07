const express = require("express");
const client = require("prom-client"); // this is for Prometheus metrics

const app = express();
const PORT = 3030;

// Create default Prometheus metrics
client.collectDefaultMetrics();

// Counter for endpoint executions
const requestCounter = new client.Counter({
  name: "endpoint_requests_total",
  help: "Total number of endpoint executions",
  labelNames: ["endpoint"],
  buckets: [1, 5, 10, 50, 100, 500, 1000]
});

// Histogram for execution time
const executionTime = new client.Histogram({
  name: "endpoint_execution_time_ms",
  help: "Execution time in milliseconds",
  labelNames: ["endpoint"],
  buckets: [1, 5, 10, 50, 100, 500, 1000]
});

function countToNumber(num) {
  for (let i = 1; i <= num; i++) {
    // Just counting(to able able to get different output for different numbers)
  }
}

app.get("/", (req, res) => {
    res.send("KISI DIN CODE PUSH KARTE KRATE MAI KHUD LIFE SE PUSH HO JAUNGA :)");
});

app.get("/fast", (req, res) => {
  const randomNum = Math.floor(Math.random() * 100) + 1;

  const start = Date.now();
  countToNumber(randomNum);
  const duration = Date.now() - start;

  requestCounter.inc({ endpoint: "fast" });
  executionTime.observe({ endpoint: "fast" }, duration);

  res.send(
    `Counted to ${randomNum}. Time taken: ${duration} ms`
  );
});

app.get("/slow", (req, res) => {
  const randomNum =
    Math.floor(Math.random() * (200000000 - 100000000 + 1)) + 100000000;

  const start = Date.now();
  countToNumber(randomNum);
  const duration = Date.now() - start;

  requestCounter.inc({ endpoint: "slow" });
  executionTime.observe({ endpoint: "slow" }, duration);

  res.send(
    `Counted to ${randomNum}. Time taken: ${duration} ms`
  );
});

app.get("/invalid", (req, res) => {
  const value = "ABC";

  const start = Date.now();

  if (isNaN(value)) {
    const duration = Date.now() - start;

    requestCounter.inc({ endpoint: "invalid" });
    executionTime.observe({ endpoint: "invalid" }, duration);

    return res.status(400).send(
      `Invalid input: "${value}". Numbers were invalid.`
    );
  }
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});