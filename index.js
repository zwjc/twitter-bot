const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

require('dotenv').config();


const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const twitterClient = client.readWrite;

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

const generateQuoteImage = async (englishQuote, catTranslation) => {
  const imagePath = path.resolve(__dirname, 'images', 'maxresdefault.jpg');
  const image = await Jimp.read(imagePath);

  const fontEnglish = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
  const fontCat = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  const imageWidth = image.bitmap.width;
  const imageHeight = image.bitmap.height;

  const padding = 40;
  const textMaxWidth = (imageWidth / 2) - padding;

  const englishTextY = padding;
  const englishMaxHeight = imageHeight - padding - englishTextY;

  image.print(fontEnglish, padding, englishTextY, {
    text: englishQuote,
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
    alignmentY: Jimp.VERTICAL_ALIGN_TOP
  }, textMaxWidth, englishMaxHeight);

  const englishTextRenderedHeight = Jimp.measureTextHeight(fontEnglish, englishQuote, textMaxWidth);

  const catTextY = englishTextY + englishTextRenderedHeight + 30;
  const catMaxHeight = imageHeight - padding - catTextY;

  image.print(fontCat, padding, catTextY, {
    text: `Cat: ${catTranslation}`,
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
    alignmentY: Jimp.VERTICAL_ALIGN_TOP
  }, textMaxWidth, catMaxHeight);

  const outputPath = path.resolve(__dirname, 'temp_quote_image.png');
  await image.writeAsync(outputPath);
  return outputPath;
};

const tweetQuote = async () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { english, cat_translation } = quotes[randomIndex];

  const tweetText = `"${english}"\n\nCat:\n${cat_translation}`;

  try {
    const imagePath = await generateQuoteImage(english, cat_translation);
    const mediaId = await twitterClient.v1.uploadMedia(imagePath);

    const truncatedTweet = tweetText.length > 280 ? tweetText.substring(0, 277) + '...' : tweetText;
    await twitterClient.v2.tweet(truncatedTweet, { media: { media_ids: [mediaId] } });
    console.log('Tweeted:', truncatedTweet);

    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('Error tweeting:', error);
  }
};

cron.schedule('0 */4 * * *', () => {
  console.log('Running the twitter bot...');
  tweetQuote();
});

console.log('Twitter bot started...');