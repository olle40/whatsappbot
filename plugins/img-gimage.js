import axios from 'axios';

const MAX_COUNT = 15; // Maximum count of images

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    throw `Give a query and optionally specify the number of images (up to ${MAX_COUNT}).\n\n🖼️ Example: *${usedPrefix + command} xxtentacion n:12*\n\nYou can use "n:number" to specify the number of images (default is 1 if not specified).`;
  }

  let query = text;
  let count = 1; // Default count is 1 if not specified

  // Use a regular expression to check for the count format "n:number"
  const countMatch = text.match(/n:(\d+)/);
  if (countMatch) {
    count = parseInt(countMatch[1]);
    
    query = query.replace(countMatch[0], '').trim();
  }

  count = Math.min(count, MAX_COUNT);

  const apiUrl = `https://inrl-web.onrender.com/api/gis?text=${encodeURIComponent(query)}&count=${count}`;

  try {
    const response = await axios.get(apiUrl);
    const images = response.data.result;

    if (images.length === 0) {
      throw 'No images found';
    }

    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];

      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(imageResponse.data);

      conn.sendFile(m.chat, buffer, `img${i + 1}.png`, `
✅ Results: *${query}*`.trim(), m);
    }
  } catch (error) {
    throw `Error occurred while fetching images: ${error.message}`;
  }
};

handler.help = ['image'];
handler.tags = ['img'];
handler.command = /^(img|image|gimage|imagen)$/i;
handler.diamond = false;

export default handler;
