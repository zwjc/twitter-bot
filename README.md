# Twitter Meow Bot

A bot that tweets famous, funny, and insightful quotes translated into cat language every four hours.

## Features

*   Tweets every 4 hours.
*   Fetches a random quote from the [Quotable API](https://github.com/lukePeavey/quotable).
*   Translates the quote into a varied and creative "cat language".
*   Includes the original English quote in the tweet for context.
*   Truncates tweets to 280 characters to comply with Twitter's limit.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/twitter-meow-bot.git
    cd twitter-meow-bot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Twitter API credentials:**
    *   Create a new file named `.env` in the root of the project.
    *   Add your Twitter API v2 credentials to the `.env` file like this:

        ```
        TWITTER_APP_KEY=your_app_key
        TWITTER_APP_SECRET=your_app_secret
        TWITTER_ACCESS_TOKEN=your_access_token
        TWITTER_ACCESS_SECRET=your_access_secret
        ```

4.  **Run the bot:**
    ```bash
    node index.js
    ```

## How to get Twitter API Credentials

1.  Apply for a developer account at the [Twitter Developer Platform](https://developer.twitter.com/).
2.  Create a new Project and an App within the developer portal.
3.  In your App's settings, go to the **User authentication settings** and enable **Read and Write** permissions.
4.  Navigate to the **Keys and Tokens** tab for your App to find your **API Key and Secret** and to generate your **Access Token and Secret**.