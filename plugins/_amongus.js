import axios from 'axios';
import { sticker } from '../lib/sticker.js';

export async function all(m, conn) {
    try {
        const text = m.text.toLowerCase();
        const keywords = ['sus', 'among us']; // Add other specific words if needed

        const isKeywordPresent = keywords.some(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i'); // Using word boundary to match whole word
            return regex.test(text);
        });

        if (isKeywordPresent) {
            const apiUrl = `https://api.lolhuman.xyz/api/sticker/amongus?apikey=${lolkeysapi}`;

            await this.sendFile(m.chat, apiUrl, null, { asSticker: true }, m);
        }
    } catch (error) {
        console.error('Error:', error);
        m.reply('An error occurred while sending the sticker.');
    }
}
