/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';

const personalAccessToken = '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';

interface Post {
    login: String;
    id: number;
    node_id: String;
}

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let result: AxiosResponse = await axios.get(`https://api.github.com/users`,{
        headers: {
            Authorization: `token ${personalAccessToken}`,
        },
    });
    let posts: [Post] = result.data;
    return res.status(200).json({
        message: posts
    });
};

// getting a single post (user info)
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let id: string = req.params.id;
    // get the post
    let result: AxiosResponse = await axios.get(`https://api.github.com/users/${id}`,{
        headers: {
            Authorization: `token ${personalAccessToken}`,
        },
    });
    let post: Post = result.data;
    return res.status(200).json({
        message: post
    });
};

const getPostRepos = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let id: string = req.params.id;
    // get the post
    let result: AxiosResponse = await axios.get(`https://api.github.com/users/${id}/repos`,{
        headers: {
            Authorization: `token ${personalAccessToken}`,
        },
    });
    let post: Post = result.data;
    return res.status(200).json({
        message: post
    });
};

const getPrivRepo = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let id: string = req.params.id;
    // get the post
    let result: AxiosResponse = await axios.get(`https://api.github.com/users/${id}/repos?type=private`,{
        headers: {
            Authorization: `token ${personalAccessToken}`,
        },
    });
    let post: Post = result.data;
    return res.status(200).json({
        message: post
    });
};

export default { getPosts, getPost, getPostRepos, getPrivRepo };