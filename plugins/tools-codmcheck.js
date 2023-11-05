import fetch from 'node-fetch';

let codmPlayerHandler = async (m, { conn, text }) => {
  try {

    // Extract CODM player ID from user input
    const match = text.match(/^(\d+)$/);

    if (!match) {
      throw new Error('Please provide a valid CODM player ID');
    }

    const codmPlayerId = match[1];

    const apiUrl = `https://api.lolhuman.xyz/api/codm/${codmPlayerId}?apikey=${lolkeysapi}`;

    // Make an HTTP request to the API endpoint
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.status === 200) {
      if (data.status === 200) {
        const username = data.result;
        conn.reply(m.chat, `CODM Player ID: ${codmPlayerId}\nUsername: ${username}`, m);
      } else {
        throw new Error(`API Error: ${data.message}`);
      }
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error: ${error.message}`, m);
  }
};

codmPlayerHandler.help = [''].map(v => 'codm' + v + ' [codm_player_id]');
codmPlayerHandler.tags = ['gaming', 'cod mobile'];
codmPlayerHandler.command = /^(codm)$/i;

export default codmPlayerHandler;
