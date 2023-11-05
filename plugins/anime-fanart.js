import axios from 'axios';

let handler = async (m, { conn, command }) => {
    try {
        if (command !== 'fanart') return;

        const imageUrl = `https://api.lolhuman.xyz/api/random/art?apikey=${lolkeysapi}`;
        
        // Stylish caption with an emoji
        const caption = '🎨 Here\'s a random anime fanart for you! 🖼️';

        await conn.sendFile(m.chat, imageUrl, 'fanart.jpg', caption, m);
    } catch (error) {
        console.error(error);
        m.reply('An error occurred while fetching the fanart image.');
    }
};

handler.command = /^(fanart)$/i;

export default handler;
