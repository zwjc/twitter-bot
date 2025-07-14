const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const cron = require('node-cron');

require('dotenv').config();

// Twitter API credentials
const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const twitterClient = client.readWrite;

const getQuote = async () => {
  return "The secret of getting ahead is getting started.";
};

const translateToCat = (text) => {
  const catSounds = ['meow', 'purr', 'hiss', 'mew', 'mrow', 'chirp'];
  return text.split(' ').map(word => {
    const sound = catSounds[Math.floor(Math.random() * catSounds.length)];
    const repetition = Math.ceil(word.length / 3);
    return Array(repetition).fill(sound).join(' ');
  }).join(' ');
};

const tweetQuote = async () => {
  const quote = await getQuote();
  if (quote) {
    const catTranslation = translateToCat(quote);
    const tweetText = `"${quote}"

Cat Translation:
${catTranslation}`;
    try {
      const truncatedTweet = tweetText.length > 280 ? tweetText.substring(0, 277) + '...' : tweetText;
      await twitterClient.v2.tweet(truncatedTweet);
      console.log('Tweeted:', truncatedTweet);
    } catch (error) {
      console.error('Error tweeting:', error);
    }
  }
};


cron.schedule('0 */4 * * *', () => {
  console.log('Running the twitter bot...');
  tweetQuote();
});

console.log('Twitter bot started...');
