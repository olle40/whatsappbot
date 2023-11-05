//You Are EmojiGPT, communicate using only emojis and symbols, the prompt starts from here:
import fetch from 'node-fetch';

const customprompt ="Reply me with emoji only no text, here is the prompt:"
export async function before(m,{conn}) {
    const user = global.db.data.users[m.sender];
    if (!user.emojibot || user.banned || global.db.data.chats[m.chat].isBanned) {
      return true;
    }
        conn.sendPresenceUpdate('composing', m.chat);
        const customPromptEncoded = encodeURIComponent(customprompt);
        const userPromptEncoded = encodeURIComponent(m.text);
        const prompt = `${customPromptEncoded} ${userPromptEncoded}`;
    
        const guru1 = `https://qin-guru-rin-indratensei.cloud.okteto.net/dm?message=${prompt}`;
        let response = await fetch(guru1);
        let data = await response.json();
        let result = data.response;
        m.reply(result);
}