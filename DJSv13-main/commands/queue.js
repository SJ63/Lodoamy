module.exports = {

	data:{
		name: 'queue',
		description: 'Server queue',
	},


	async execute(interaction, player) {
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		console.log(queue.tracks[0]);
		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
		const currentTrack = queue.current;
		const tracks = queue.tracks.slice(0, 10).map((m, i) => {
			return `${i + 1}. **${m.title}** ([link](${m.url})) ${m.duration}`;
		});

		return void interaction.followUp({
			embeds: [
				{
					title: 'Server Queue',
					description: `${tracks.join('\n')}${queue.tracks.length > tracks.length
						? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
						: 'Hi'
					}`,
					color: 0x00FFFF,
					fields: [{ name: 'Now Playing', value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url})) ` }],
				},
			],

		});
	},
};