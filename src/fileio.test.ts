import * as fs from 'fs';
import { ReadFile, FindGitModules, FindNPMModules, FindOtherModules, GenerateOutput, URLFileHandler } from './fileio';

describe('fileio.ts functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('ReadFile should read and split file contents correctly', () => {
        const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
        mockReadFileSync.mockReturnValue('url1\nurl2\nurl3\n');

        const result = ReadFile('mocked-file-path');

        expect(result).toEqual(['url1', 'url2', 'url3']);
        expect(mockReadFileSync).toHaveBeenCalledWith('mocked-file-path', 'utf-8');
    });

    test('FindGitModules should find GitHub modules correctly', () => {
        const urls = ['url1', 'github.com/repo1', 'url2', 'github.com/repo2'];
        const result = FindGitModules(urls);

        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ URL: 'github.com/repo1', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
        expect(result).toContainEqual({ URL: 'github.com/repo2', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
    });

    test('FindGitModules should find GitHub modules correctly', () => {
        const urls = ['url1', 'github.com/repo1', 'url2', 'github.com/repo2'];
        const result = FindGitModules(urls);

        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ URL: 'github.com/repo1', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
        expect(result).toContainEqual({ URL: 'github.com/repo2', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
    });

    test('FindNPMModules should find NPM modules correctly', () => {
        const urls = ['url1', 'npmjs.com/package1', 'url2', 'npmjs.com/package2'];
        const result = FindNPMModules(urls);

        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ URL: 'npmjs.com/package1', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
        expect(result).toContainEqual({ URL: 'npmjs.com/package2', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
    });

    test('FindOtherModules should find other modules correctly', () => {
        const urls = ['url1', 'other1.com', 'url2', 'other2.com'];
        const result = FindOtherModules(urls);

        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ URL: 'other1.com', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
        expect(result).toContainEqual({ URL: 'other2.com', NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0, BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0 });
    });

    test('GenerateOutput should generate output correctly', () => {
        // Mock the ndjson.stringify() function
        const mockNdjsonStringify = jest.fn();
        mockNdjsonStringify.mockReturnValue({
            pipe: jest.fn(),
            write: jest.fn(),
            end: jest.fn(),
        });

        const originalNdjsonStringify = require('ndjson').stringify;
        require('ndjson').stringify = mockNdjsonStringify;

        // Call GenerateOutput
        const moduleData = {
            URL: 'github.com/test-repo',
            NET_SCORE: 0.75,
            RAMP_UP_SCORE: 0.8,
            CORRECTNESS_SCORE: 0.9,
            BUS_FACTOR_SCORE: 0.7,
            RESPONSIVE_MAINTAINER_SCORE: 0.85,
            LICENSE_SCORE: 1,
        };

        GenerateOutput(moduleData);

        // Check that ndjson.stringify was called correctly
        expect(mockNdjsonStringify).toHaveBeenCalledWith();
        expect(mockNdjsonStringify().pipe).toHaveBeenCalledWith(process.stdout);
        expect(mockNdjsonStringify().write).toHaveBeenCalledWith(moduleData);
        expect(mockNdjsonStringify().end).toHaveBeenCalledWith();

        // Restore the original ndjson.stringify function
        require('ndjson').stringify = originalNdjsonStringify;
    });
});
