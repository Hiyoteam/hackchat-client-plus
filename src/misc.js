//https://github.com/hack-chat/main/pull/184
//select "chatinput" on "/"
document.addEventListener("keydown", e => {
	if (e.key === '/' && document.getElementById("chatinput") != document.activeElement) {
		e.preventDefault();
		document.getElementById("chatinput").focus();
	}
});

//make frontpage have a getter
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get#%E4%BD%BF%E7%94%A8defineproperty%E5%9C%A8%E7%8E%B0%E6%9C%89%E5%AF%B9%E8%B1%A1%E4%B8%8A%E5%AE%9A%E4%B9%89_getter
function frontpage() {
	return i18ntranslate([
		"<pre><code><div style=\"margin: auto; width: fit-content;\">" +
		" _           _         _       _   ",
		"| |_ ___ ___| |_   ___| |_ ___| |_ ",
		"|   |_ ||  _| '_| |  _|   |_ ||  _|",
		"|_|_|__/|___|_,_|.|___|_|_|__/|_|  ",
		"</div></code></pre>",
		md.render([
			"---",
			"Welcome to hack.chat, a minimal, distraction-free chat application.",
			"You are now experiencing hack.chat with a tweaked client: hackchat\\+\\+. Official hack.chat client is at: https://hack.chat.",
			"Channels are created, joined and shared with the url, create your own channel by changing the text after the question mark. Example: " + (location.host != '' ? ('https://' + location.host + '/') : window.location.href) + "?your-channel",
			"There are no channel lists *for normal users*, so a secret channel name can be used for private discussions.",
			"---",
			"Here are some pre-made channels you can join: " + (should_get_info ? (info.public ? ("(" + info.users + " users online, " + info.chans + " channels existing when you enter this page)") : "(Getting online counts...)") : "(Online counts disabled)"),
		].join('\n')),
		md.render(channels.map(line => line.join(' ')).join('\n')),
		md.render([
			"And here's a random one generated just for you: " + ((!should_get_info) || info.public ? ("?" + Math.random().toString(36).substr(2, 8)) : ""),
			"",
			"---",
			"Formatting:",
			"Notice: Dont send raw source code without using a code block!",
			"Surround LaTeX with a dollar sign for inline style $\\zeta(2) = \\pi^2/6$, and two dollars for display. ",
			"For syntax highlight, wrap the code like: \\`\\`\\`<language> <the code>\\`\\`\\` where <language> is any known programming language.",
			"---",
			"Current Github: https://github.com/hack-chat",
			"Legacy GitHub: https://github.com/AndrewBelt/hack.chat",
			"---",
			"Bots, Android clients, desktop clients, browser extensions, docker images, programming libraries, server modules and more:",
			"https://github.com/hack-chat/3rd-party-software-list",
			"---",
			"Server and web client released under the WTFPL and MIT open source license.",
			"No message history is retained on the hack.chat server, but in certain channels there may be bots made by users which record messages.",
			"---",
			"Github of hackchat++ (aka hackchat-client-plus): https://github.com/Hiyoteam/hackchat-client-plus",
			"Hosted at https://hcer.netlify.app/ and https://hc.thz.cool/ and https://hach.chat/ and https://hcer.fourohfour.link/ (thanks to 0x24a for domains).",
			"Links: [Hack.Chat](https://hack.chat) | ==[Hack.Chat wiki written in Chinese/中文hack.chat帮助文档](https://hcwiki.github.io)== | [History in chatrooms written in Chinese/聊天室历史书](https://hcwiki.gitbook.io/history) | [Crosst.Chat](https://crosst.chat) (Thanks for providing replying script!)",
			"其它HC客户端: [awa客户端 by DPG](https://hc.doppelganger.eu.org/) | [whitechat客户端 by 黑茶](https://whitechat.darknights.repl.co/) | [pipechat客户端 by 黑茶](https://pipechat.darknights.repl.co/)"
		].join('\n')),
	].join("\n"), 'home')
}


var info = {}

var channels = [
	[`?your-channel`, `?programming`, `?lounge`],
	[`?meta`, `?math`, `?physics`, `?chemistry`],
	[`?technology`, `?games`, `?banana`],
	[`?test`, `?your-channell`, `?china`, `?chinese`, `?kt1j8rpc`],
]

function pushFrontPage() {
	pushMessage({ text: frontpage() }, { isHtml: true, i18n: false, noFold: true })
}

/* ---Some variables to be used--- */

var myNick = localStorageGet('my-nick') || '';
var myColor = localStorageGet('my-color') || null;//hex color value for autocolor
var myChannel = window.location.search.replace(/^\?/, '')

var lastSent = [""];
var lastSentPos = 0;

var kolorful = false
var devMode = false

//message log
var jsonLog = '';
var readableLog = '';

var templateStr = '';

var replacement = '\*\*'
var hide = ''
var replace = ''

var lastcid;

var seconds = {
	'join': {
		'times': [],
		'last': (new Date).getTime(),
	},
}

var lastMentioned = ''


function reply(args) {//from crosst.chat
	let replyText = '';
	let originalText = args.text;
	let overlongText = false;

	// Cut overlong text
	if (originalText.length > 350) {
		replyText = originalText.slice(0, 350);
		overlongText = true;
	}

	// Add nickname
	if (args.trip) {
		replyText = '>' + args.trip + ' ' + args.nick + '：\n';
	} else {
		replyText = '>' + args.nick + '：\n';
	}

	// Split text by line
	originalText = originalText.split('\n');

	// Cut overlong lines
	if (originalText.length >= 8) {
		originalText = originalText.slice(0, 8);
		overlongText = true;
	}

	for (let replyLine of originalText) {
		// Cut third replied text
		if (!replyLine.startsWith('>>')) {
			replyText += '>' + replyLine + '\n';
		}
	}

	// Add elipsis if text is cutted
	if (overlongText) {
		replyText += '>……\n';
	}
	replyText += '\n';


	// Add mention when reply to others
	if (args.nick != myNick.split('#')[0]) {
		var nick = args.nick
		let at = '@'
		if ($id('soft-mention').checked) { at += ' ' }
		replyText += at + nick + ' ';
	}

	// Insert reply text
	replyText += input.value;

	input.value = '';
	insertAtCursor(replyText);
	input.focus();
}

/* ---Session Command--- */

function getInfo() {
	return new Promise(function (resolve, reject) {
		let ws = new WebSocket(ws_url);

		ws.onopen = function () {
			this.send(JSON.stringify({ cmd: "session", isBot: false }))
		}

		ws.onmessage = function (message) {
			let data = JSON.parse(message.data)
			if (data.cmd != 'session') {
				return
			}
			info.public = data.public
			info.chans = data.chans
			info.users = data.users
			if (should_get_info) {
				for (let i = 0; i < channels.length; i++) {
					let line = channels[i]
					for (let j = 0; j < line.length; j++) {
						let channel = line[j]
						let user_count = info.public[channel.slice(1)]
						if (typeof user_count == 'number') {
							channel = channel + ' ' + '(' + user_count + ')'
						} else {
							channel = channel + ' ' + '(\\\\)'
						}
						line[j] = channel
					}
					channels[i] = line
				}
			}
			this.close()
			resolve()
		}
	})
}

/* ---Window and input field and sidebar stuffs--- */

var windowActive = true;
var unread = 0;

window.onfocus = function () {
	windowActive = true;

	updateTitle();
}

window.onblur = function () {
	windowActive = false;
}

window.onscroll = function () {
	if (isAtBottom()) {
		updateTitle();
	}
}

function isAtBottom() {
	return (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 1);
}

function updateTitle() {
	if (myChannel == '') {
		unread = 0;
		return;
	}

	if (windowActive && isAtBottom()) {
		unread = 0;
	}

	var title;
	if (myChannel) {
		title = myChannel + " - hack.chat++";
	} else {
		title = "hack.chat++";
	}

	if (unread > 0) {
		title = '(' + unread + ') ' + title;
	}

	document.title = title;
}

$id('footer').onclick = function () {
	input.focus();
}

var keyActions = {
	send() {
		if (!wasConnected) {
			pushMessage({ nick: '*', text: "Attempting to reconnect. . ." })
			join(myChannel);
		}

		// Submit message
		if (input.value != '') {
			let text = input.value
			if ($id('auto-precaution').checked && checkLong(text) && (!text.startsWith('/') || text.startsWith('/me') || text.startsWith('//'))) {
				send({ cmd: 'emote', text: 'Warning: Long message after 3 second | 警告：3秒后将发送长消息' })
				sendInputContent(3000)
			} else {
				sendInputContent()
			}
		}
	},

	up() {
		if (lastSentPos == 0) {
			lastSent[0] = input.value;
		}

		lastSentPos += 1;
		input.value = lastSent[lastSentPos];
		input.selectionStart = input.selectionEnd = input.value.length;

		updateInputSize();
	},

	down() {
		lastSentPos -= 1;
		input.value = lastSent[lastSentPos];
		input.selectionStart = input.selectionEnd = 0;

		updateInputSize();
	},

	tab() {
		var pos = input.selectionStart || 0;
		var text = input.value;
		var index = text.lastIndexOf('@', pos);

		var autocompletedNick = false;

		if (index >= 1 && index == pos - 1 && text.slice(index - 1, pos).match(/^@@$/)) {
			autocompletedNick = true;
			backspaceAtCursor(1);
			insertAtCursor(onlineUsers.join(' @') + " ");
		} else if (index >= 0 && index == pos - 1) {
			autocompletedNick = true;
			if (lastMentioned.length > 0) {
				insertAtCursor(lastMentioned + " ");
			} else {
				insertAtCursor(myNick.split('#')[0] + " ");
				lastMentioned = myNick.split('#')[0]
			}
		} else if (index >= 0) {
			var stub = text.substring(index + 1, pos);

			// Search for nick beginning with stub
			var nicks = onlineUsers.filter(nick => nick.indexOf(stub) == 0);

			if (nicks.length == 0) {
				nicks = onlineUsers.filter(
					nick => nick.toLowerCase().indexOf(stub.toLowerCase()) == 0
				)
			}

			if (nicks.length > 0) {
				autocompletedNick = true;
				if (nicks.length == 1) {
					backspaceAtCursor(stub.length);
					insertAtCursor(nicks[0] + " ");
					lastMentioned = nicks[0]
				}
			}
		}

		// Since we did not insert a nick, we insert a tab character
		if (!autocompletedNick) {
			insertAtCursor('\t');
		}
	},
}

input.onkeydown = function (e) {
	if (e.keyCode == 13 /* ENTER */ && !e.shiftKey) {
		e.preventDefault();

		keyActions.send();
	} else if (e.keyCode == 38 /* UP */) {
		// Restore previous sent messages
		if (input.selectionStart === 0 && lastSentPos < lastSent.length - 1) {
			e.preventDefault();

			keyActions.up();
		}
	} else if (e.keyCode == 40 /* DOWN */) {
		if (input.selectionStart === input.value.length && lastSentPos > 0) {
			e.preventDefault();

			keyActions.down();
		}
	} else if (e.keyCode == 27 /* ESC */) {
		e.preventDefault();

		// Clear input field
		input.value = "";
		lastSentPos = 0;
		lastSent[lastSentPos] = "";

		updateInputSize();
	} else if (e.keyCode == 9 /* TAB */) {
		// Tab complete nicknames starting with @

		if (e.ctrlKey) {
			// Skip autocompletion and tab insertion if user is pressing ctrl
			// ctrl-tab is used by browsers to cycle through tabs
			return;
		}
		e.preventDefault();

		keyActions.tab();
	}
}

function sendInputContent(delay) {
	let text = input.value;
	input.value = '';

	if (templateStr && !isAnsweringCaptcha) {
		if (templateStr.indexOf('%m') > -1) {
			text = templateStr.replace('%m', text);
		}
	}
	if (!delay) {
		silentSendText(text)
	} else {
		setTimeout(silentSendText, delay, text)
	}

	lastSent[0] = text;
	lastSent.unshift("");
	lastSentPos = 0;

	updateInputSize();
}

function silentSendText(text) {
	if (kolorful) {
		send({ cmd: 'changecolor', color: Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0") });
	}

	if (isAnsweringCaptcha && text != text.toUpperCase()) {
		text = text.toUpperCase();
		pushMessage({ nick: '*', text: 'Automatically converted into upper case by client.' });
	}

	if (purgatory) {
		send({ cmd: 'emote', text: text });
	} else {
		// Hook localCmds
		if(isSPCmd(text)){
			callSPcmd(text)
		}else{
			send({ cmd: 'chat', text: text });
		}
	}
	return text;
}

function updateInputSize() {
	var atBottom = isAtBottom();

	input.style.height = 0;
	input.style.height = input.scrollHeight + 'px';
	document.body.style.marginBottom = $id('footer').offsetHeight + 'px';

	if (atBottom) {
		window.scrollTo(0, document.body.scrollHeight);
	}
}

input.oninput = function () {
	updateInputSize();
}
