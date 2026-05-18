import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

app.get("/health", (c) => {
  return c.json({ status: "ok", version: "0.1.0" });
});

app.get("/v1/usage", (c) => {
  return c.json({
    queries_today: 0,
    queries_month: 0,
    rate_limit: 10,
    plan: "free",
  });
});

app.get("/v1/transfers", (c) => {
  return c.json({
    data: [],
    total: 0,
    message: "Connect KiteIndex for live data",
  });
});

app.get("/v1/bridges", (c) => {
  return c.json({
    data: [],
    total: 0,
    message: "Connect KiteIndex for live data",
  });
});

app.get("/v1/staking", (c) => {
  return c.json({
    validators: [],
    delegators: [],
    message: "Connect KiteIndex for live data",
  });
});

export default app;
