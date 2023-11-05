import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  let count = 2;

  const countMatch = text.match(/n:(\d+)/);
  if (countMatch) {
    count = parseInt(countMatch[1], 10);
    const maxCount = 10;

    if (count > maxCount) {
      count = maxCount;
      m.reply(`*Maximum allowed count is ${maxCount}. Generating ${maxCount} images...*`);
    } else {
      m.reply(`*Please wait, generating ${count} images...*`);
    }
  } else {
    m.reply('*Please wait, generating images...*');
  }

  try {
    const response = await fetch(`https://v2-guru-indratensei.cloud.okteto.net/scrape?query=${text}`);
    const data = await response.json();

    if (data.image_links && Array.isArray(data.image_links) && data.image_links.length > 0) {
      const imageLinks = data.image_links;
      const totalImages = imageLinks.length;

      if (count > totalImages) {
        count = totalImages;
      }

      const randomIndices = [];
      while (randomIndices.length < count) {
        const randomIndex = Math.floor(Math.random() * totalImages);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      for (const [index, imageIndex] of randomIndices.entries()) {
        const imageUrl = imageLinks[imageIndex];
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.buffer();

        const caption = index === 1 ? `Generated in ${data.execution_time} seconds` : null;

        await conn.sendFile(m.chat, imageBuffer, null, caption, m);
      }
    } else {
      throw '*Image generation failed*';
    }
  } catch {
    throw '*Oops! Something went wrong while generating images. Please try again later.*';
  }
};

handler.help =['aiart <prompt>']
handler.tags = ['AI'];
handler.command = ['aiart', 'art'];
export default handler;
