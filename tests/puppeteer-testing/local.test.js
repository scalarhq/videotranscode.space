const finalhandler = require("finalhandler");
const path = require("path");
const http = require("http");
const serveStatic = require("serve-static");
let server;

describe("Local Build Testing", () => {
  beforeAll(async () => {
    // Serve up public/ftp folder
    const serve = serveStatic(path.join(__dirname, "../../public"), {
      index: ["index.html", "index.htm"],
    });

    // Create server
    server = http.createServer(function onRequest(req, res) {
      serve(req, res, finalhandler(req, res));
    });

    // Listen
    server.listen(3000);
    const loadPromises = await Promise.all([
      page.goto("http://localhost:3000/", {
        waitUntil: "domcontentloaded",
      }),
      page.setDefaultNavigationTimeout(0),
      page.setDefaultTimeout(0),
    ]);
    await page.waitFor(10000);
  });
  afterAll(() => {
    server.close();
  });
  it("Load Page", async () => {
    await page.waitForFunction(() => document.querySelector(".header"));
    await page.waitFor(500);
    try {
      const data = await page.evaluate(() => {
        const header = document.querySelector(".header").innerHTML;
        return header;
      });
      expect(data.includes("Browser Based Video Transcoder")).toBeTruthy;
      console.info("Loaded Page!");
    } catch (err) {
      console.error("Didn't load");
      process.exit(1);
    }
  });
  it("Load Video Into Dropzone", async () => {
    const filePath = path.join(__dirname, "./localTest.mkv");
    console.info("File Path", filePath);
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".dz-button").click()),
    ]);
    await fileChooser.accept([filePath]);
    console.info("Loaded Video");
  });
  it("Choose Codec and Format", async () => {
    await page.waitFor(2000);
    await page.waitForFunction(() => document.querySelector(".options-list"));
    const data = await page.evaluate(() => {
      const output = {};
      const header = document.querySelector(".header").innerHTML;
      output.header = header;
      const optionsList = document.querySelector(".options-list");
      const currentChildIndex = Math.floor(
        Math.random() * optionsList.childElementCount
      );
      const chosenFormat = optionsList.children[currentChildIndex]; // Wrapper Element
      chosenFormat.setAttribute("id", "current-format");
      output.chosenFormat = chosenFormat.outerHTML;
      const aTag = chosenFormat.getElementsByTagName("a")[0];
      aTag.click();
      return output;
    });
    await page.waitFor(500);
    const verify = await page.evaluate(() => {
      const chosenFormat = document.getElementById("current-format");
      const firstChild = chosenFormat.firstElementChild;
      const className = firstChild.className;
      const formatCheck = className.includes("active");
      console.log(chosenFormat, firstChild, className);
      let firstChildOutput = firstChild.outerHTML;
      return { firstChildOutput, className, formatCheck };
    });
    expect(verify.formatCheck).toBeTruthy();
  });
  it("Submit Video", async () => {
    await page.evaluate(() =>
      document.querySelector(`[data-testid="submit-button"]`).click()
    );
    await page.waitForFunction(() => document.querySelector(".progress-bar"));
  });
  it("Download Button", async () => {
    await page.waitForFunction(() =>
      document.querySelector(`[data-testid="download-button"]`)
    );
    await page.evaluate(() =>
      document.querySelector(`[data-testid="download-button"]`).click()
    );
    await page.waitFor(2000);
  });
});
