module.exports = {

	data: {
		name: 'leave',
		description: 'leave the room.',
	},

	async execute(interaction, player) {
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		queue.destroy();
		return void interaction.followUp({
			content: '🛑 | Stopped the player!',
		});
	},
};