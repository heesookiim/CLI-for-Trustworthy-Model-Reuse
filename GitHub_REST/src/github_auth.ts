import axios, { AxiosResponse } from 'axios';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const PERSONAL_ACCESS_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN';
export async function authenticateWithGitHub(): Promise<void> {
  try {
    // Set up Axios with the token as an Authorization header
    const axiosInstance = axios.create({
      baseURL: GITHUB_API_BASE_URL,
      headers: {
        Authorization: `token ${PERSONAL_ACCESS_TOKEN}`,
      },
    });

    // Make a sample request to the GitHub API
    const response: AxiosResponse = await axiosInstance.get('/user');

    // Check if the request was successful
    if (response.status === 200) {
      const userData = response.data;
      console.log('Authenticated as:', userData.login);
    } else {
      console.error('Authentication failed. Status:', response.status);
    }
  } catch (error: any) {
    console.error('Error occurred:', error.message);
  }
}

// Call the authentication function
authenticateWithGitHub();
