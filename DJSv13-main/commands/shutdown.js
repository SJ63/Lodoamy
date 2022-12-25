module.exports = {

	data: {
		name: 'shutdown',
		description: 'Stop the bot',
	},

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				{
					title: 'Bot is offline `:/`',
					color: 'RED',
				},
			],
		});


		process.exit();
	},
};