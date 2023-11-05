import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    m.reply('Please provide an IP address or quote a message containing an IP address.');
    return;
  }

  if (!text && m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(text)}/json`);
    const data = await response.json();

    if (response.ok) {
      const {
        ip,
        version,
        city,
        region,
        country_name,
        country_code,
        continent_code,
        postal,
        latitude,
        longitude,
        timezone,
        country_calling_code,
        currency,
        languages,
        country_area,
        country_population,
        asn,
        org,
        hostname
      } = data;

      const replyMessage = `
*IP Address:* ${ip}
*Version:* ${version}
*City:* ${city}
*Region:* ${region}
*Country Name:* ${country_name}
*Country Code:* ${country_code}
*Continent Code:* ${continent_code}
*Postal Code:* ${postal}
*Latitude:* ${latitude}
*Longitude:* ${longitude}
*Timezone:* ${timezone}
*Country Calling Code:* ${country_calling_code}
*Currency:* ${currency}
*Languages:* ${languages}
*Country Area:* ${country_area}
*Country Population:* ${country_population}
*ASN:* ${asn}
*Organization:* ${org}
*Hostname:* ${hostname}
      `;

      m.reply(replyMessage);
    } else {
      m.reply('Failed to fetch IP information.');
    }
  } catch (error) {
    console.error('Error:', error);
    m.reply('Failed to fetch IP information.');
  }
};

handler.command = ['iplookup','ip','ipinfo'];
handler.diamond = false;

export default handler;
