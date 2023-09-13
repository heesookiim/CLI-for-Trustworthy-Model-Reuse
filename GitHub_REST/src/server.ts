import express from 'express';
import { authenticateWithGitHub } from './github_auth'; // Import the authentication function from github-api-auth.ts

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    // Call the authentication function from github-api-auth.ts
    await authenticateWithGitHub();

    // You can send a response to the client or perform other actions here
    res.send('GitHub API authentication successful!');
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(500).send('GitHub API authentication failed');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port => localhost:${port}`);
});
