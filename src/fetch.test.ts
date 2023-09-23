import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { fetch_METRICS, getLink, convertLink } from './fetch';

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

test('should convert a GitHub link to the GitHub API link', () => {
    const githubLink = 'https://api.github.com/repos/cloudinary/xyz';
    const MetricDataPartial1 = {
        issuesClosed: 0, // number of closed issues [correctness]
        issuesTotal: 0, // total number of issues [correctness]
        issuesClosed30: 0, // number of closed issues, last 30 days [correctness]
        issuesTotal30: 0, // total number of issues, last 30 days [correctness]
        issuesClosed14: 0, // number of closed issues, last 14 days [responsive maintainer]
        issuesOpen: 0, // number of open issues [responsive maintainer]
    };
    const result = fetchIssues(githubLink, MetricDataPartial1);
    expect(result).toBe(400);
});

