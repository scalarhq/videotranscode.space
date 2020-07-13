jest.setTimeout(250000); // in milliseconds
jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
