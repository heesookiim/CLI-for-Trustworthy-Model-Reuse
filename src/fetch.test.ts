import { fetch_METRICS, getLink, convertLink, linkValidator } from './fetch';

// Mock axios to simulate API responses
jest.mock('axios');

// fetch_METRICS function
test('should fetch and return MetricData', async () => {
    const apiLink = 'https://api.github.com/repos/cloudinary/cloudinary_npm';
    const result = await fetch_METRICS(apiLink);

    expect(result.totalPullers365).toBeGreaterThanOrEqual(0);
    expect(result.mostPulls365).toBeGreaterThanOrEqual(0);
    expect(result.totalPulls365).toBeGreaterThanOrEqual(0);
    expect(result.issuesClosed).toBeGreaterThanOrEqual(0);
    expect(result.issuesTotal).toBeGreaterThanOrEqual(0);
    expect(result.issuesClosed30).toBeGreaterThanOrEqual(0);
    expect(result.issuesTotal30).toBeGreaterThanOrEqual(0);
    expect(result.issuesClosed14).toBeGreaterThanOrEqual(0);
    expect(result.issuesOpen).toBeGreaterThanOrEqual(0);
});

//getLink function
test('should extract GitHub repository link from npm package page', async () => {
    const npmLink = 'https://www.npmjs.com/package/express';
    const result = await getLink(npmLink);

    expect(result).toBe('https://github.com/expressjs/express');
});

//getLink function
test('should return null when GitHub repository link is not found', async () => {
    const npmLink = 'https://www.npmjs.com/package1/express';
    const result = await getLink(npmLink);

    expect(result).toBe(400);
});

// convertLink function
test('should convert a GitHub link to the GitHub API link', () => {
    const githubLink = 'https://github.com/cloudinary/cloudinary_npm';
    const result = convertLink(githubLink);

    expect(result).toBe('https://api.github.com/repos/cloudinary/cloudinary_npm');
});

//linkValidator function
test('should convert a GitHub link to the GitHub API link', () => {
    const githubLink = 'https://github.com/lodash/lodash';
    const githubLink_invalid = 'https://github.com/lodash/wncpne';
    const valid = linkValidator(githubLink);
    const invalid = linkValidator(githubLink_invalid);
    expect(valid).toBe(200);
    expect(invalid).toBe(400);
});



