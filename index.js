const siteUrl = 'https://techcrunch.com/tag/mergers-and-acquisitions/';
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config();


const fetchData = async () => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};

getResults = async () => {
    const $ = await fetchData();
    const articleTitle = $('.post-block__title > .post-block__title__link').text();
    const mostRecentArticle = articleTitle.split('\n')[1];
    
    const url = process.env.SLACK_INCOMING_WEBHOOK;
    const data = {
        text: mostRecentArticle,
    };
    await axios.post(url, JSON.stringify(data), {
        withCredentials: false,
        transformRequest: [(data, headers) => {
            delete headers.post["Content-Type"]
            return data
        }]
    });
};

getResults();
