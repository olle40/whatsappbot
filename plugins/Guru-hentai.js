// Import necessary modules
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*This command provides sauce from nhentai: ${usedPrefix + command} miku*`;

  try {
    m.reply(global.wait);

    // If the command is 'hentai pdf <id>', set idToFetch directly
    let idToFetch = null;
    if (text.match(/^pdf \d+$/i)) {
      idToFetch = text.match(/\d+/)[0];
    } else {
      const res = await fetch(`https://api.lolhuman.xyz/api/nhentaisearch?apikey=${lolkeysapi}&query=${text}`);
      const json = await res.json();

      if (!json.result || json.result.length === 0) {
        throw `*No results found. Try searching with a different query.*`;
      }

      const results = json.result;
      let message = 'Search Results:\n\n';

      for (const result of results) {
        const { id, title_english, title_japanese, page } = result;
        message += `*ID*: ${id}\n*Title (English)*: ${title_english}\n*Title (Japanese)*: ${title_japanese}\n*Page Count*: ${page}\n`;
      }

      await conn.sendMessage(m.chat, {text: message}, { quoted: m });

      // Extract the first result's ID for potential PDF download
      idToFetch = results[0].id;
    }

    // If idToFetch is not null, fetch and send the PDF
    if (idToFetch) {
      const pdfUrl = `https://api.lolhuman.xyz/api/nhentaipdf/${idToFetch}?apikey=${lolkeysapi}`;

      const res = await fetch(pdfUrl);
      const json2= await res.json()
      const pdflink = await json2.result;

      // Send the PDF as a document using the provided method
      await conn.sendMessage(m.chat, { document: { url: pdflink }, mimetype: 'application/pdf', fileName: `${idToFetch}.pdf` }, { quoted: m })
    }    

  } catch (error) {
    console.error(error);
    throw error;
  }
};

handler.command = /^(hentai)$/i;
handler.tags = ['downloader']
export default handler;
