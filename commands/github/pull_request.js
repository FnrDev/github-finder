const { default: axios } = require("axios");

module.exports = {
    name: "pull",
    description: "Find info about pull request in github.",
    options: [
        {
            name: "username",
            description: "username.",
            type: 3,
            required: true
        },
        {
            name: "repository",
            description: "repository name.",
            type: 3,
            required: true
        },
        {
            name: "pull_number",
            description: "The pull request number.",
            type: 4,
            required: true
        }
    ],
    run: async(interaction) => {
        const username = interaction.options.getString('username');
        const repo = interaction.options.getString('repository');
        const number = interaction.options.getInteger('pull_number');
        try {
            const data = (await axios.get(`https://api.github.com/repos/${username}/${repo}/pulls/${number}`)).data;
            const formatDate = new Date(data.created_at).getTime();
            const formatMergedDate = new Date(data.merged_at).getTime();
            interaction.reply({
                content: `[#${data.number} in ${username}/${repo}](<${data.html_url}>) by [${data.user.login}](<${data.user.html_url}>) opened <t:${formatDate / 1000}:R>, merged <t:${formatMergedDate / 1000}:R> **(${data.merged_at ? "Merged" : "Closed"})**\n${data.title}`,
            })
        } catch(e) {
            return interaction.reply({
                content: `:x: i can't find pull request.`,
                ephemeral: true
            })
        }
    }
}