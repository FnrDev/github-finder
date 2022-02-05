const { default: axios } = require("axios");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "user",
    description: "Find user info in github.",
    options: [
        {
            name: "username",
            description: "The username of the user you want to find.",
            type: 3,
            required: true
        }
    ],
    run: async(interaction) => {
        const user = interaction.options.getString('username');
        const url = `https://api.github.com/users/${user}`;
        try {
            const data = (await axios.get(url)).data;
            const embed = new MessageEmbed()
            .setAuthor({ name: data.login, iconURL: data.avatar_url })
            .setThumbnail(data.avatar_url)
            .setColor('RANDOM')
            .addField('Repositories', data.public_repos.toLocaleString(), true)
            .addField('Followers', data.followers.toLocaleString(), true)
            .addField('Following', data.following.toLocaleString(), true)
            if (data.location) {
                embed.addField('Location', data.location, true)
            }
            if (data.bio) {
                embed.setDescription(data.bio)
            }
            const row = new MessageActionRow()
            if (data.blog.length > 0) {
                row.addComponents(
                    new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Blog')
                    .setURL(data.blog)
                )
            }
            if (data.twitter_username) {
                row.addComponents(
                    new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Twitter')
                    .setURL(`https://twitter.com/${data.twitter_username}`)
                )
            }
            row.addComponents(
                new MessageButton()
                .setStyle('LINK')
                .setLabel('User Profile')
                .setURL(data.html_url)
            )
            const formatUserDate = new Date(data.created_at).getTime();
            interaction.reply({
                content: `\`⭐\` **${data.login}** profile, created at: <t:${formatUserDate / 1000}:d> (<t:${formatUserDate / 1000}:R>)`,
                components: [row],
                embeds: [embed]
            })
        } catch(e) {
            return interaction.reply({
                content: ":x: i can't find user.",
                ephemeral: true
            })
        }
    }
}