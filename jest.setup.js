jest.setTimeout(150000); // in milliseconds
jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
