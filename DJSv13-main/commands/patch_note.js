const { MessageAttachment } = require('discord.js');

module.exports = {

	data: {
		name: 'patch_note',
		description: 'About Patch Note',
	},

	async execute(interaction) {
		await interaction.deferReply();

		// const EM1 = new MessageEmbed()
		//     .setTitle('Test01')
		//     .setDescription('Just testing')
		//     .setColor('AQUA')
		//     .setThumbnail('attachment://HAYASAKA.jpg')
		// .setThumbnail('HAYASAKA.jpg')

		const PN = {
			title: 'Patch note about Lodoamy',
			description: 'Patch note v1.2',
			color: 'AQUA',
			thumbnail: {
				url: 'attachment://HAYASAKA.jpg',
			},
			fields: [{
				name: 'Main Command',
				value: 'play queue skip remove removelast leave',
				inline: false,
			},
			{
				name: '\u200b',
				value: '\u200b',
				inline: false,
			},
			{
				name: 'Support Platform and Limit',
				value: 'Support Youtube Spotify SoundCloud\nand can add song up to 100',
				inline: true,
			},
			{
				name: '\u200b',
				value: '\u200b',
				inline: false,
			},
			{
				name: 'Developer',
				value: 'Zuncraty',
				inline: true,
			},
			],

		};

		const file = new MessageAttachment('../HAYASAKA.jpg');
		return void interaction.followUp({
			embeds: [PN],
			files: [file],
		});
	},
};