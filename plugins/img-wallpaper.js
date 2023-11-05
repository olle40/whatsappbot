import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  let apiUrl;

  if (!text) {
    apiUrl = `https://api.lolhuman.xyz/api/random2/wallpaper?apikey=${lolkeysapi}`;
  } else if (text.toLowerCase() === 'anime') {
    apiUrl = `https://api.lolhuman.xyz/api/random/wallnime?apikey=${lolkeysapi}`;
  } else {
    apiUrl = `https://api.lolhuman.xyz/api/wallpaper?apikey=${lolkeysapi}&query=${text}`;
  }

  // Make an HTTP request to the selected API endpoint
  const response = await fetch(apiUrl);

  if (!response.ok) {
    if (response.status === 404) {
      conn.reply(m.chat, 'API Error: Wallpaper not found.', m);
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } else {
    // Use 'arrayBuffer()' instead of 'buffer()'
    const buffer = await response.arrayBuffer();
    conn.sendFile(m.chat, buffer, 'wallpaper.jpg', `*${text || 'Random Wallpaper'}*`, m);
  }
};

handler.help = [''].map(v => 'wallpaper' + v + ' [query]');
handler.tags = ['downloader'];
handler.command = /^(wallpaper)$/i;

export default handler;
