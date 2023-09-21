import * as fs from 'fs';
import { URLFileHandler, module } from '../src/fileio';

// Mock fs.existsSync to return true for testing
jest.mock('fs');
(fs.existsSync as jest.Mock).mockReturnValue(true);

describe('URLFileHandler', () => {
  it('should return 1 and log an error if the file does not exist', () => {
    // Mock fs.existsSync to return false for this test case
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    // Mock console.log to capture its output
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = URLFileHandler('nonexistentFile.txt');

    expect(result).toEqual(1);
    expect(consoleLogSpy).toHaveBeenCalledWith('Error: file does not exist at provided path');

    // Restore console.log
    consoleLogSpy.mockRestore();
  });

  it('should process URLs correctly', () => {
    const fileContents = 'github.com/example\nnpmjs.com/package\nexample.com\n';
    // Mock fs.readFileSync to return fileContents for this test case
    (fs.readFileSync as jest.Mock).mockReturnValue(fileContents);

    // Mock console.log to capture its output
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = URLFileHandler('validFile.txt');

    // Expectations for processing URLs
    expect(result).toBeUndefined();
    expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(expect.objectContaining({
      URL: 'github.com/example',
      // Add other expected properties and values here
    })));
    expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(expect.objectContaining({
      URL: 'npmjs.com/package',
      // Add other expected properties and values here
    })));
    expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(expect.objectContaining({
      URL: 'example.com',
      // Add other expected properties and values here
    })));

    // Restore console.log
    consoleLogSpy.mockRestore();
  });
});
