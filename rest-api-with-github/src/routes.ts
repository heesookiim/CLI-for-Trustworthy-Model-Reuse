// Different routes the API provide data
// example : https://api.github.com/repos/bhatnag8/Cosmofy

// Imports
import express from 'express';
import controller from './users';
const API = express.Router();

API.get('/users', controller.getPosts);
API.get('/users/:id', controller.getPost);
API.get('/users/:id/repos', controller.getPostRepos);
API.get('/users/:id/repos?type=private', controller.getPrivRepo);
//router.put('/posts/:id', controller.updatePost);
//router.delete('/posts/:id', controller.deletePost);
//router.post('/posts', controller.addPost);

export = API;