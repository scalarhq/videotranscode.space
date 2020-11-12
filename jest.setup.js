jest.setTimeout(25000000) // in milliseconds
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
