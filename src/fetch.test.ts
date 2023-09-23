import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { fetch_METRICS, getLink, convertLink } from './fetch';

// Mock axios to simulate API responses
jest.mock('axios');

// fetch_METRICS function
test('should fetch and return MetricData', async () => {
    // Mock Axios response
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
        status: 200,
        data: [], // Provide sample data here
    });

    const apiLink = 'sample-api-link';
    const result = await fetch_METRICS(apiLink);

    expect(result).toEqual({
        // Define your expected MetricData here based on the provided sample data
    });
});

// fetch_METRICS function
test('should handle API errors and return null', async () => {
    // Mock Axios response for error
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(new Error('API error'));

    const apiLink = 'sample-api-link';
    const result = await fetch_METRICS(apiLink);

    expect(result).toBeNull();
});

//getLink function
test('should extract GitHub repository link from npm package page', async () => {
    // Mock Axios response with HTML containing GitHub repository link
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
        status: 200,
        data: 'HTML content with GitHub repository link',
    });

    const npmLink = 'sample-npm-link';
    const result = await getLink(npmLink);

    expect(result).toBe('sample-github-repo-link');
});

//getLink function
test('should return null when GitHub repository link is not found', async () => {
    // Mock Axios response with HTML without GitHub repository link
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
        status: 200,
        data: 'HTML content without GitHub repository link',
    });

    const npmLink = 'sample-npm-link';
    const result = await getLink(npmLink);

    expect(result).toBeNull();
});

// convertLink function
test('should convert a GitHub link to the GitHub API link', () => {
    const githubLink = 'sample-github-link';
    const result = convertLink(githubLink);

    expect(result).toBe('https://api.github.com/repos/sample-owner/sample-repo');
});

//getLink function
test('should handle HTTP errors and return null', async () => {
    // Mock Axios response for HTTP error
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(new Error('HTTP error'));

    const npmLink = 'sample-npm-link';
    const result = await getLink(npmLink);

    expect(result).toBeNull();
});

//convertLink function
test('should convert a GitHub link to the GitHub API link', () => {
    const githubLink = 'sample-github-link';
    const result = convertLink(githubLink);

    expect(result).toBe('https://api.github.com/repos/sample-owner/sample-repo');
});

//getLink function
test('getLink should handle errors gracefully', async () => {
    // Mock the Axios.get function to simulate an error (e.g., network error)
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(new Error('Network error'));
  
    // Call the getLink function
    const result = await getLink('some-npm-link');
  
    // Assert that the function gracefully handles the error
    expect(result).toBeNull();
});

// TODO: Add these tests
// test fetch_Metric function to see if calls fetchi

// while loop in fetch.ts line 59 // test while loop

// respose.status === 200 // test if statement 

// test try/catch line 238

