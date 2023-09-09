import { App } from "octokit";

// Initialize Octokit with your GitHub App access token
const app = new App({
  appId: 387121,
  privateKey: PRIVATE_KEY,
});

const octokit = await app.getInstallationOctokit(INSTALLATION_ID);


// Define a function to fetch user information
async function getUserInfo(username: string) {
  try {
    const { data } = await octokit.users.getByUsername({ username });
    return data;
  } catch (error) {
    throw error;
  }
}

// Usage example
const username = 'your-github-username';
getUserInfo(username)
  .then((userData) => {
    console.log('User Data:', userData);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
