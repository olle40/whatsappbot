import fetch from 'node-fetch';

let lastBotCommandTimestamp = 0;

let handler = async (m, { conn, text, usedPrefix, command }) => {
const name = conn.getName(m.sender);

  
const currentTime = Date.now();
if (currentTime - lastBotCommandTimestamp >= 3 * 60 * 60 * 1000) {
    lastBotCommandTimestamp = currentTime;
    m.reply("The old chatbot, the horny one is moved to .alexa command and has been replaced with the new chatbot which makes sense");
}
  
  if (!text) {
    throw `Hi *${name}*, do you want to talk? Respond with *${usedPrefix + command}* (your message)\n\n📌 Example: *${usedPrefix + command}* Hi bot`;
  }

  m.react('🗣️');

  const msg = encodeURIComponent(text);
  const uid = encodeURIComponent(`GURUBOT${m.sender.replace(/[^0-9]/g, '')}`);
  const response = await fetch(`https://qin-guru-rin-indratensei.cloud.okteto.net/dm?message={msg}`);
  const data = await response.json();

  if (data.response) {
    let reply = data.response;
    reply = reply.replace(/Clyde/gi, 'Qin Shin Huang');
    reply = reply.replace(/Akane/gi, name);
    reply = reply.replace(/discord|Open AI/gi, 'Guru-Botz');
    reply = reply.replace(/kiyopoon|Kiyopon/gi, 'ash');
    reply = reply.replace(/\bthe server\b/gi, 'me'); 
    reply = reply.replace(/\bserver\b/gi, '');
    
    m.reply(reply);
  } else {
    m.reply("Sorry, I couldn't understand your message.");
  }
};

handler.help = ['bot'];
handler.tags = ['fun'];
handler.command = ['bot'];

export default handler;
