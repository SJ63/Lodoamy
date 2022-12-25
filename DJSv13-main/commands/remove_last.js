module.exports = {

	data: {
		name: 'remove_last',
		description: 'remove a song.',
	},

	async execute(interaction, player) {
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
		const success = queue.remove(queue.tracks[queue.tracks.length - 1]);
		return void interaction.followUp({
			content: success ? 'remove success' : '❌ | Something went wrong!',
		});
	},
};