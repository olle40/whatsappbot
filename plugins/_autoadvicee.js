import fetch from 'node-fetch';
import fs from 'fs';

let nicknameCharIdDict = {}; // Initialize an empty object for nickname-charid mappings

// Check if the JSON file exists and load its contents
const storageFilePath = 'cai_nicknames.json';
if (fs.existsSync(storageFilePath)) {
  try {
    const fileData = fs.readFileSync(storageFilePath, 'utf-8');
    nicknameCharIdDict = JSON.parse(fileData);
  } catch (error) {
    console.error('Error loading JSON file:', error);
  }
}

// Extract all the nicknames (including the dot) from the nickname-charid mappings
const nicknames = Object.keys(nicknameCharIdDict);
let handler = m => m;
handler = async (m) => {
  // Check if m.chat starts with a period (".") and matches one of the available nicknames
  if (m.chat.startsWith('.') && nicknames.includes(m.chat.slice(1))) {
    // Split the text into two parts: the command (including the dot) and the message
    const parts = m.text.split(' ');
    const nickname = parts[0]; // Extract the command (including the dot)
    const message = parts.slice(1).join(' '); // Extract the message part

    const charid = nicknameCharIdDict[nickname];
    const endpoint = `https://animecafe-characterai-indratensei.cloud.okteto.net/cai?char=${charid}&message=${encodeURIComponent(message)}`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      // Send the character's response back to the user
      m.reply(data.text);
    } catch (error) {
      console.error('Error:', error);
      throw `Error sending message to ${nickname}.`;
    }
  } else if (m.text.toLowerCase().includes('advice')) {
    // Handle the advice-related logic (as in your previous code)
    m.react('💡');
    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      const data = await response.json();

      if (response.ok && data?.slip?.advice) {
        const advice = data.slip.advice;
        m.reply(`${advice}`);
      } else {
        m.reply('Failed to fetch advice.');
      }
    } catch (error) {
      console.error('Error:', error);
      m.reply('Failed to fetch advice.');
    }
  } else {
    throw `Invalid command: ${m.chat}. Available nicknames: ${nicknames.map(n => '.' + n).join(', ')}`;
  }
};

export default handler;
