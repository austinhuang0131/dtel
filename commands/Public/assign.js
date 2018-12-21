module.exports = async(client, msg, suffix) => {
	let channel, number;
	if (msg.mentions.channels.first()) {
		channel = msg.mentions.channels.first().id;
		// Genuine offbrand fix
		number = suffix.substring(suffix.indexOf(`${msg.mentions.channels.first().toString()}`) + msg.mentions.channels.first().toString().length + 1).trim();
	// otherwise if they used an id
	} else if (/\d{17,19}/.test(suffix.split(" ")[0])) {
		channel = suffix.split(" ")[0];
		number = suffix.split(" ")[1];
	}

	if (!(await msg.author.getPerms()).support) return;

	if (!suffix) return msg.reply("<:bloblul:356789385875816448> **Hey, I think you forgot two parameters!** Syntax: `>assign (channelid) (number)`");
	number = client.replaceNumber(number);

	if (isNaN(number) || !/^0(30|900|8)/.test(number) || number.length !== 11) {
		return msg.reply("<:thonkku:356833797804916737> **Is this a valid 11-digit number?** Course not, you dumbass");
	}

	let foundNumber;
	foundNumber = await r.table("Numbers").get(number).default(null);
	if (foundNumber) return msg.reply("<:francis:327464171211849728> **This number is already registered:tm:!**");
	foundNumber = await r.table("Numbers").getAll(channel, { index: "channel" }).nth(0)
		.default(null);
	if (foundNumber) return msg.reply("<:francis:327464171211849728> **There is already a number in this channel!**");
	const expiryDate = new Date();
	expiryDate.setMonth(expiryDate.getMonth() + 1);

	const numberDoc = {
		id: number,
		channel: channel,
		expiry: expiryDate,
	};
	let newNumber = await r.table("Numbers").insert(numberDoc);

	msg.reply("Done. Now turn back to your client!");
	client.apiSend(`:green_book: Number \`${newNumber}\` is assigned to channel ${numberDoc.id} by ${msg.author.tag}.`, config.logsChannel);
};

