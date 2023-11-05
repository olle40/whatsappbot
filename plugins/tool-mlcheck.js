import fetch from 'node-fetch';

let mlCheckHandler = async (m, { conn, text }) => {
  try {

    // Extract Mobile Legends ID and server ID from user input
    const match = text.match(/^(\d+) \((\d+)\)$/);

    if (!match) {
      throw new Error('Please provide a valid Mobile Legends ID and server ID in the format: ml_id (server_id)');
    }

    const ml_id = match[1];
    const server_id = match[2];

    const apiUrl = `https://api.lolhuman.xyz/api/mobilelegend/${ml_id}/${server_id}?apikey=${lolkeysapi}`;

    // Make an HTTP request to the API endpoint
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.status === 200 && data.status === 200) {
      const username = data.result;
      if (username) {
        conn.reply(m.chat, `*Username*: ${username}`, m);
      } else {
        conn.reply(m.chat, `Chal Lavde`, m);
      }
    } else {
      throw new Error(`API Error: ${data.message}`);
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error: ${error.message}`, m);
  }
};

mlCheckHandler.help = [''].map(v => 'mlcheck' + v + ' [ml_id (server_id)]');
mlCheckHandler.tags = ['tools'];
mlCheckHandler.command = /^(mlcheck)$/i;

export default mlCheckHandler;
