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

        // Type in the username and password
        await page.type('devx_123', redditUsername, { delay: 100 });
        await page.type('devx_2005', redditPassword, { delay: 100 });

        // Click the login button
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('Logged in successfully!');

        // Navigate to the post URL
        await page.goto(postUrl, { waitUntil: 'networkidle2' });

        // Click the comment box to start typing a reply
        await page.click('div[data-click-id="text"]');
        await page.type('div[data-click-id="text"]', replyMessage);

        // Click the submit button
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000); // Wait a bit to ensure the reply is posted

        console.log('Replied to the post successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

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
