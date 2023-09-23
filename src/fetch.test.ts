import axios from 'axios';
import { fetch_METRICS, getLink, convertLink } from './fetch';

// Mock axios to simulate API responses
jest.mock('axios');

describe('fetch_METRICS function', () => {
  it('should fetch and return MetricData', async () => {
    // Mock Axios response
    axios.get.mockResolvedValue({
      status: 200,
      data: [], // Provide sample data here
    });

    const apiLink = 'sample-api-link';
    const result = await fetch_METRICS(apiLink);

    expect(result).toEqual({
      // Define your expected MetricData here based on the provided sample data
    });
  });

  it('should handle API errors and return null', async () => {
    // Mock Axios response for error
    axios.get.mockRejectedValue(new Error('API error'));

    const apiLink = 'sample-api-link';
    const result = await fetch_METRICS(apiLink);

    expect(result).toBeNull();
  });
});

describe('getLink function', () => {
  it('should extract GitHub repository link from npm package page', async () => {
    // Mock Axios response with HTML containing GitHub repository link
    axios.get.mockResolvedValue({
      status: 200,
      data: 'HTML content with GitHub repository link',
    });

    const npmLink = 'sample-npm-link';
    const result = await getLink(npmLink);

    expect(result).toBe('sample-github-repo-link');
  });

  it('should return null when GitHub repository link is not found', async () => {
    // Mock Axios response with HTML without GitHub repository link
    axios.get.mockResolvedValue({
      status: 200,
      data: 'HTML content without GitHub repository link',
    });

    const npmLink = 'sample-npm-link';
    const result = await getLink(npmLink);

    expect(result).toBeNull();
  });

  it('should handle HTTP errors and return null', async () => {
    // Mock Axios response for HTTP error
    axios.get.mockRejectedValue(new Error('HTTP error'));

    const npmLink = 'sample-npm-link';
    const result = await getLink(npmLink);

    expect(result).toBeNull();
  });
});

describe('convertLink function', () => {
  it('should convert a GitHub link to the GitHub API link', () => {
    const githubLink = 'sample-github-link';
    const result = convertLink(githubLink);

    expect(result).toBe('https://api.github.com/repos/sample-owner/sample-repo');
  });
});
