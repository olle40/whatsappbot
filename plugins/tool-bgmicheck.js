import fetch from 'node-fetch';

let bgmiUserHandler = async (m, { conn, text }) => {
  try {

    // Extract BGmi user ID from user input
    const match = text.match(/^(\d+)$/);

    if (!match) {
      throw new Error('Please provide a valid BGmi user ID');
    }

    const bgmiUserId = match[1];

    const apiUrl = `https://api.lolhuman.xyz/api/bgmi/${bgmiUserId}?apikey=${lolkeysapi}`;

    // Make an HTTP request to the API endpoint
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.status === 200) {
      if (data.status === 200) {
        const { username } = data.result;
        conn.reply(m.chat, `BGmi User ID: ${bgmiUserId}\nUsername: ${username}`, m);
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

bgmiUserHandler.help = [''].map(v => 'bgmi' + v + ' [bgmi_user_id]');
bgmiUserHandler.tags = ['anime', 'bgmi'];
bgmiUserHandler.command = /^(bgmi)$/i;

export default bgmiUserHandler;
