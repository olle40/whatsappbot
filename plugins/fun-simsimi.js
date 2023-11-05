import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const name = conn.getName(m.sender);
  if (!text) {
    throw `Hi *${name}*, do you want to talk? Respond with *${usedPrefix + command}* (your message)\n\n📌 Example: *${usedPrefix + command}* Hi bot`;
  }
  
  m.react('🗣️');
  
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `text=${encodeURIComponent(text)}&lc=en&key=`
  };

  const res = await fetch('https://api.simsimi.vn/v1/simtalk', options);
  const json = await res.json();
  
  if (json.status === '200') {
    const reply = json.message;
    m.reply(reply);
  } else {
    m.reply(json.message);
  }
};

handler.help = ['alexa'];
handler.tags = ['fun'];
handler.command = ['alexa'];

export default handler;

