import fetch from 'node-fetch';

const endpoint = 'https://v2-guru-indratensei.cloud.okteto.net/bard?prompt=';

let handler = async (m, { text }) => {
  if (!text) {
    throw `Please provide a prompt to get a response from the bard.`;
  }

  try {
    const prompt = encodeURIComponent(text);
    const response = await fetch(endpoint + prompt);
    const data = await response.json();

    if (data.generated_text) {
      m.reply(data.generated_text.trim()); // Sending the response as a regular message
    } else {
      throw `Response from the bard is missing the 'generated_text' field.`;
    }
  } catch (error) {
    console.error('Error:', error);
    throw `There was an error fetching a response from the bard. Please try again later.`;
  }
};

handler.command = 'bard';

export default handler;
