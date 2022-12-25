const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes, Client, Collection } = require('discord.js');
//	,ApplicationCommandOptionType, MessageAttachment, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder
const dotenv = require('dotenv');


dotenv.config();


// const commands = [{
// 	name: 'play',
// 	description: 'Plays a song!',
// 	options: [{
// 		name: 'query',
// 		type: ApplicationCommandOptionType.String,
// 		description: 'The song you want to play',
// 		required: true,
// 	}],
// },
// {
// 	name: 'queue',
// 	description: 'Server queue',
// },
// {
// 	name: 'skip',
// 	description: 'skip a song.',
// },
// {
// 	name: 'remove',
// 	description: 'remove a song.',
// 	options: [
// 		{
// 			name: 'query',
// 			description: 'Enter Number Song',
// 			required: true,
// 			type: ApplicationCommandOptionType.String,
// 		}],
// },
// {
// 	name: 'remove_last',
// 	description: 'remove a song.',
// },
// {
// 	name: 'remove_all',
// 	description: 'remove all song.',
// },
// {
// 	name: 'leave',
// 	description: 'leave the room.',
// },
// {
// 	name: 'patch_note',
// 	description: 'About Patch Note',
// },
// {
// 	name: 'shutdown',
// 	description: 'Stop the bot',
// },
// {
// 	name: 'test_button',
// 	description: 'test the command',
// },
// ];


//*	Client
const client = new Client({
	intents: [
		'Guilds',
		'GuildVoiceStates',
	],
});
const { Player } = require('discord-player');


// *Create a new Player (you don't need any API Key)
const player = new Player(client);


//* Status
// add the trackStart event so when a song will be played this message will be sent
player.on('error', (queue, error) => {
	console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
	console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});


player.on('trackStart', (queue, track) => queue.metadata.channel.send({
	embeds: [
		{
			title: 'Now playing `:/`',
			description: `:heart:   | Now playing **${track.title}**! **${track.duration}**`,
			color: 0x00FFFF,
		},
	],
},
));

player.on('botDisconnect', (queue) => {
	queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
});

client.once('ready', () => {
	console.log('Im ready !');
});


//* Reading Commands File
client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
	commands.push(command.data);
}


//* Rest
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application [/] commands.');

		await rest.put(Routes.applicationGuildCommands('923104743730081792', '256753539924230154'), { body: commands });

		console.log('Successfully reloaded application [/] commands.');
	}
	catch (error) {
		console.error(error);
	}
})();


//* Interaction
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, player);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
// client.on('interactionCreate', async (interaction) => {
// 	if (!interaction.isChatInputCommand()) return;

// 	// /play track:Despacito
// 	// will play 'Despacito' in the voice channel
// 	if (interaction.commandName === 'play') {
// 		if (!interaction.member.voice.channelId) return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
// 		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
// 		const query = interaction.options.getString('query');
// 		const queue = player.createQueue(interaction.guild, {
// 			ytdlOptions: {
// 				quality: 'highest',
// 				filter: 'audioonly',
// 				highWaterMark: 1 << 30,
// 				dlChunkSize: 0,
// 			},
// 			metadata: {
// 				channel: interaction.channel,
// 			},
// 			leaveOnEnd: false,
// 			leaveOnStop: true,
// 			leaveOnEmpty: false,
// 		});

// 		// verify vc connection
// 		try {
// 			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
// 		}
// 		catch {
// 			queue.destroy();
// 			return await interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
// 		}

// 		await interaction.deferReply();
// 		const track = await player.search(query, {
// 			requestedBy: interaction.user,
// 		}).then(x => x.tracks[0]);
// 		if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

// 		queue.play(track);

// 		return await interaction.followUp({ content: `<:dammcute:905493750221000714> | Loading track **${track.title}**!` });
// 	}
// 	else if (interaction.commandName === 'queue') {
// 		await interaction.deferReply();
// 		const queue = player.getQueue(interaction.guildId);
// 		console.log(queue.tracks[0]);
// 		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
// 		const currentTrack = queue.current;
// 		const tracks = queue.tracks.slice(0, 10).map((m, i) => {
// 			return `${i + 1}. **${m.title}** ([link](${m.url})) ${m.duration}`;
// 		});

// 		return void interaction.followUp({
// 			embeds: [
// 				{
// 					title: 'Server Queue',
// 					description: `${tracks.join('\n')}${queue.tracks.length > tracks.length
// 						? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
// 						: 'Hi'
// 					}`,
// 					color: 0x00FFFF,
// 					fields: [{ name: 'Now Playing', value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url})) ` }],
// 				},
// 			],

// 		});

// 	}
// 	else if (interaction.commandName === 'skip') {
// 		await interaction.deferReply();
// 		const queue = player.getQueue(interaction.guildId);
// 		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
// 		const currentTrack = queue.current;
// 		const success = queue.skip();
// 		return void interaction.followUp({
// 			content: success ? `:fast_forward:  | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
// 		});
// 	}
// 	else if (interaction.commandName === 'remove') {
// 		await interaction.deferReply();
// 		const queue = player.getQueue(interaction.guildId);
// 		const query = interaction.options.get('query').value;
// 		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
// 		const success = queue.remove(queue.tracks[query - 1]);
// 		return void interaction.followUp({
// 			content: success ? 'remove success' : '❌ | Something went wrong!',
// 		});
// 	}
// 	else if (interaction.commandName === 'remove_last') {
// 		await interaction.deferReply();
// 		const queue = player.getQueue(interaction.guildId);
// 		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
// 		const success = queue.remove(queue.tracks[queue.tracks.length - 1]);
// 		return void interaction.followUp({
// 			content: success ? 'remove success' : '❌ | Something went wrong!',
// 		});
// 	}
// 	else if (interaction.commandName === 'remove_all') {
// 		await interaction.deferReply();
// 		const queue = player.getQueue(interaction.guildId);
// 		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
// 		queue.clear();
// 		return void interaction.followUp({
// 			content: 'remove all success',
// 		});
// 	}
// 	else if (interaction.commandName === 'leave') {
// 		await interaction.deferReply();
// 		const queue = player.getQueue(interaction.guildId);
// 		queue.destroy();
// 		return void interaction.followUp({
// 			content: '🛑 | Stopped the player!',
// 		});
// 	}
// 	else if (interaction.commandName === 'shutdown') {
// 		await interaction.reply({
// 			embeds: [
// 				{
// 					title: 'Bot is offline `:/`',
// 					color: 'RED',
// 				},
// 			],
// 		});


// 		process.exit();

// 	}
// 	else if (interaction.commandName === 'patch_note') {
// 		await interaction.deferReply();

// 		// const EM1 = new MessageEmbed()
// 		//     .setTitle('Test01')
// 		//     .setDescription('Just testing')
// 		//     .setColor('AQUA')
// 		//     .setThumbnail('attachment://HAYASAKA.jpg')
// 		// .setThumbnail('HAYASAKA.jpg')

// 		const PN = {
// 			title: 'Patch note about Lodoamy',
// 			description: 'Patch note v1.2',
// 			color: 'AQUA',
// 			thumbnail: {
// 				url: 'attachment://HAYASAKA.jpg',
// 			},
// 			fields: [{
// 				name: 'Main Command',
// 				value: 'play queue skip remove removelast leave',
// 				inline: false,
// 			},
// 			{
// 				name: '\u200b',
// 				value: '\u200b',
// 				inline: false,
// 			},
// 			{
// 				name: 'Support Platform and Limit',
// 				value: 'Support Youtube Spotify SoundCloud\nand can add song up to 100',
// 				inline: true,
// 			},
// 			{
// 				name: '\u200b',
// 				value: '\u200b',
// 				inline: false,
// 			},
// 			{
// 				name: 'Developer',
// 				value: 'Zuncraty',
// 				inline: true,
// 			},
// 			],

// 		};

// 		const file = new MessageAttachment('HAYASAKA.jpg');
// 		return void interaction.followUp({
// 			embeds: [PN],
// 			files: [file],
// 		});
// 	}
// 	else if (interaction.commandName === 'test_button') {
// 		await interaction.deferReply();

// 		const row = new ActionRowBuilder()
// 			.addComponents(
// 				new ButtonBuilder()
// 					.setCustomId('primary')
// 					.setLabel('Click me!')
// 					.setStyle(ButtonStyle.Primary),
// 			);

// 		const embed = new EmbedBuilder()
// 			.setColor(0x0099FF)
// 			.setTitle('Some title')
// 			.setURL('https://discord.js.org')
// 			.setDescription('Some description here');

// 		await interaction.followUp({ content: 'I think you should,', embeds: [embed], components: [row] });
// 	}
// });

client.login(process.env.TOKEN);