# RedditBot

A simple Reddit bot built using Node.js that interacts with the Reddit API to perform automated tasks such as posting, commenting, or fetching data.

## Prerequisites

Before you can run the bot, you will need the following:

1. **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

2. **Reddit API Credentials**: You need to create a Reddit app to get the necessary API credentials. Follow these steps:
   - Go to [Reddit Developer Apps](https://www.reddit.com/prefs/apps).
   - Create a new app/script.
   - Save the `client_id`, `client_secret`, and `user_agent` from the app settings.

3. **Reddit API Library**: This bot uses the `snoowrap` package, a popular wrapper for the Reddit API.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/redditbot.git
cd redditbot
```

### 2. Install dependencies

Make sure you are in the project directory and then run:

```bash
npm install
```

This will install all necessary dependencies, including `snoowrap`.

### 3. Create `.env` file

Create a `.env` file in the root directory of your project. This file will store your Reddit API credentials.

```
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
REDDIT_USERNAME=your-reddit-username
REDDIT_PASSWORD=your-reddit-password
USER_AGENT=your-user-agent
```

### 4. Modify `index.js`

In the `index.js` file, make sure the credentials are read from the `.env` file using a library like `dotenv`.

```javascript
require('dotenv').config();
const snoowrap = require('snoowrap');

const reddit = new snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

// Example usage: Fetching top posts from a subreddit
reddit.getSubreddit('javascript').getTop({ time: 'day' }).then(posts => {
  posts.forEach(post => {
    console.log(post.title);
  });
});
```

### 5. Run the Bot

Once everything is set up, you can run the bot using the following command:

```bash
node index.js
```

This will start the Reddit bot, and it will execute the logic defined in `index.js`.

## Features

- Fetches top posts from a specific subreddit.
- Can be extended to perform various automated tasks such as posting, commenting, or upvoting content.

## Customization

To extend the bot, you can modify the logic inside `index.js` based on your needs. Here are some examples of what you can add:
- **Automated Posting**: Automatically post content to a subreddit.
- **Automated Commenting**: Post comments on specific threads.
- **Data Fetching**: Fetch data and log or store it elsewhere.

Refer to the [snoowrap documentation](https://not-an-aardvark.github.io/snoowrap/) for detailed API usage.

## Troubleshooting

1. **Reddit API Error**: Make sure your Reddit API credentials in the `.env` file are correct and the bot has appropriate permissions (e.g., read, submit).
   
2. **Node.js Version Issues**: Ensure you are using the correct version of Node.js. You can check the version by running:
   ```bash
   node -v
   ```

3. **Missing Dependencies**: If you get any "module not found" errors, try reinstalling the dependencies:
   ```bash
   npm install
   ```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.


