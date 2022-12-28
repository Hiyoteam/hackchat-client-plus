/*
 *
 * NOTE: The client side of hack.chat is currently in development,
 * a new, more modern but still minimal version will be released
 * soon. As a result of this, the current code has been deprecated
 * and will not actively be updated.
 *
*/

//https://github.com/hack-chat/main/pull/184
//select "chatinput" on "/"
document.addEventListener("keydown", e => {
	if (e.key === '/' && document.getElementById("chatinput") != document.activeElement) {
		e.preventDefault();
		document.getElementById("chatinput").focus();
	}
});

/* ---Markdown--- */

// initialize markdown engine
var markdownOptions = {
	html: false,
	xhtmlOut: false,
	breaks: true,
	langPrefix: '',
	linkify: true,
	linkTarget: '_blank" rel="noreferrer',
	typographer: true,
	quotes: `""''`,

	doHighlight: true,
	langPrefix: 'hljs language-',
	highlight: function (str, lang) {
		if (!markdownOptions.doHighlight || !window.hljs) { return ''; }

		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) { }
		}

		try {
			return hljs.highlightAuto(str).value;
		} catch (__) { }

		return '';
	}
};

var md = new Remarkable('full', markdownOptions);

// image handler
var allowImages = false;
var whitelistDisabled = false;
var imgHostWhitelist = [
	'i.imgur.com',
	'imgur.com',
	'share.lyka.pro',
	'cdn.discordapp.com',
	'i.gyazo.com',
	'img.thz.cool',
	'i.loli.net', 's2.loli.net',	//SM-MS图床
	's1.ax1x.com', 's2.ax1x.com', 'z3.ax1x.com', 's4.ax1x.com',		//路过图床
	'i.postimg.cc',		//postimages图床
	'mrpig.eu.org',		//慕容猪的图床
	'gimg2.baidu.com',	//百度
	'files.catbox.moe'  //catbox
];

function getDomain(link) {
	var a = document.createElement('a');
	a.href = link;
	return a.hostname;
}

function isWhiteListed(link) {
	return whitelistDisabled || imgHostWhitelist.indexOf(getDomain(link)) !== -1;
}

function mdEscape(str) {
	return str.replace(/(?=(\\|`|\*|_|\{|\}|\[|\]|\(|\)|#|\+|-|\.|!|\||=|\^|~|\$|>|<|'))/g, '\\')
}

md.renderer.rules.image = function (tokens, idx, options) {
	var src = Remarkable.utils.escapeHtml(tokens[idx].src);

	if (isWhiteListed(src) && allowImages) {
		var imgSrc = ' src="' + Remarkable.utils.escapeHtml(tokens[idx].src) + '"';
		var title = tokens[idx].title ? (' title="' + Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title)) + '"') : '';
		var alt = ' alt="' + (tokens[idx].alt ? Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(Remarkable.utils.unescapeMd(tokens[idx].alt))) : '') + '"';
		var suffix = options.xhtmlOut ? ' /' : '';
		var scrollOnload = isAtBottom() ? ' onload="window.scrollTo(0, document.body.scrollHeight)"' : '';
		return '<a href="' + src + '" target="_blank" rel="noreferrer"><img' + scrollOnload + imgSrc + alt + title + suffix + ' referrerpolicy="no-referrer"></a>';
	}

	return '<a href="' + src + '" target="_blank" rel="noreferrer">' + Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(src)) + '</a>';
};

md.renderer.rules.link_open = function (tokens, idx, options) {
	var title = tokens[idx].title ? (' title="' + Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title)) + '"') : '';
	var target = options.linkTarget ? (' target="' + options.linkTarget + '"') : '';
	return '<a rel="noreferrer" onclick="return verifyLink(this)" href="' + Remarkable.utils.escapeHtml(tokens[idx].href) + '"' + title + target + '>';
};

md.renderer.rules.text = function (tokens, idx) {
	tokens[idx].content = Remarkable.utils.escapeHtml(tokens[idx].content);

	if (tokens[idx].content.indexOf('?') !== -1) {
		tokens[idx].content = tokens[idx].content.replace(/(^|\s)(\?)\S+?(?=[,.!?:)]?\s|$)/gm, function (match) {
			var channelLink = Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(match.trim()));
			var whiteSpace = '';
			if (match[0] !== '?') {
				whiteSpace = match[0];
			}
			return whiteSpace + '<a href="' + channelLink + '" target="_blank">' + channelLink + '</a>';
		});
	}

	return tokens[idx].content;
};

md.use(remarkableKatex);

/* ---Some functions and texts to be used later--- */

function verifyLink(link) {
	var linkHref = Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(link.href));
	if (linkHref !== link.innerHTML) {
		return confirm('Warning, please verify this is where you want to go: ' + linkHref);
	}

	return true;
}

var verifyNickname = function (nick) {
	return /^[a-zA-Z0-9_]{1,24}$/.test(nick);
}

//LaTeX weapon and too-many-quotes weapon defense
function verifyMessage(args) {
	if (/(\\rule)|(pmatrix)|([^\s^_]+[\^_]{){8,}/.test(args.text) || /[\n](>[^>\n]*){10,}/.test(args.text) || /^(>[^>\n]*){10,}/.test(args.text)) {
		return false;
	} else {
		return true;
	}
}

var info = {}

var channels = [
	`?your-channel ?programming ?lounge`,
	`?meta ?math ?physics ?chemistry`,
	`?technology ?games ?banana`,
	`?test ?your-channell ?china ?chinese ?kt1j8rpc`,
]

//make frontpage have a getter
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get#%E4%BD%BF%E7%94%A8defineproperty%E5%9C%A8%E7%8E%B0%E6%9C%89%E5%AF%B9%E8%B1%A1%E4%B8%8A%E5%AE%9A%E4%B9%89_getter
Object.defineProperty(this, 'frontpage', {
	get: () => [
		"                            _           _         _       _   ",
		"                           | |_ ___ ___| |_   ___| |_ ___| |_ ",
		"                           |   |_ ||  _| '_| |  _|   |_ ||  _|",
		"                           |_|_|__/|___|_,_|.|___|_|_|__/|_|  ",
		"---",
		"Welcome to hack.chat, a minimal, distraction-free chat application.",
		"You are now experiencing hack.chat with a tweaked client: hackchat\\+\\+. Official hack.chat client is at: https://hack.chat.",
		"Channels are created, joined and shared with the url, create your own channel by changing the text after the question mark. Example: " + (document.domain != '' ? ('https://' + document.domain + '/') : window.location.href) + "?your-channel",
		"There are no channel lists, so a secret channel name can be used for private discussions.",
		"---",
		"Here are some pre-made channels you can join: " + (shouldGetInfo ? (info.public ? ("(" + info.users + " users online, " + info.chans + " channels existing when you enter this page)") : "(Getting online counts...)") : "(Online counts disabled)"),
		...channels,
		"And here's a random one generated just for you: " + ((!shouldGetInfo) || info.public ? ("?" + Math.random().toString(36).substr(2, 8)) : ""),
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
		"Github of hackchat++ (aka hackchat-client-plus): https://github.com/xjzh123/hackchat-client-plus",
		"Hosted at https://hcer.netlify.app/ and hc.thz.cool(thanks to Maggie, aka THZ, for hosting).",
		"Links: [Hack.Chat](https://hack.chat) | [Hack.Chat wiki written in Chinese/中文hack.chat帮助文档](https://hcwiki.github.io) | [History in chatrooms written in Chinese/聊天室历史书](https://hcwiki.github.io/history/) | [TanChat](https://chat.thz.cool) | [Crosst.Chat](https://crosst.chat) (Thanks for providing replying script!) | [ZhangClient\(Chinese Client/中文HC客户端\)](https://client.zhangsoft.cf/)"
	].join("\n")
})

function $(query) {
	return document.querySelector(query);
}

function localStorageGet(key) {
	try {
		return window.localStorage[key]
	} catch (e) { }
}

function localStorageSet(key, val) {
	try {
		window.localStorage[key] = val
	} catch (e) { }
}

/* ---Some variables to be used--- */

var ws;
var myNick = localStorageGet('my-nick') || '';
var myColor = localStorageGet('my-color') || null;//hex color value for autocolor
var myChannel = window.location.search.replace(/^\?/, '');
var lastSent = [""];
var lastSentPos = 0;

var kolorful = false

//message log
var jsonLog = '';
var readableLog = '';

var templateStr = '';

/* ---Notification--- */

/** Notification switch and local storage behavior **/
var notifySwitch = document.getElementById("notify-switch")
var notifySetting = localStorageGet("notify-api")
var notifyPermissionExplained = 0; // 1 = granted msg shown, -1 = denied message shown

// Inital request for notifications permission
function RequestNotifyPermission() {
	try {
		var notifyPromise = Notification.requestPermission();
		if (notifyPromise) {
			notifyPromise.then(function (result) {
				console.log("Hack.Chat notification permission: " + result);
				if (result === "granted") {
					if (notifyPermissionExplained === 0) {
						pushMessage({
							cmd: "chat",
							nick: "*",
							text: "Notifications permission granted.",
							time: null
						});
						notifyPermissionExplained = 1;
					}
					return false;
				} else {
					if (notifyPermissionExplained === 0) {
						pushMessage({
							cmd: "chat",
							nick: "*",
							text: "Notifications permission denied, you won't be notified if someone @mentions you.",
							time: null
						});
						notifyPermissionExplained = -1;
					}
					return true;
				}
			});
		}
	} catch (error) {
		pushMessage({
			cmd: "chat",
			nick: "*",
			text: "Unable to create a notification.",
			time: null
		});
		console.error("An error occured trying to request notification permissions. This browser might not support desktop notifications.\nDetails:")
		console.error(error)
		return false;
	}
}

// Update localStorage with value of checkbox
notifySwitch.addEventListener('change', (event) => {
	if (event.target.checked) {
		RequestNotifyPermission();
	}
	localStorageSet("notify-api", notifySwitch.checked)
})
// Check if localStorage value is set, defaults to OFF
if (notifySetting === null) {
	localStorageSet("notify-api", "false")
	notifySwitch.checked = false
}
// Configure notifySwitch checkbox element
if (notifySetting === "true" || notifySetting === true) {
	notifySwitch.checked = true
} else if (notifySetting === "false" || notifySetting === false) {
	notifySwitch.checked = false
}

/** Sound switch and local storage behavior **/
var soundSwitch = document.getElementById("sound-switch")
var notifySetting = localStorageGet("notify-sound")

// Update localStorage with value of checkbox
soundSwitch.addEventListener('change', (event) => {
	localStorageSet("notify-sound", soundSwitch.checked)
})
// Check if localStorage value is set, defaults to OFF
if (notifySetting === null) {
	localStorageSet("notify-sound", "false")
	soundSwitch.checked = false
}
// Configure soundSwitch checkbox element
if (notifySetting === "true" || notifySetting === true) {
	soundSwitch.checked = true
} else if (notifySetting === "false" || notifySetting === false) {
	soundSwitch.checked = false
}

// Create a new notification after checking if permission has been granted
function spawnNotification(title, body) {
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		console.error("This browser does not support desktop notification");
	} else if (Notification.permission === "granted") { // Check if notification permissions are already given
		// If it's okay let's create a notification
		var options = {
			body: body,
			icon: "/favicon-96x96.png"
		};
		var n = new Notification(title, options);
	}
	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== "denied") {
		if (RequestNotifyPermission()) {
			var options = {
				body: body,
				icon: "/favicon-96x96.png"
			};
			var n = new Notification(title, options);
		}
	} else if (Notification.permission == "denied") {
		// At last, if the user has denied notifications, and you
		// want to be respectful, there is no need to bother them any more.
	}
}

function notify(args) {
	// Spawn notification if enabled
	if (notifySwitch.checked) {
		spawnNotification("?" + myChannel + "  �  " + args.nick, args.text)
	}

	// Play sound if enabled
	if (soundSwitch.checked) {
		var soundPromise = document.getElementById("notify-sound").play();
		if (soundPromise) {
			soundPromise.catch(function (error) {
				console.error("Problem playing sound:\n" + error);
			});
		}
	}
}

/* ---Websocket stuffs--- */

var wasConnected = false;

var isInChannel = false;
var purgatory = false;

var shouldAutoReconnect = true;

function join(channel, oldNick) {
	ws = new WebSocket('wss://hack.chat/chat-ws');
	//ws = new WebSocket('ws://localhost:6060');

	wasConnected = false;

	ws.onopen = function () {
		var shouldConnect = true;
		if (!wasConnected) {
			if (location.hash) {
				myNick = location.hash.substr(1);
			} else if (typeof oldNick == 'string') {
				if (verifyNickname(oldNick.split('#')[0])) {
					myNick = oldNick;
				}
			} else {
				var newNick = prompt('Nickname:', myNick);
				if (newNick !== null) {
					myNick = newNick;
				} else {
					// The user cancelled the prompt in some manner
					shouldConnect = false;
					shouldAutoReconnect = false;
					pushMessage({ nick: '!', text: "You cancelled joining. Press enter at the input field to reconnect." })
				}
			}
		}

		if (myNick && shouldConnect) {
			localStorageSet('my-nick', myNick);
			send({ cmd: 'join', channel: channel, nick: myNick });
			wasConnected = true;
			shouldAutoReconnect = true;
		} else {
			ws.close()
		}

	}

	ws.onclose = function () {
		isInChannel = false

		if (shouldAutoReconnect) {
			if (wasConnected) {
				wasConnected = false;
				pushMessage({ nick: '!', text: "Server disconnected. Attempting to reconnect. . ." });
			}

			window.setTimeout(function () {
				if (myNick.split('#')[1]) {
					join(channel, (myNick.split('#')[0] + '_').replace(/_{3,}$/g, '') + '#' + myNick.split('#')[1]);
				} else {
					join(channel, (myNick + '_').replace(/_{3,}$/g, ''));
				}
			}, 2000);

			window.setTimeout(function () {
				if (!wasConnected) {
					shouldAutoReconnect = false;
					pushMessage({ nick: '!', text: "Failed to connect to server. When you think there is chance to succeed in reconnecting, press enter at the input field to reconnect." })
				}
			}, 2000);
		}
	}

	ws.onmessage = function (message) {
		var args = JSON.parse(message.data);
		var cmd = args.cmd;
		var command = COMMANDS[cmd];
		if (args.channel) {
			if (args.channel != myChannel && isInChannel) {
				isInChannel = false
				if (args.channel != 'purgatory') {
					purgatory = false
					usersClear()
					p = document.createElement('p')
					p.textContent = `You may be kicked or moved to this channel by force to channel ?${args.channel}. Unable to get full user list. `
					$('#users').appendChild(p)
					pushMessage({ nick: '!', text: `Unexpected Channel ?${args.channel} . You may be kicked or moved to this channel by force. ` })
				} else {
					purgatory = true
					pushMessage({ nick: '!', text: `Unexpected Channel ?${args.channel} . You may be locked out from ?${myChannel} . You may also be kicked or moved to this channel by force. ` })
				}
			} else if (isInChannel) {
				if (purgatory && myChannel != 'purgatory') {// you are moved by a mod from purgatory to where you want to be at
					purgatory = false
					pushMessage({ nick: '!', text: `You are now at ?${args.channel} . A mod has moved you. ` })
				} else if (args.channel == 'purgatory') {
					purgatory = true
				}
			}
		}
		if (command) {
			command.call(null, args);
		}
		if (doLogMessages) { jsonLog += ';' + message.data }
	}
}

var COMMANDS = {
	chat: function (args) {
		if (ignoredUsers.indexOf(args.nick) >= 0) {
			return;
		}
		pushMessage(args);
	},

	info: function (args) {
		args.nick = '*';
		pushMessage(args);
	},

	emote: function (args) {
		args.nick = '*';
		pushMessage(args);
	},

	warn: function (args) {
		args.nick = '!';
		pushMessage(args);
	},

	onlineSet: function (args) {
		let users = args.users;
		let nicks = args.nicks;

		usersClear();

		users.forEach(function (user) {
			userAdd(user.nick, user.trip);
		});

		let nicksHTML = nicks.map(function (nick) {
			div = document.createElement('div')
			div.innerHTML = md.render(nick)
			return div.firstChild.innerHTML
		})

		// respectively render markdown for every nickname in order to prevent the underlines in different nicknames from being rendered as italics or bold for matching markdown syntax. 
		pushMessage({ nick: '*', text: "Users online: " + nicksHTML.join(", ") }, isHtml = true)

		pushMessage({ nick: '*', text: "Thanks for using hackchat++ client! Source at: https://github.com/xjzh123/hackchat-client-plus" })

		if (myColor) {
			if (myColor == 'random') {
				myColor = Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
			}
			send({ cmd: 'changecolor', color: myColor })
		}

		isInChannel = true
	},

	onlineAdd: function (args) {
		var nick = args.nick;

		userAdd(nick, args.trip);

		if ($('#joined-left').checked) {
			payLoad = { nick: '*', text: nick + " joined" }

			//onlineAdd can contain trip but onlineRemove doesnt contain trip
			if (args.trip) {
				payLoad.trip = args.trip
			}
			pushMessage(payLoad);
		}
	},

	onlineRemove: function (args) {
		var nick = args.nick;

		userRemove(nick);

		if ($('#joined-left').checked) {
			pushMessage({ nick: '*', text: nick + " left" });
		}
	},

	captcha: function (args) {
		var messageEl = document.createElement('div');
		messageEl.classList.add('info');


		var nickSpanEl = document.createElement('span');
		nickSpanEl.classList.add('nick');
		messageEl.appendChild(nickSpanEl);

		var nickLinkEl = document.createElement('a');
		nickLinkEl.textContent = '#';
		nickSpanEl.appendChild(nickLinkEl);

		var textEl = document.createElement('pre');
		textEl.classList.add('text');
		textEl.classList.add('captcha');//css optimization for captcha
		textEl.innerHTML = args.text;

		messageEl.appendChild(textEl);
		$('#messages').appendChild(messageEl);

		window.scrollTo(0, document.body.scrollHeight);
	}
}

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
		if (softMention) { at += ' ' }
		replyText += at + nick + ' ';
	}

	// Insert reply text
	replyText += $('#chatinput').value;

	$('#chatinput').value = '';
	insertAtCursor(replyText);
	$('#chatinput').focus();
}

function pushMessage(args, isHtml/*This is only for better controll to rendering. There are no backdoors to push HTML to users in my repo.*/) {
	// Message container
	var messageEl = document.createElement('div');

	if (
		typeof (myNick) === 'string' && (
			args.text.match(new RegExp('@' + myNick.split('#')[0] + '\\b', "gi")) ||
			((args.type === "whisper" || args.type === "invite") && args.from)
		)
	) {
		notify(args);
	}

	messageEl.classList.add('message');

	if (verifyNickname(myNick.split('#')[0]) && args.nick == myNick.split('#')[0]) {
		messageEl.classList.add('me');
	} else if (args.nick == '!') {
		messageEl.classList.add('warn');
	} else if (args.nick == '*') {
		messageEl.classList.add('info');
	} else if (args.admin) {
		messageEl.classList.add('admin');
	} else if (args.mod) {
		messageEl.classList.add('mod');
	}

	// Nickname
	var nickSpanEl = document.createElement('span');
	nickSpanEl.classList.add('nick');
	messageEl.appendChild(nickSpanEl);

	if (args.trip) {
		var tripEl = document.createElement('span');

		if (args.mod) {
			tripEl.textContent = String.fromCodePoint(11088) + " " + args.trip + " ";
		} else {
			tripEl.textContent = args.trip + " ";
		}

		tripEl.classList.add('trip');
		nickSpanEl.appendChild(tripEl);
	}

	if (args.nick) {
		var nickLinkEl = document.createElement('a');
		nickLinkEl.textContent = args.nick;

		if (args.nick === 'jeb_') {
			nickLinkEl.setAttribute("class", "jebbed");
		} else if (args.color && /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(args.color)) {
			nickLinkEl.setAttribute('style', 'color:#' + args.color + ' !important');
		}

		//tweaked code from crosst.chat
		nickLinkEl.onclick = function () {
			// Reply to a whisper or info is meaningless
			if (args.type == 'whisper' || args.nick == '*' || args.nick == '!') {
				insertAtCursor(args.text);
				$('#chat-input').focus();
				return;
			} else if (args.nick == myNick.split('#')[0]) {
				reply(args)
			} else {
				var nick = args.nick
				let at = '@'
				if (softMention) { at += ' ' }
				insertAtCursor(at + nick + ' ');
				$('#chatinput').focus();
				return;
			}
		}
		// Mention someone when right-clicking
		nickLinkEl.oncontextmenu = function (e) {
			e.preventDefault();
			reply(args)
		}

		var date = new Date(args.time || Date.now());
		nickLinkEl.title = date.toLocaleString();
		nickSpanEl.appendChild(nickLinkEl);
	}

	// Text
	var textEl = document.createElement('p');
	textEl.classList.add('text');
	if (isHtml) {
		textEl.innerHTML = args.text;
	} else if (verifyMessage(args)) {
		textEl.innerHTML = md.render(args.text);
	} else {
		let pEl = document.createElement('p')
		pEl.appendChild(document.createTextNode(args.text))
		pEl.classList.add('break') //make lines broken at newline characters, as this text is not rendered and may contain raw newline characters
		textEl.appendChild(pEl)
		console.log('norender to dangerous message:', args)
	}
	// Optimize CSS of code blocks which have no specified language name: add a hjls class for them
	textEl.querySelectorAll('code').forEach((element) => {
		console.log('现在走到',element)
		let doElementHasClass = false
		console.log(element.classList)
		element.classList.forEach((cls) => {
			console.log('类是',cls)
			if (cls.startsWith('language-') || cls == 'hljs') {
				doElementHasClass = true
			}
		})
		if (!doElementHasClass) {
			element.classList.add('hljs')
		}
		console.log('走完了',element)
	})
	messageEl.appendChild(textEl);

	// Scroll to bottom
	var atBottom = isAtBottom();
	$('#messages').appendChild(messageEl);
	if (atBottom && myChannel != ''/*Frontpage should not be scrooled*/) {
		window.scrollTo(0, document.body.scrollHeight);
	}

	unread += 1;
	updateTitle();

	if (doLogMessages && args.nick && args.text) {
		readableLog += `\n[${date.toLocaleString()}] `
		if (args.mod) { readableLog += '(mod) ' }
		if (args.color) { readableLog += '(color:' + args.color + ') ' }
		readableLog += args.nick
		if (args.trip) { readableLog += '#' + args.trip }
		readableLog += ': ' + args.text
	}
}

function insertAtCursor(text) {
	var input = $('#chatinput');
	var start = input.selectionStart || 0;
	var before = input.value.substr(0, start);
	var after = input.value.substr(start);

	before += text;
	input.value = before + after;
	input.selectionStart = input.selectionEnd = before.length;

	updateInputSize();
}

function send(data) {
	if (ws && ws.readyState == ws.OPEN) {
		ws.send(JSON.stringify(data));
	}
}

/* ---Session Command--- */

function getInfo() {
	return new Promise(function (resolve, reject) {
		ws = new WebSocket('wss://hack.chat/chat-ws');

		ws.onopen = function () {
			this.send(JSON.stringify({ cmd: "session", isBot: false }))
		}

		ws.onmessage = function (message) {
			data = JSON.parse(message.data)
			if (data.cmd != 'session') {
				return
			}
			info.public = data.public
			info.chans = data.chans
			info.users = data.users
			if (shouldGetInfo) {
				for (let i = 0; i < channels.length; i++) {
					let line = channels[i]
					let newLineChannels = []
					for (let channel of line.split(/ ?\?/g).slice(1)) {
						if (typeof info.public[channel] === typeof 0) {
							channel = channel + ' ' + '(' + info.public[channel] + ')'
						}
						newLineChannels.push('?' + channel)
					}
					console.log(newLineChannels)
					channels[i] = newLineChannels.join(' ')
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

$('#footer').onclick = function () {
	$('#chatinput').focus();
}

$('#chatinput').onkeydown = function (e) {
	if (e.keyCode == 13 /* ENTER */ && !e.shiftKey) {
		e.preventDefault();

		if (!wasConnected) {
			pushMessage({ nick: '*', text: "Attempting to reconnect. . ." })
			join(myChannel);
		}

		// Submit message
		if (e.target.value != '') {
			var text = e.target.value;
			e.target.value = '';

			if (templateStr) {
				if (templateStr.indexOf('%m') > -1) {
					text = templateStr.replace('%m', text);
				}
			}

			if (kolorful) {
				send({ cmd: 'changecolor', color: Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0") })
			}

			if (purgatory) {
				send({ cmd: 'emote', text: text });
			} else {
				send({ cmd: 'chat', text: text });
			}

			lastSent[0] = text;
			lastSent.unshift("");
			lastSentPos = 0;

			updateInputSize();
		}
	} else if (e.keyCode == 38 /* UP */) {
		// Restore previous sent messages
		if (e.target.selectionStart === 0 && lastSentPos < lastSent.length - 1) {
			e.preventDefault();

			if (lastSentPos == 0) {
				lastSent[0] = e.target.value;
			}

			lastSentPos += 1;
			e.target.value = lastSent[lastSentPos];
			e.target.selectionStart = e.target.selectionEnd = e.target.value.length;

			updateInputSize();
		}
	} else if (e.keyCode == 40 /* DOWN */) {
		if (e.target.selectionStart === e.target.value.length && lastSentPos > 0) {
			e.preventDefault();

			lastSentPos -= 1;
			e.target.value = lastSent[lastSentPos];
			e.target.selectionStart = e.target.selectionEnd = 0;

			updateInputSize();
		}
	} else if (e.keyCode == 27 /* ESC */) {
		e.preventDefault();

		// Clear input field
		e.target.value = "";
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

		var pos = e.target.selectionStart || 0;
		var text = e.target.value;
		var index = text.lastIndexOf('@', pos);

		var autocompletedNick = false;

		if (index >= 0) {
			var stub = text.substring(index + 1, pos).toLowerCase();
			// Search for nick beginning with stub
			var nicks = onlineUsers.filter(function (nick) {
				return nick.toLowerCase().indexOf(stub) == 0
			});

			if (nicks.length > 0) {
				autocompletedNick = true;
				if (nicks.length == 1) {
					insertAtCursor(nicks[0].substr(stub.length) + " ");
				}
			}
		}

		// Since we did not insert a nick, we insert a tab character
		if (!autocompletedNick) {
			insertAtCursor('\t');
		}
	}
}

function updateInputSize() {
	var atBottom = isAtBottom();

	var input = $('#chatinput');
	input.style.height = 0;
	input.style.height = input.scrollHeight + 'px';
	document.body.style.marginBottom = $('#footer').offsetHeight + 'px';

	if (atBottom) {
		window.scrollTo(0, document.body.scrollHeight);
	}
}

$('#chatinput').oninput = function () {
	updateInputSize();
}

/* sidebar */

$('#sidebar').onmouseenter = $('#sidebar').ontouchstart = function (e) {
	$('#sidebar-content').classList.remove('hidden');
	$('#sidebar').classList.add('expand');
	e.stopPropagation();
}

$('#sidebar').onmouseleave = document.ontouchstart = function (event) {
	var e = event.toElement || event.relatedTarget;
	try {
		if (e.parentNode == this || e == this) {
			return;
		}
	} catch (e) { return; }

	if (!$('#pin-sidebar').checked) {
		$('#sidebar-content').classList.add('hidden');
		$('#sidebar').classList.remove('expand');
	}
}

$('#sidebar-close').onclick = function () {
	if (!$('#pin-sidebar').checked) {
		$('#sidebar-content').classList.add('hidden');
		$('#sidebar').classList.remove('expand');
	}
}

/* ---Sidebar buttons--- */

$('#clear-messages').onclick = function () {
	// Delete children elements
	var messages = $('#messages');
	messages.innerHTML = '';
}

$('#set-custom-color').onclick = function () {
	// Set auto changecolor
	let color = prompt('Your nickname color:(press enter without inputing to reset; input "random" to set it to random)')
	if (color == null) {
		return;
	}
	if (color == 'random') {
		myColor = 'random';
		pushMessage({ nick: '*', text: "Suessfully set your auto nickname color to random. Rejoin or join a Channel to make it go into effect." })
	} else if (/(#?)((^[0-9A-F]{6}$)|(^[0-9A-F]{3}$))/i.test(color)) {
		myColor = color.replace(/#/, '');
		pushMessage({ nick: '*', text: `Suessfully set your auto nickname color to #${myColor}. Rejoin or join a Channel to make it go into effect.` })
	} else if (color == '') {
		myColor = null;
		pushMessage({ nick: '*', text: "Suessfully disabled autocolor." })
	} else {
		pushMessage({ nick: '!', text: "Invalid color. Please give color in hex RGB code." })
	}
	localStorageSet('my-color', myColor || '')//if myColor is null, set an empty string so that when it is got it will be ('' || null) (confer {var myColor = localStorageGet('my-color') || null;} at about line 190) the value of which is null
}

$('#set-template').onclick = function () {
	// Set auto changetemplate
	let template = prompt('Your template string:(use %m to replace your message content. press enter without inputing to reset.)')
	if (template == null) {
		return;
	}
	if (template.indexOf('%m') > -1) {
		templateStr = template
		pushMessage({ nick: '*', text: "Suessfully set template." })
	} else if (template == '') {
		templateStr = null;
		pushMessage({ nick: '*', text: "Suessfully disabled template." })
	} else {
		pushMessage({ nick: '!', text: "Invalid template. " })
	}
	localStorageSet('my-template', templateStr || '')
}

$('#export-json').onclick = function () {
	navigator.clipboard.writeText(jsonLog).then(function () {
		pushMessage({ nick: '*', text: "JSON log successfully copied to clipboard. Please save it in case it may be lost." })
	}, function () {
		pushMessage({ nick: '!', text: "Failed to copy log to clipboard." })
	});
}

$('#export-readable').onclick = function () {
	navigator.clipboard.writeText(readableLog).then(function () {
		pushMessage({ nick: '*', text: "Normal log successfully copied to clipboard. Please save it in case it may be lost." })
	}, function () {
		pushMessage({ nick: '!', text: "Failed to copy log to clipboard." })
	});
}

$('#special-cmd').onclick = function () {
	let cmdText = prompt('Input command:(This is for the developer\'s friends to access some special experimental functions.)');
	if (!cmdText) {
		return;
	}
	let run = {
		copy:/*copy the x-th last message*/
			function (...args) {
				if (args == []) {
					args = ['0']
				}
				if (args.length != 1) {
					pushMessage({ nick: '!', text: `${args.length} arguments are given while 0 or 1 is needed.` })
					return
				}
				let logList = readableLog.split('\n')
				if (logList.length <= args[0] || !doLogMessages) {
					pushMessage({ nick: '!', text: `No enough logs.` })
					return
				}
				let logItem = logList[logList.length - args[0] - 1]
				navigator.clipboard.writeText(logItem).then(function () {
					pushMessage({ nick: '*', text: "Copied: " + logItem })
				}, function () {
					pushMessage({ nick: '!', text: "Failed to copy log to clipboard." })
				});
			},
		reload:
			function (...args) {
				if (args.length != 0) {
					pushMessage({ nick: '!', text: `${args.length} arguments are given while 0 is needed.` })
					return
				}
				location.reload()
			},
		coderMode:
			function (...args) {
				if (!localStorageGet('coder-mode') || localStorageGet('coder-mode') != 'true') {
					coderMode()
					localStorageSet('coder-mode', true)
				} else {
					localStorageSet('coder-mode', false)
					pushMessage({ nick: '*', text: `Refresh to hide coder buttons.` })
				}
			},
		test:
			function (...args) {
				pushMessage({ nick: '!', text: `${args.length} arguments ${args}` })
			},
		about:
			function (...args) {
				let a = 'HC++ Made by 4n0n4me at hcer.netlify.app'
				console.log(a)
			},
		colorful:
			function (...args) {
				kolorful = true
			},
		raw:
			function (...args) {
				let escaped = mdEscape(cmdText.slice(4))
				pushMessage({ nick: '*', text: `\`\`\`\n${escaped}\n\`\`\`` })
				navigator.clipboard.writeText(escaped).then(function () {
					pushMessage({ nick: '*', text: "Escaped text copied to clipboard." })
				}, function () {
					pushMessage({ nick: '!', text: "Failed to copy log to clipboard." })
				});
			}
	}
	cmdArray = cmdText.split(' ')
	if (run[cmdArray[0]]) {
		run[cmdArray[0]](...cmdArray.slice(1))
	} else {
		pushMessage({ nick: '!', text: "No such function: " + cmdArray[0] })
	}
}

function coderMode() {
	for (char of ['(', ')', '"']) {
		btn = document.createElement('button')
		btn.type = 'button'
		btn.classList.add('char')
		btn.textContent = char
		btn.onclick = function () {
			insertAtCursor(btn.innerHTML)
		}
		$('#more-mobile-btns').appendChild(btn)
	}
}

if (localStorageGet('coder-mode') == 'true') {
	coderMode()
}

$('#img-upload').onclick = function () {
	if (localStorageGet('image-upload') != 'true') {
		confirmed = confirm('Image host provided by Dataeverything team. All uploads on your own responsibility.')
		if (confirmed) {
			localStorageSet('image-upload', true)
		} else {
			return
		}
	}
	window.open('https://img.thz.cool/upload', 'newwindow', 'height=512, width=256, top=50%,left=50%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no')
}

/* ---Sidebar settings--- */

// Restore settings from localStorage

if (localStorageGet('pin-sidebar') == 'true') {
	$('#pin-sidebar').checked = true;
	$('#sidebar-content').classList.remove('hidden');
}

if (localStorageGet('joined-left') == 'false') {
	$('#joined-left').checked = false;
}

if (localStorageGet('parse-latex') == 'false') {
	$('#parse-latex').checked = false;
	md.inline.ruler.disable(['katex']);
	md.block.ruler.disable(['katex']);
}

$('#pin-sidebar').onchange = function (e) {
	localStorageSet('pin-sidebar', !!e.target.checked);
}

$('#joined-left').onchange = function (e) {
	localStorageSet('joined-left', !!e.target.checked);
}

$('#parse-latex').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('parse-latex', enabled);
	if (enabled) {
		md.inline.ruler.enable(['katex']);
		md.block.ruler.enable(['katex']);
	} else {
		md.inline.ruler.disable(['katex']);
		md.block.ruler.disable(['katex']);
	}
}

if (localStorageGet('syntax-highlight') == 'false') {
	$('#syntax-highlight').checked = false;
	markdownOptions.doHighlight = false;
}

$('#syntax-highlight').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('syntax-highlight', enabled);
	markdownOptions.doHighlight = enabled;
}

if (localStorageGet('allow-imgur') == 'false') {
	$('#allow-imgur').checked = false;
	allowImages = false;
	$('#allow-all-img').disabled = true;
} else {
	$('#allow-imgur').checked = true;
	allowImages = true;
}


if (localStorageGet('whitelist-disabled') == 'true') {
	$('#allow-all-img').checked = true;
	whitelistDisabled = true;
} else {
	$('#allow-all-img').checked = false;
	whitelistDisabled = false;
}

$('#allow-imgur').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('allow-imgur', enabled);
	allowImages = enabled;
	$('#allow-all-img').disabled = !enabled;
}

$('#allow-all-img').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('whitelist-disabled', enabled);
	whitelistDisabled = enabled;
}

if (localStorageGet('soft-mention') == 'true') {
	$('#soft-mention').checked = true;
	softMention = true;
} else {
	$('#soft-mention').checked = false;
	softMention = false;
}

$('#soft-mention').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('soft-mention', enabled);
	softMention = enabled;
}

if (localStorageGet('message-log') == 'true') {
	$('#message-log').checked = true;
	doLogMessages = true;
} else {
	$('#message-log').checked = false;
	doLogMessages = false;
}
logOnOff()

$('#message-log').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('message-log', enabled);
	doLogMessages = enabled;
	logOnOff()
}

function logOnOff() {
	let a;
	if (doLogMessages) { a = '[log enabled]' } else { a = '[log disabled]' }
	jsonLog += a;
	readableLog += '\n' + a;
}

if (localStorageGet('mobile-btn') == 'true') {
	$('#mobile-btn').checked = true;
} else {
	$('#mobile-btn').checked = false;
	$('#mobile-btns').classList.add('hidden');
	$('#more-mobile-btns').classList.add('hidden');
}

updateInputSize();

$('#mobile-btn').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('mobile-btn', enabled);
	if (enabled) {
		$('#mobile-btns').classList.remove('hidden');
		$('#more-mobile-btns').classList.remove('hidden');
	} else {
		$('#mobile-btns').classList.add('hidden');
		$('#more-mobile-btns').classList.add('hidden');
	}
	updateInputSize();
}

if (localStorageGet('should-get-info') == 'true') {
	$('#should-get-info').checked = true;
	shouldGetInfo = true;
} else {
	$('#should-get-info').checked = false;
	shouldGetInfo = false;
}

$('#should-get-info').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('should-get-info', enabled);
	shouldGetInfo = enabled;
}

/* ---Buttons for some mobile users--- */

$('#tab').onclick = function () {
	var pos = $('#chatinput').selectionStart || 0;
	var text = $('#chatinput').value;
	var index = text.lastIndexOf('@', pos);

	var autocompletedNick = false;

	if (index >= 0) {
		var stub = text.substring(index + 1, pos).toLowerCase();
		// Search for nick beginning with stub
		var nicks = onlineUsers.filter(function (nick) {
			return nick.toLowerCase().indexOf(stub) == 0
		});

		if (nicks.length > 0) {
			autocompletedNick = true;
			if (nicks.length == 1) {
				insertAtCursor(nicks[0].substr(stub.length) + " ");
			}
		}
	}

	// Since we did not insert a nick, we insert a tab character
	if (!autocompletedNick) {
		insertAtCursor('\t');
	}
}

document.querySelectorAll('button.char').forEach(function (el) {
	el.onclick = function () {
		insertAtCursor(el.innerHTML)
	}
})

$('#sent-pre').onclick = function () {
	if (lastSentPos < lastSent.length - 1) {
		if (lastSentPos == 0) {
			lastSent[0] = $('#chatinput').value;
		}

		lastSentPos += 1;
		$('#chatinput').value = lastSent[lastSentPos];
		$('#chatinput').selectionStart = $('#chatinput').selectionEnd = $('#chatinput').value.length;

		updateInputSize();
	}
}

$('#sent-next').onclick = function () {
	if (lastSentPos > 0) {
		lastSentPos -= 1;
		$('#chatinput').value = lastSent[lastSentPos];
		$('#chatinput').selectionStart = $('#chatinput').selectionEnd = 0;

		updateInputSize();
	}
}

$('#send').onclick = function () {
	if (!wasConnected) {
		pushMessage({ nick: '*', text: "Attempting to reconnect. . ." })
		join(myChannel);
	}

	// Submit message
	if ($('#chatinput').value != '') {
		var text = $('#chatinput').value;
		$('#chatinput').value = '';

		send({ cmd: 'chat', text: text });

		lastSent[0] = text;
		lastSent.unshift("");
		lastSentPos = 0;

		updateInputSize();
	}
}

$('#feed').onclick = function () {
	insertAtCursor('\n')
}

/* ---Sidebar user list--- */

// User list
var onlineUsers = [];
var ignoredUsers = [];

function userAdd(nick, trip) {
	if (nick.length >= 25) {
		pushMessage({ nick: '!', text: "A USER WHOSE NICKNAME HAS MORE THAN 24 CHARACTERS HAS JOINED. THIS INFINITE LOOP SCRIPT WHICH MAY CRASH YOUR BROWSER WOULD BE RUN IN OFFICIAL CLIENT:\n ```Javascript\nfor (var i = 5; i > 3; i = i + 1) { console.log(i); }\n```" })
		pushMessage({ nick: '!', text: "This is probably caused by a moderator using the `overflow` command on you. Maybe that command is one supposed to crash the browser of the target user..." })
	}

	var user = document.createElement('a');
	user.textContent = nick;

	user.onclick = function (e) {
		userInvite(nick)
	}

	user.oncontextmenu = function (e) {
		e.preventDefault()
		if (ignoredUsers.indexOf(nick) > -1) {
			userDeignore(nick)
			pushMessage({ nick: '*', text: `Cancelled ignoring nick ${nick}.` })
		} else {
			userIgnore(nick)
			pushMessage({ nick: '*', text: `Ignored nick ${nick}.` })
		}
	}

	var userLi = document.createElement('li');
	userLi.appendChild(user);

	if (trip) {
		let tripEl = document.createElement('span')
		tripEl.textContent = ' ' + trip
		tripEl.classList.add('trip')
		userLi.appendChild(tripEl)
	}

	$('#users').appendChild(userLi);
	onlineUsers.push(nick);
}

function userRemove(nick) {
	var users = $('#users');
	var children = users.children;

	for (var i = 0; i < children.length; i++) {
		var user = children[i];
		if (user.firstChild/*hc++ shows tripcodes in userlist, so a user element has two children for the nickname and the tripcode.*/.textContent == nick) {
			users.removeChild(user);
		}
	}

	var index = onlineUsers.indexOf(nick);
	if (index >= 0) {
		onlineUsers.splice(index, 1);
	}
}

function usersClear() {
	var users = $('#users');

	while (users.firstChild) {
		users.removeChild(users.firstChild);
	}

	onlineUsers.length = 0;
}

function userInvite(nick) {
	target = prompt('target channel:(defaultly random channel generated by server)')
	if (target) {
		send({ cmd: 'invite', nick: nick, to: target });
	} else {
		if (target == '') {
			send({ cmd: 'invite', nick: nick });
		}
	}
}

function userIgnore(nick) {
	ignoredUsers.push(nick)
}

function userDeignore(nick) {
	ignoredUsers.splice(ignoredUsers.indexOf(nick))
}

/* ---Sidebar switchers--- */

/* color scheme switcher */

var schemes = [
	'android',
	'android-white',
	'atelier-dune',
	'atelier-forest',
	'atelier-heath',
	'atelier-lakeside',
	'atelier-seaside',
	'banana',
	'bright',
	'bubblegum',
	'chalk',
	'default',
	'eighties',
	'fresh-green',
	'greenscreen',
	'hacker',
	'maniac',
	'mariana',
	'military',
	'mocha',
	'monokai',
	'nese',
	'ocean',
	'omega',
	'pop',
	'railscasts',
	'solarized',
	'tk-night',
	'tomorrow',
	'carrot',
	'lax',
	'Ubuntu',
	'gruvbox-light',
	'fried-egg',
	'rainbow'
];

var highlights = [
	'agate',
	'androidstudio',
	'atom-one-dark',
	'darcula',
	'github',
	'rainbow',
	'tk-night',
	'tomorrow',
	'xcode',
	'zenburn'
]

var currentScheme = 'atelier-dune';
var currentHighlight = 'darcula';

function setScheme(scheme) {
	currentScheme = scheme;
	$('#scheme-link').href = "schemes/" + scheme + ".css";
	localStorageSet('scheme', scheme);
}

function setHighlight(scheme) {
	currentHighlight = scheme;
	$('#highlight-link').href = "vendor/hljs/styles/" + scheme + ".min.css";
	localStorageSet('highlight', scheme);
}

// Add scheme options to dropdown selector
schemes.forEach(function (scheme) {
	var option = document.createElement('option');
	option.textContent = scheme;
	option.value = scheme;
	$('#scheme-selector').appendChild(option);
});

highlights.forEach(function (scheme) {
	var option = document.createElement('option');
	option.textContent = scheme;
	option.value = scheme;
	$('#highlight-selector').appendChild(option);
});

$('#scheme-selector').onchange = function (e) {
	setScheme(e.target.value);
}

$('#highlight-selector').onchange = function (e) {
	setHighlight(e.target.value);
}

// Load sidebar configaration values from local storage if available
if (localStorageGet('scheme')) {
	setScheme(localStorageGet('scheme'));
}

if (localStorageGet('highlight')) {
	setHighlight(localStorageGet('highlight'));
}

$('#scheme-selector').value = currentScheme;
$('#highlight-selector').value = currentHighlight;

/* ---Add some CSS--- */

/*
if (navigator.userAgent.indexOf('iPhone') > 0) {
	style = document.createElement('style')
	style.textContent = `
		button {
			border-radius:5%;
			padding:0%;
		}
	`
	document.getElementsByTagName('body')[0].appendChild(style)
}
*/

/* ---Main--- */

/* main */

if (myChannel == '') {
	$('#footer').classList.add('hidden');
	/*$('#sidebar').classList.add('hidden');*/
	/*I want to be able to change the settings without entering a channel*/
	$('#clear-messages').classList.add('hidden');
	$('#export-json').classList.add('hidden');
	$('#export-readable').classList.add('hidden');
	$('#users-div').classList.add('hidden');
	pushMessage({ text: frontpage });
	if (shouldGetInfo) {
		getInfo().then(function () {
			$('#messages').innerHTML = '';
			pushMessage({ text: frontpage })
		})
	}
} else {
	join(myChannel);
}

let a = 'HC++ Made by 4n0n4me at hcer.netlify.app'
console.log(a)
