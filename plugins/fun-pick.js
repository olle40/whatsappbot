let toM = a => '@' + a.split('@')[0];

function handler(m, { groupMetadata }) {
    let participants = groupMetadata.participants;
    
    if (participants.length < 1) {
        m.reply("There are not enough participants in the group to pick someone.");
        return;
    }
    
    let randomIndex;
    let selectedParticipant;
    
    do {
        randomIndex = Math.floor(Math.random() * participants.length);
        selectedParticipant = participants[randomIndex];
    } while (selectedParticipant.id === m.sender);
    
    m.reply(`${toM(selectedParticipant.id)}`, null, {
        mentions: [selectedParticipant.id]
    });
}

handler.help = ['pick'];
handler.tags = ['fun'];
handler.command = ['pick'];

handler.group = true;

export default handler;
