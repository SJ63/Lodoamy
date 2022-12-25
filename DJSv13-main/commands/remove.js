const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {

	data: {
		name: 'remove',
		description: 'remove a song.',
		options: [{
			name: 'query',
			description: 'Enter Number Song',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		],
	},

	async execute(interaction, player) {
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		const query = interaction.options.get('query').value;
		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
		const success = queue.remove(queue.tracks[query - 1]);
		return void interaction.followUp({
			content: success ? 'remove success' : '❌ | Something went wrong!',
		});
	},
};