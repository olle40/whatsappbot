import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  let jokeType = 'Any'; // You can change this to 'single' or 'twopart' if needed
  let res = await fetch(`https://v2.jokeapi.dev/joke/${jokeType}?format=json`);
  
  if (!res.ok) throw await res.text();
  
  let json = await res.json();
  let joke;

  if (jokeType === 'single') {
    joke = json.joke;
  } else if (jokeType === 'twopart') {
    joke = `${json.setup}\n\n${json.delivery}`;
  } else {
    // Default to 'Any' type
    if (json.type === 'single') {
      joke = json.joke;
    } else {
      joke = `${json.setup}\n\n${json.delivery}`;
    }
  }

  conn.sendMessage(m.chat, { text: joke, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['joke'];
handler.tags = ['fun'];
handler.command = /^(joke)$/i;

export default handler;
