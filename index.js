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
 
    const articles = [];
    $('.post-block__title').each((index, value) => {
       var title = $(value).text();
       var link = $('.post-block__title__link').attr('href');
       articles.push({article: [title, link]});
    });
    
    const url = process.env.SLACK_INCOMING_WEBHOOK;
    const data = {
        text: articles[0].article[0] + articles[0].article[1],
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
