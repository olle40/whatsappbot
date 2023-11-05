import { execSync } from 'child_process';

let handler = async (m, { conn, text, command }) => {
  // Ensure that the user is the bot owner or has the necessary permissions

  // Check if a PAT is available in the environment
  const githubToken = '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'; // Replace with your environment variable name

  if (!githubToken) {
    return conn.reply(m.chat, 'GitHub Personal Access Token is not configured.', m);
  }

  try {
    let stdout = '';

    if (command === 'gitpush') {
      // Use the PAT for authentication with git push
      stdout = execSync(`GIT_ASKPASS=echo GIT_PASSWORD="${githubToken}" git push`);
    } else if (command === 'gitpull') {
      // Use the PAT for authentication with git pull
      stdout = execSync(`GIT_ASKPASS=echo GIT_PASSWORD="${githubToken}" git pull` + (m.fromMe && text ? ' ' + text : ''));
    } else {
      return conn.reply(m.chat, 'Invalid command. Use .gitpush or .gitpull.', m);
    }

    // Provide the output of the Git command
    return conn.reply(m.chat, `Git ${command} Output:\n${stdout.toString()}`, m);
  } catch (error) {
    // Handle errors, e.g., invalid PAT, authentication issues, etc.
    return conn.reply(m.chat, `Error: ${error.message}`, m);
  }
};

handler.help = ['gitpush', 'gitpull'];
handler.tags = ['owner'];
handler.command = ['gitpush', 'gitpull'];
handler.rowner = true;

export default handler;
