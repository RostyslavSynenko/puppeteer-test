import express from "express";
import puppeteer from "puppeteer";

import path from "path";
import fs from "fs";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.resolve(path.resolve(), "index.html"));
});

app.get("/test", async (req, res) => {
  const puppeteerStart = async function () {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--enable-thread-instruction-count"],
    });
    const page = await browser.newPage();

    await page.tracing.start({ path: "trace.json" });
    await page.goto("https://google.com/");
    await page.tracing.stop();
    await browser.close();

    const traceData = fs.readFileSync("trace.json").toString();

    if (traceData.includes('"ticount":')) {
      res.json({ message: "ticount support is enabled!"});
    } else {
      res.json({ message: "ticount support is disabled!"});
    }
  };

  puppeteerStart();
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
