// index.js
const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

async function loginAndReply(redditUsername, redditPassword, postUrl, replyMessage) {
    const browser = await puppeteer.launch({ headless: false }); // Set to 'true' for headless mode
    const page = await browser.newPage();

    try {
        // Go to Reddit login page
        await page.goto('https://www.reddit.com/login', { waitUntil: 'networkidle2' });
        console.log('Navigated to Reddit login page.');

        // Type in the username and password
        await page.type('#loginUsername', redditUsername, { delay: 100 });
        await page.type('#loginPassword', redditPassword, { delay: 100 });
        console.log('Entered username and password.');

        // Click the login button
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('Logged in successfully!');

        // Navigate to the post URL
        await page.goto(postUrl, { waitUntil: 'networkidle2' });
        console.log(`Navigated to the post: ${postUrl}`);

        // Wait for the comment box to appear
        await page.waitForSelector('div[data-click-id="text"]', { timeout: 5000 });
        console.log('Comment box found.');

        // Click the comment box to start typing a reply
        await page.click('div[data-click-id="text"]');
        await page.type('div[data-click-id="text"]', replyMessage);
        console.log('Typed the reply message.');

        // Click the submit button
        await page.click('button[type="submit"]');
        console.log('Clicked the submit button to post the reply.');

        // Wait to ensure the reply is posted
        await page.waitForTimeout(5000);
        console.log('Waited for the reply to be posted.');

    } catch (error) {
        console.error('An error occurred during the login and reply process:', error);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
}

// Add a simple GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Reddit Bot API! Use the /post-reply endpoint to post a reply.');
});

app.post('/post-reply', async (req, res) => {
    const { username, password, postUrl, message } = req.body;

    if (!username || !password || !postUrl || !message) {
        return res.status(400).send('Missing required fields: username, password, postUrl, and message.');
    }

    await loginAndReply(username, password, postUrl, message);
    res.send('Bot has logged in and replied to the specified post!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
