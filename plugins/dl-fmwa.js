import fetch from 'node-fetch';

const modelMappings = {
  "wa": "com_whatsapp",
  "fmwa": "com_fmwhatsapp",
  "gbwa": "com_gbwhatsapp",
  "yowa": "com_yowhatsapp",
};

async function fetchWhatsAppMods() {
  const endpoint = 'https://vihangayt.me/download/fmmods';
  const response = await fetch(endpoint);
  const data = await response.json();

  if (data.status) {
    return data.data;
  } else {
    throw new Error('Failed to fetch modded WhatsApp versions');
  }
}

async function downloadWhatsAppMod(conn, m, modelName) {
  const whatsappMods = await fetchWhatsAppMods();

  if (Object.keys(modelMappings).includes(modelName)) {
    const packageName = modelMappings[modelName];
    const { name, link } = whatsappMods[packageName];

    // Download the APK file
    const apkResponse = await fetch(link);
    const apkBuffer = await apkResponse.buffer();

    // Send the APK file to the user with the package name
    await conn.sendFile(
      m.chat,
      apkBuffer,
      name,
      `You selected ${name} (${packageName} - ${modelName}).`,
      m,
      null,
      { mimetype: 'application/vnd.android.package-archive' }
    );
  } else {
    throw new Error(`No mod found for ${modelName}`);
  }
}

const handler = async (m, { conn, command, args }) => {
  try {
    if (args.length === 1) {
      const modelName = args[0].toLowerCase();
      await downloadWhatsAppMod(conn, m, modelName);
    } else {
      // If an invalid command is used, show a list of available models
      const availableModelsList = Object.entries(modelMappings).map(([modelName, packageName], index) => {
        return `${index + 1}. ${modelName} (${packageName})`;
      }).join('\n');
      
      const message = `🛡️ *WhatsApp Modded Versions:*\n\n${availableModelsList}\n\nPlease use the command with one of the following model names:\n \`\`\`.wamod <model-name>\`\`\`\nFor eg: \`\`\`.wamod gbwa\`\`\``;
      await conn.sendMessage(m.chat, {text:message}, 'extendedTextMessage', { quoted: m });
    }
  } catch (error) {
    throw `❌ Error: ${error.message}`;
  }
};

handler.command = /^(wamod|fmmod)$/i;
handler.tags = ['download'];
handler.help = ['wamod <model-name>', 'fmmod <model-name>'];
export default handler;
