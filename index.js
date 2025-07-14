const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');

require('dotenv').config();


const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const twitterClient = client.readWrite;

// Load quotes from quotes.json
const quotes = JSON.parse(fs.readFileSync('./quotes.json', 'utf8'));

const generateCatTranslation = (englishText) => {
  const catSounds = ['meow', 'purr', 'hiss', 'mrow', 'mew', 'chirp', 'ss', 'yowl'];
  const words = englishText.toLowerCase().replace(/[^a-z\s]/g, '').split(' ');
  let catTranslation = '';
  for (let i = 0; i < words.length; i++) {
    catTranslation += catSounds[Math.floor(Math.random() * catSounds.length)];
    if (i < words.length - 1) {
      catTranslation += ' ';
    }
  }
  return catTranslation.charAt(0).toUpperCase() + catTranslation.slice(1) + '.';
};

const tweetQuote = async () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { english, cat_translation } = quotes[randomIndex];

  const tweetText = `"${english}"\n\nCat Translation:\n${cat_translation}`;

  try {
    const truncatedTweet = tweetText.length > 280 ? tweetText.substring(0, 277) + '...' : tweetText;
    await twitterClient.v2.tweet(truncatedTweet);
    console.log('Tweeted:', truncatedTweet);
  } catch (error) {
    console.error('Error tweeting:', error);
  }
};

cron.schedule('0 */4 * * *', () => {
  console.log('Running the twitter bot...');
  tweetQuote();
});

console.log('Twitter bot started...');