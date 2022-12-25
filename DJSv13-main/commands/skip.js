module.exports = {

	data: {
		name: 'skip',
		description: 'skip a song.',
	},

	async execute(interaction, player) {
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
		const currentTrack = queue.current;
		const success = queue.skip();
		return void interaction.followUp({
			content: success ? `:fast_forward:  | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
		});
	},
};