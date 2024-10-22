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
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Go to Reddit login page
        await page.goto('https://www.reddit.com/login', { waitUntil: 'networkidle2' });

        // Wait for the username and password fields
        await page.waitForSelector('input[name="username"]');
        await page.waitForSelector('input[name="password"]');

        // Type in username and password
        await page.type('input[name="username"]', redditUsername, { delay: 100 });
        await page.type('input[name="password"]', redditPassword, { delay: 100 });

        // Wait for and click the login button
        await page.waitForXPath("//button//span[text()='Log In']");
        const [loginButton] = await page.$x("//button//span[text()='Log In']");
        if (loginButton) {
            await loginButton.click();
        } else {
            console.error("Login button not found");
            await page.screenshot({ path: 'login_button_error.png' });
            return;
        }

        // Wait for login confirmation (user dropdown or similar element)
        try {
            await page.waitForSelector('div[id="USER_DROPDOWN_ID"]', { timeout: 60000 });
            console.log('Logged in successfully!');
        } catch (error) {
            console.error('Login failed, check for CAPTCHA or other issues.');
            await page.screenshot({ path: 'login_failed.png' });
            return;
        }

        // Navigate to the post URL
        await page.goto(postUrl, { waitUntil: 'networkidle2' });

        // Wait for and click on the comment box
        await page.waitForSelector('div[data-click-id="text"]');
        await page.click('div[data-click-id="text"]');
        await page.type('div[data-click-id="text"]', replyMessage);

        // Wait for and click the submit button
        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');

        await page.waitForTimeout(3000); // Wait for reply to post
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
            username: "Miller2011tmm8uj",
            password: "v98n2010oUEB3",
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
