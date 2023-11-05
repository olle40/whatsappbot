const senderReactions = new Map([
  ['918789005211@s.whatsapp.net', '❤️'],
  ['918099567722@s.whatsapp.net', '🕵🏻‍♂️'],
  ['918745970825@s.whatsapp.net', '✝️'],
  ['919137588392@s.whatsapp.net', '👑'],
  ['919789340881@s.whatsapp.net', '👾'],
  ['919810860334@s.whatsapp.net', '🏳️‍🌈'],
  ['918369759531@s.whatsapp.net', '🌈'],
  ['916003467823@s.whatsapp.net', '👲'],
  ['919322806595@s.whatsapp.net', '✨'],
  ['916366107077@s.whatsapp.net', '👾'],
  ['919800031256@s.whatsapp.net', '🌸']
]);

export async function before(m) {
  const user = global.db.data.users[m.sender];
  if (!user.ar || user.banned || global.db.data.chats[m.chat].isBanned) {
    return true;
  }

  const senderNumber = m.sender;

  if (senderReactions.has(senderNumber)) {
    const reaction = senderReactions.get(senderNumber);
    m.react(reaction);
  }

  return !0;
}
