import fetch from 'node-fetch';

export async function before(m, { conn }) {
  if (m.isBaileys && m.fromMe) {
    return true;
  }
  const user = global.db.data.users[m.sender];
  if (m.mtype === 'protocolMessage' || m.mtype === 'pollUpdateMessage' || m.mtype === 'reactionMessage' || m.mtype === 'stickerMessage') {
    return;
  }

  if (user.banned || global.db.data.chats[m.chat].isBanned) {
    return;
  }

  if (!user.chatbot) {
    return true;
  }

  if (m.text === '.on chatbot' || m.text === '.off chatbot' || m.text === '.disable chatbot' || m.text === '.enable chatbot') {
    return true;
  }
  

  let name = conn.getName(m.sender);
  const senderNumber = m.sender.replace(/[^0-9]/g, '');
  const session = `GURUBOT${senderNumber}`;
  const uid = encodeURIComponent(session);
  const msg = encodeURIComponent(m.text);
  console.log(uid);
  conn.sendPresenceUpdate('composing', m.chat);
  const response = await fetch(`https://qin-guru-rin-indratensei.cloud.okteto.net/dm?message=${msg}`);
  const data = await response.json();
  console.log(data);

  let reply = data.response;
  if (reply) {
    reply = reply.replace(/Clyde/gi, 'Qin Shin Huang');
    reply = reply.replace(/Akane/gi, name);
    reply = reply.replace(/discord|Open AI/gi, 'Guru-Botz');
    reply = reply.replace(/kiyopoon|Kiyopon/gi, 'ash');
    reply = reply.replace(/\bthe server\b/gi, 'me'); // 
    reply = reply.replace(/\bserver\b/gi, '');
    m.reply(reply);
  }
}
