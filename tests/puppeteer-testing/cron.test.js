const { getNewVideo } = require("./youtube-handling");
const path = require("path");

let duration = "";

describe("Production Verification Testing", () => {
  beforeAll(async () => {
    // page.on("console", (message) =>
    //   console.info(
    //     `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
    //   )
    // );
    const data = await getNewVideo();

    console.info("Loaded Video of", data);
    duration = data.duration;
    await page.goto("https://videotranscode.space/", {
      waitUntil: "domcontentloaded",
    });
    console.info("Navigated to Url");
    await page.setDefaultNavigationTimeout(0);
    await page.setDefaultTimeout(0);
    await page.evaluate(() => {
      document.addEventListener("click", (e) => console.info(e.target));
    });
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
      console.info("Loaded Page!");
    } catch (err) {
      console.error("Didn't load");
      process.exit(1);
    }
  });
  it("Load Video Into Dropzone", async () => {
    // const fileInput = await page.$("input[type=file]");
    const filePath = path.join(__dirname, "./test-video.mp4");
    console.info("File Path", filePath);
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".dz-button").click()),
    ]);
    await fileChooser.accept([filePath]);
    console.info("Loaded Video");
    // await page.evaluate(({ filePath }) => alert(filePath), { filePath });
    // await page.screenshot({ path: "uploaded.png" });
  });
  it("Choose Codec and Format", async () => {
    await page.waitFor(2000);
    await page.waitForFunction(() => document.querySelector(".options-list"));
    // await page.waitFor(".options-list");
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
    // console.info("Data is", data);
    await page.waitFor(500);
    // const { chosenFormat } = data;
    const verify = await page.evaluate(() => {
      const chosenFormat = document.getElementById("current-format");
      const firstChild = chosenFormat.firstElementChild;
      const className = firstChild.className;
      const formatCheck = className.includes("active");
      console.log(chosenFormat, firstChild, className);
      let firstChildOutput = firstChild.outerHTML;
      return { firstChildOutput, className, formatCheck };
    });
    // console.info("Verification is", verify);
    expect(verify.formatCheck).toBeTruthy();
  });
  // it("Compress Test?", async () => {
  //   const compressing = Math.random > 0.5 ? true : false;
  //   if (compressing) {
  //     await page.evaluate(() => {
  //       const slider = document.querySelector(".slider");
  //       const value = Math.floor(Math.random() * (100 - 1) + 1);
  //       slider.value = value;
  //     });
  //   }
  // });
  it("Add Tester Tag", async () => {
    await page.evaluate((duration) => {
      document.getElementById("tester").value = duration
        ? duration
        : "Duration Not Found From Tester";
    }, duration);
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
