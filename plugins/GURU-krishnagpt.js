// import fetch from 'node-fetch';

// let handler = async (m, { text, usedPrefix, command }) => {
//   if (!text && !(m.quoted && m.quoted.text)) {
//     throw `Please provide some text or quote a message to get a response.`;
//   }

//   if (!text && m.quoted && m.quoted.text) {
//     text = m.quoted.text;

//     // Check if the quoted message has a quoted message
//     if (m.quoted.quotedMsgObj) {
//       const quotedQuotedText = m.quoted.quotedMsgObj.text;
//       if (quotedQuotedText) {
//         text = `${text} ${quotedQuotedText}`;
//       }
//     }
//   } else if (text && m.quoted && m.quoted.text) {
//     text = `${text} ${m.quoted.text}`;
//     if (m.quoted.text.includes('.gitagpt')) {
//       text = text.replace('.gitagpt', ''); // Remove ".jesus" from the quoted message if detected
//     }
//   }

//   try {
//     conn.sendPresenceUpdate('composing', m.chat);
//     const prompt = encodeURIComponent(text);
//     const response = await fetch(`https://your-app-rin-indratensei.cloud.okteto.net/jesusgpt?prompt=${prompt}&model=llama`);
//     const data = await response.json();
//     const result = data.data;

//     m.reply(result.trim());
//   } catch (error) {
//     console.error('Error:', error);
//     throw `*ERROR*`;
//   }
// };

// handler.command = ['krishna','krishnagpt'];
// handler.diamond = false;
// handler.tags = ['AI'];


// export default handler;
