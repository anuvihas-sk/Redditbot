const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

async function loginAndReply(redditUsername, redditPassword, postUrl, replyMessage) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Set user agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Go to Reddit login page
        console.log('Navigating to Reddit login page...');
        await page.goto('https://www.reddit.com/login', { waitUntil: 'domcontentloaded' });

        // Wait for username and password fields
        console.log('Waiting for username and password fields...');
        await page.waitForSelector('input[name="username"]', { visible: true, timeout: 30000 });
        await page.waitForSelector('input[name="password"]', { visible: true, timeout: 30000 });

        // Type in the username and password
        console.log('Typing in username and password...');
        await page.type('input[name="username"]', redditUsername, { delay: 100 });
        await page.type('input[name="password"]', redditPassword, { delay: 100 });

        // Wait for the login button and click it
        console.log('Waiting for the login button...');
        await page.waitForXPath("//button//span[contains(text(), 'Log In')]", { visible: true, timeout: 30000 });
        const [loginButton] = await page.$x("//button//span[contains(text(), 'Log In')]");
        await loginButton.click();

        // Wait for navigation after login
        console.log('Waiting for login to complete...');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

        // Check for login success
        const loggedIn = await page.$('div[data-testid="user-dropdown"]');  // Example selector for a logged-in user
        if (!loggedIn) {
            console.error('Login failed. Possibly a CAPTCHA or invalid credentials.');
            await page.screenshot({ path: 'login_failed.png' });
            return;
        }

        console.log('Logged in successfully!');

        // Navigate to the post URL
        console.log('Navigating to the post...');
        await page.goto(postUrl, { waitUntil: 'networkidle2' });

        // Wait for the comment box and type the reply
        console.log('Waiting for the comment box...');
        await page.waitForSelector('div[data-click-id="text"]', { visible: true });
        await page.click('div[data-click-id="text"]');
        await page.type('div[data-click-id="text"]', replyMessage);

        // Wait for and click the submit button
        console.log('Submitting the reply...');
        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000); // Wait a bit to ensure reply is posted

        console.log('Replied to the post successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}



// Add a GET route for the root URL
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

// Example to send a POST request to your bot API using Axios
const axios = require('axios');

async function sendPostRequest() {
    try {
        const response = await axios.post('http://localhost:3000/post-reply', {
            username: "username",
            password: "password",
            postUrl: "https://www.reddit.com/r/some_subreddit/comments/post_id/",
            message: "I think you have a great idea"
        });

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

sendPostRequest();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
