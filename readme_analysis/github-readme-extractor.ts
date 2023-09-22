import * as fs from 'fs';
import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const githubRepoUrl = 'https://github.com/lodash/lodash'; // Replace with the actual GitHub repository URL
const localRepoPath = './local-repo'; // Specify the path where you want to clone the repository

async function main() {
  try {
    // Check if the local directory exists already
    const localRepoExists = fs.existsSync(localRepoPath);

    // If it exists, delete it first
    if (localRepoExists) {
      fs.rm(localRepoPath, { recursive: true }, (err) => {
        if(err){
            // File deletion failed
            console.error(err.message);
            return;
        }
        console.log("File deleted successfully");
      })};

    // Clone the repository
    console.log('Cloning repository...\n');
    await git.clone({
      fs,
      http,
      dir: localRepoPath,
      url: githubRepoUrl,
      singleBranch: true, // Only clone the default branch
    });

    // Read the README file directly using the fs module
    const readmePath = `${localRepoPath}/README.md`; // Update the filename if it's different
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // Log the entire README content
    // console.log('README Content:');
    // console.log(readmeContent);

    // Extract information
    const quickStartFound = checkQuickStart(readmeContent);
    const examplesFound = checkExamples(readmeContent);
    const usageFound = checkUsage(readmeContent);

    console.log('Quick Start:', quickStartFound);
    console.log('Examples:', examplesFound);
    console.log('Usage:', usageFound);
  } catch (error) {
    console.error('An error occurred:', error);
  }

  // Delete the local repository
  console.log(`\nDeleting ${localRepoPath}...`);
  fs.rm(localRepoPath, { recursive: true }, (err) => {
    if(err){
        // File deletion failed
        console.error(err.message);
        return;
    }
    console.log("File deleted successfully\n");
  });
}

function checkQuickStart(content: string): number {
  // Check for common quick start phrases and an "Installation" section
  const quickStartKeywords = ['npm install', 'yarn add', 'getting started', 'setup', 'installation'];
    for (const keyword of quickStartKeywords) {
        if (content.toLowerCase().includes(keyword)) {
            return 1;
        }
    }
    const installationSectionHeading = '## Installation'; // Assuming "## Installation" as the heading for Installation section
    if (content.includes(installationSectionHeading)){
        return 1;
    };
    
    return 0;
}

function checkExamples(content: string): number {
  // Check for keywords related to examples
  const examplesKeywords = ['example', 'sample', 'demo', 'use case'];
    for (const keyword of examplesKeywords) {
        if (content.toLowerCase().includes(keyword)) {
            return 1;
        }
    }
    const examplesSectionHeading = '## Examples'; // Assuming "## Examples" as the heading for Examples section
    if (content.includes(examplesSectionHeading)) {
        return 1;
    }
    
    return 0;
}

function checkUsage(content: string): number {
  // Check for keywords related to usage
  const usageKeywords = ['usage', 'how to use', 'how it works', 'getting started'];
    for (const keyword of usageKeywords) {
        if (content.toLowerCase().includes(keyword)) {
            return 1;
        }
    }
    const usageSectionHeading = '## Usage'; // Assuming "## Usage" as the heading for Usage section
    if (content.includes(usageSectionHeading)) {
        return 1;
    }
    
    return 0;
}

main();