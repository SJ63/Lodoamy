module.exports = {

	data: {
		name: 'remove_all',
		description: 'remove all song.',
	},

	async execute(interaction, player) {
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
		queue.clear();
		return void interaction.followUp({
			content: 'remove all success',
		});
	},
};