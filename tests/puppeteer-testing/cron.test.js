const { getNewVideo } = require("./youtube-handling");
const path = require("path");

describe("Production Verification Testing", () => {
  beforeAll(async () => {
    page.on("console", (message) =>
      console.info(
        `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
      )
    );
    await getNewVideo();
    console.info("Loaded Video");
    await page.goto("https://videotranscode.space/", {
      waitUntil: "domcontentloaded",
    });
    console.info("Navigated to Url");
    await page.setDefaultNavigationTimeout(50000);
    await page.waitFor(10000);

    // jest.setTimeout(10000); // change timeout to 10 seconds
  });

  it("Load Page", async () => {
    try {
      const data = await page.evaluate(() => {
        const header = document.querySelector(".header").innerHTML;
        return header;
      });
      //   console.info(data);
      expect(data.includes("Browser Based Video Transcoder")).toBeTruthy;
    } catch (err) {
      console.error("Didn't load");
      process.exit(1);
    }
  });
  it("Load Video Into Dropzone", async () => {
    const fileInput = await page.$("input[type=file]");
    await fileInput.uploadFile(path.join(__dirname, "./test-video.mp4"));
    await page.screenshot({ path: "uploaded.png" });
  });
  it("Choose Codec and Format", async () => {
    const data = await page.evaluate(() => {
      const output = {};
      const header = document.querySelector(".header").innerHTML;
      const optionsList = document.querySelector(".options-list");
      output.optionsList = optionsList;
      output.header = header;
      //   const currentChildIndex = Math.floor(
      //     Math.random() * optionsList.childElementCount
      //   );
      //   const chosenFormat = optionsList.children[currentChildIndex]; // Wrapper Element
      //   const aTag = chosenFormat.getElementsByTagName("a")[0];
      //   aTag.click();
      //   const className = chosenFormat.firstElementChild.className;
      //   output.formatCheck = className.includes("active");
      return output;
    });
    console.info(data);
    expect(data.formatCheck).toBeTruthy();
  });
});
