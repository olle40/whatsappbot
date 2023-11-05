import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {

    // Construct the URL with the API key
    const apiUrl = `https://api.lolhuman.xyz/api/random2/futanari?apikey=${lolkeysapi}`;

    // Make an HTTP request to the API endpoint
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Get the direct image URL from the response
    const imageUrl = response.url;

    // Send the image to the chat
    conn.sendFile(m.chat, imageUrl, 'futa_image.jpg', 'Here is a random futa image:', m);
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

handler.help = ['futa'];
handler.tags = ['image', 'futanari'];
handler.command = ['futa'];
handler.rowner = true

export default handler;
