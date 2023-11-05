import fs from 'fs/promises'; // Use fs.promises for async file operations
import uploadImage from '../lib/uploadImage.js'; // Import the uploadImage function

const REPLIES_FILE = 'replies.json';
const privateCustomReplies = {};

// Function to load custom replies from the JSON file
const loadCustomReplies = async () => {
    try {
        const data = await fs.readFile(REPLIES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // File doesn't exist, initialize with an empty object
            return {};
        } else {
            console.error('Error reading replies.json:', err.message);
            throw err;
        }
    }
};

// Function to save custom replies to the JSON file
const saveCustomReplies = async (customReplies) => {
    try {
        await fs.writeFile(REPLIES_FILE, JSON.stringify(customReplies, null, 4), 'utf8');
    } catch (err) {
        console.error('Error writing replies.json:', err.message);
        throw err;
    }
};

// Function to check if the sender is the owner
const isOwner = (sender) => {
    // Extract phone numbers from global.owner and append @s.whatsapp.net
    const ownerIDs = global.owner.map(([phoneNumber]) => `${phoneNumber}@s.whatsapp.net`);
    
    // Check if the sender's ID matches any of the owner IDs
    return ownerIDs.includes(sender);
};

// Add variables to track whether public custom replies are on or off
let publicReplies = true; // For "public on" and "public off"
let setreply = true; // For general "on" and "off"

export async function before(m) {
    if (!m.isGroup) return false;

    const input = m.text.trim();
    let customReplies = await loadCustomReplies(); // Load custom replies from the file

    // Check if the message is a command to set a custom reply
    if (input.startsWith('.setreply')) {
        const commandArgs = input.slice(9).trim(); // Remove ".setreply " from the beginning
        const visibilityMatch = commandArgs.match(/\[([^\]]+)\]/); // Match text within square brackets [private]
        let visibility = 'public'; // Set the default visibility to public
        let termReply = commandArgs;

        if (visibilityMatch) {
            visibility = visibilityMatch[1].toLowerCase(); // Extract and set visibility
            termReply = commandArgs.replace(visibilityMatch[0], '').trim(); // Remove visibility part
        }

        if (termReply) {
            switch (termReply) {
                case 'off':
                    setreply = false; // Turn off custom replies
                    await this.reply(m.chat, 'Custom replies are turned off for everyone.', m);
                    return false; // Return false to prevent further execution

                case 'on':
                    setreply = true; // Turn on custom replies
                    await this.reply(m.chat, 'Custom replies are turned on for everyone.', m);
                    return true; // Continue with further execution

                case 'public off':
                    if (isOwner(m.sender)) {
                        publicReplies = false; // Turn off public custom replies
                        await this.reply(m.chat, 'Public custom replies are turned off.', m);
                    } else {
                        await this.reply(m.chat, 'You do not have permission to turn off public custom replies.', m);
                    }
                    return false; // Return false to prevent further execution

                case 'public on':
                    if (isOwner(m.sender)) {
                        publicReplies = true; // Turn on public custom replies
                        await this.reply(m.chat, 'Public custom replies are turned on.', m);
                    } else {
                        await this.reply(m.chat, 'You do not have permission to turn on public custom replies.', m);
                    }
                    return false; // Return false to prevent further execution
                case 'clear':
                    await this.reply(m.chat, 'Invalid command format. Use ".setreply clear [private] term" to clear a custom reply.', m);
                    return true;
                default:
                    // Check if the command is to clear a specific term
                    if (termReply.startsWith('clear ')) {
                        const termToClear = termReply.slice(6).trim();
                        if (visibility === 'public' && customReplies[termToClear]) {
                            delete customReplies[termToClear]; // Remove the specified term from public custom replies
                            // Save updated custom replies to the file
                            await saveCustomReplies(customReplies);
                            await this.reply(m.chat, `Custom reply for "${termToClear}" has been cleared (public).`, m);
                        } else if (visibility === 'private' && isOwner(m.sender) && customReplies.privateCustomReplies[termToClear]) {
                            delete customReplies.privateCustomReplies[termToClear]; // Remove the specified term from private custom replies
                            // Save updated custom replies to the file
                            await saveCustomReplies(customReplies);
                            await this.reply(m.chat, `Custom reply for "${termToClear}" has been cleared (private).`, m);
                        } else {
                            await this.reply(m.chat, 'Term not found or you do not have permission to clear it.', m);
                        }
                        return true;
                    }   
            const [term, reply] = termReply.split(':');

            if (term && reply) {
                // Check if the message contains a quoted image
                let imageLink = null;
                if (m.quoted && /image/g.test(m.quoted.mimetype || m.quoted.mediaType || "")) {
                    const data = await m.quoted.download?.();
                    imageLink = await uploadImage(data); // Use uploadImage to get the image link
                }

                // Set or update the custom reply along with the image link
                const replyObject = {
                    reply: reply.trim(),
                    image: imageLink || null, // Save the image link or null if not provided
                };

                if (visibility === 'private' && isOwner(m.sender)) {
                    // Store private custom reply separately
                    customReplies.privateCustomReplies = customReplies.privateCustomReplies || {};
                    customReplies.privateCustomReplies[term.trim().toLowerCase()] = replyObject;
                } else {
                    // Store public custom reply
                    customReplies.publicCustomReplies = customReplies.publicCustomReplies || {};
                    customReplies.publicCustomReplies[term.trim().toLowerCase()] = replyObject;
                }

                // Save custom replies to the file
                await saveCustomReplies(customReplies);

                await this.reply(m.chat, `Custom reply for "${term}" has been set (${visibility}): ${reply}`, m);
                return true;
                
            } else {
                await this.reply(m.chat, 'Invalid command format. Use ".setreply [private] term: reply" to set a custom reply.', m);
                return true;
                    }
            }
        } else {
            await this.reply(m.chat, 'Invalid command format. Use ".setreply [private] term: reply" to set a custom reply.', m);
            return true;
        }
    } else {
        // Check if public custom replies are turned on
        if (publicReplies && setreply) {
            // Check if any custom term is detected
            for (const term in customReplies.publicCustomReplies || {}) {
                const termRegex = new RegExp(`\\b${term}\\b`, 'i');
                if (termRegex.test(input)) {
                    // Check if there is an image link associated with the custom reply
                    const customReply = customReplies.publicCustomReplies[term];
                    if (customReply.image) {
                        // If there's an image link, send both the reply and the image
                        await this.sendFile(m.chat, customReply.image, 'custom_reply.jpg', customReply.reply, m);
                    } else {
                        // If there's no image link, send only the reply
                        await this.reply(m.chat, customReply.reply, m);
                    }
                    return true;
                }
            }
        }

        // Check if the term is a private custom reply and the sender is an owner
        if (isOwner(m.sender) && setreply) {
            for (const term in customReplies.privateCustomReplies || {}) {
                const termRegex = new RegExp(`\\b${term}\\b`, 'i');
                if (termRegex.test(input)) {
                    // Check if there is an image link associated with the private custom reply
                    const privateCustomReply = customReplies.privateCustomReplies[term];
                    if (privateCustomReply.image) {
                        // If there's an image link, send both the reply and the image
                        await this.sendFile(m.chat, privateCustomReply.image, 'custom_reply.jpg', privateCustomReply.reply, m);
                    } else {
                        // If there's no image link, send only the reply
                        await this.reply(m.chat, privateCustomReply.reply, m);
                    }
                    return true;
                }
            }
        }
    }

    return false;
}
