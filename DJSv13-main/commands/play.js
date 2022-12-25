const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {

	data: {
		name: 'play',
		description: 'Plays a song!',
		options: [{
			name: 'query',
			type: ApplicationCommandOptionType.String,
			description: 'The song you want to play',
			required: true,
		}],
	},

	async execute(interaction, player) {
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		const query = interaction.options.getString('query');
		const queue = player.createQueue(interaction.guild, {
			ytdlOptions: {
				quality: 'highest',
				filter: 'audioonly',
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
			metadata: {
				channel: interaction.channel,
			},
			leaveOnEnd: false,
			leaveOnStop: true,
			leaveOnEmpty: false,
		});

		// verify vc connection
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		}
		catch {
			queue.destroy();
			return await interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
		}

		await interaction.deferReply();
		const track = await player.search(query, {
			requestedBy: interaction.user,
		}).then(x => x.tracks[0]);
		if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

		queue.play(track);

		return await interaction.followUp({ content: `<:dammcute:905493750221000714> | Loading track **${track.title}**!` });
	},
};