import * as fs from 'fs';
import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { logger } from './logging_cfg';

//const githubRepoUrl = 'https://github.com/lodash/lodash'; // Replace with the actual GitHub repository URL

export async function ReadMeExtractor(githubRepoUrl: string): Promise<number[]> {
  const localRepoPath = './local-repo'; // Specify the path where you want to clone the repository
  try {
    // Check if the local directory exists already
    const localRepoExists = fs.existsSync(localRepoPath);

    // If it exists, delete it first
    if (localRepoExists) {
      fs.rm(localRepoPath, { recursive: true }, (err) => {
        if(err){
            // File deletion failed
            logger.log('info', err.message);
            return;
        }
        //console.log("File deleted successfully");
      })};

    // Clone the repository
    //console.log('Cloning repository...\n');
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
    const quickStartFound: number = checkQuickStart(readmeContent);
    const examplesFound: number = checkExamples(readmeContent);
    const usageFound: number = checkUsage(readmeContent);

    logger.log('info', 'Readme data gathered for ' + githubRepoUrl);
    logger.log('debug', 'Quick Start: ' + quickStartFound);
    logger.log('debug', 'Examples: ' + examplesFound);
    logger.log('debug', 'Usage' + usageFound);
    deletePath(localRepoPath);
    return [quickStartFound, examplesFound, usageFound];

  } catch (error) {
    logger.log('info', 'An error occurred:' + error);
    deletePath(localRepoPath);
    return [0, 0, 0];
  }
}

function deletePath(localRepoPath: string) {
  // Delete the local repository
  logger.log('debug', `Deleting ${localRepoPath}...`);
  fs.rm(localRepoPath, { recursive: true }, (err) => {
    if(err){
        // File deletion failed
        logger.log('info', err.message);
        return;
    }
    logger.log('info', "File deleted successfully\n");
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