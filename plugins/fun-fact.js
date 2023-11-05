import axios from 'axios';

let handler = async (m, { conn }) => {
  try {
    const response = await axios.get('https://nekos.life/api/v2/fact');
    const text = `Fact for you: ${response.data.fact}`;
    conn.sendMessage(m.chat, { text: text, mentions: [m.sender] }, { quoted: m });
  } catch (err) {
    conn.sendMessage(m.chat, `🔍 Error: ${err}`, { quoted: m });
  }
};

handler.help = ['fact'];
handler.tags = ['fun'];
handler.command = /^(fact)$/i;

export default handler;
