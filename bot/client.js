// client.js
const axios = require('axios');

async function sendPostRequest() {
    try {
        const response = await axios.post('http://localhost:3000/post-reply', {
            username: 'your_reddit_username',
            password: 'your_reddit_password',
            postUrl: 'https://www.reddit.com/r/test/comments/your_post_id',
            message: 'This is a test reply!'
        });

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

// Call sendPostRequest to test the bot
sendPostRequest();
