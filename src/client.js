/*
 *
 * NOTE: The client side of hack.chat is currently in development,
 * a new, more modern but still minimal version will be released
 * soon. As a result of this, the current code has been deprecated
 * and will not actively be updated.
 *
*/

/* ---Websocket stuffs--- */

var wasConnected = false;

var isInChannel = false;
var purgatory = false;

var shouldAutoReconnect = true;

var isAnsweringCaptcha = false;

function join(channel, oldNick) {
	try {
		ws.close()
	} catch (e) { }

	ws = new WebSocket(WS_URL);

	wasConnected = false;

	ws.onopen = function () {
		var shouldConnect = true;
		if (!wasConnected) {
			if (location.hash) {
				myNick = location.hash.slice(1);
			} else if (typeof oldNick == 'string') {
				if (verifyNickname(oldNick.split('#')[0])) {
					myNick = oldNick;
				}
			} else {
				var newNick = prompt(i18ntranslate('Nickname:', 'prompt'), myNick);
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
		if (cmd == 'join') {
			let limiter = seconds['join']
			let time = (new Date()).getTime()
			limiter.times.push(time - limiter.last)
			limiter.last = time
			let sum = 0
			let count = 0
			for (let d = 1; d <= limiter.times.length; d++) {
				sum += limiter.times[limiter.times.length - d]
				if (sum > 1000) {
					count = d
					break
				}
			}
			limiter.times = limiter.times.slice(-count)
			if (localStorageGet('joined-left') != 'false') {
				if (count > 5 && $('#joined-left').checked) {
					$('#joined-left').checked = false // temporarily disable join/left notice
					pushMessage({ nick: '*', text: 'Frequent joining detected. Now temporarily disabling join/left notice.' })
				} else if (count < 5 && !($('#joined-left').checked)) {
					$('#joined-left').checked = true
					pushMessage({ nick: '*', text: 'Auto enabled join/left notice.' })
				}
			}
		}
		if (command) {
			command.call(null, args, message.data);
		}
		if (doLogMessages) { jsonLog += ';' + message.data }
	}
}

var COMMANDS = {
	chat: function (args, raw) {
		if (ignoredUsers.indexOf(args.nick) >= 0) {
			return;
		}
		pushMessage(args, { i18n: false, raw });
	},

	info: function (args, raw) {
		args.nick = '*';
		pushMessage(args, { i18n: true, raw });
	},

	emote: function (args, raw) {
		args.nick = '*';
		pushMessage(args, { i18n: false, raw });
	},

	warn: function (args, raw) {
		args.nick = '!';
		pushMessage(args, { i18n: true, raw });
	},

	onlineSet: function (args, raw) {
		isAnsweringCaptcha = false

		let users = args.users;
		let nicks = args.nicks;

		usersClear();

		users.forEach(function (user) {
			userAdd(user.nick, user.trip);
		});

		let nicksHTML = nicks.map(function (nick) {
			if (nick.match(/^_+$/)) {
				return nick // such nicknames made up of only underlines will be rendered into a horizontal rule. 
			}
			div = document.createElement('div')
			div.innerHTML = md.render(nick)
			return div.firstChild.innerHTML
		})

		// respectively render markdown for every nickname in order to prevent the underlines in different nicknames from being rendered as italics or bold for matching markdown syntax. 
		pushMessage({ nick: '*', text: i18ntranslate("Users online: ", 'system') + nicksHTML.join(", ") }, { i18n: false, isHtml: true, raw })

		pushMessage({ nick: '*', text: "Thanks for using hackchat++ client! Source code at: https://github.com/xjzh123/hackchat-client-plus" }, { i18n: true })

		if (myColor) {
			if (myColor == 'random') {
				myColor = Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
			}
			send({ cmd: 'changecolor', color: myColor })
		}

		isInChannel = true
	},

	onlineAdd: function (args, raw) {
		var nick = args.nick;

		userAdd(nick, args.trip);

		if ($('#joined-left').checked) {
			payLoad = { nick: '*', text: nick + " joined" }

			//onlineAdd can contain trip but onlineRemove doesnt contain trip
			if (args.trip) {
				payLoad.trip = args.trip
			}
			pushMessage(payLoad, { i18n: true, raw });
		}
	},

	onlineRemove: function (args, raw) {
		var nick = args.nick;

		userRemove(nick);

		if ($('#joined-left').checked) {
			pushMessage({ nick: '*', text: nick + " left" }, { i18n: true, raw });
		}
	},

	captcha: function (args) {
		isAnsweringCaptcha = true

		const NS = 'http://www.w3.org/2000/svg'

		let messageEl = document.createElement('div');
		messageEl.classList.add('message', 'info');


		let nickSpanEl = document.createElement('span');
		nickSpanEl.classList.add('nick');
		messageEl.appendChild(nickSpanEl);

		let nickLinkEl = document.createElement('a');
		nickLinkEl.textContent = '#';
		nickSpanEl.appendChild(nickLinkEl);

		let pEl = document.createElement('p')
		pEl.classList.add('text')

		let lines = args.text.split(/\n/g)

		// Core principle: In SVG text can be smaller than 12px even in Chrome.
		let svgEl = document.createElementNS(NS, 'svg')
		svgEl.setAttribute('white-space', 'pre')
		svgEl.style.backgroundColor = '#4e4e4e'
		svgEl.style.width = '100%'

		// In order to make 40em work right.
		svgEl.style.fontSize = `${$('#messages').clientWidth / lines[0].length * 1.5}px`
		// Captcha text is about 41 lines.
		svgEl.style.height = '41em'

		// I have tried `white-space: pre` but it didn't work, so I write each line in individual text tags.
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i]
			let textEl = document.createElementNS(NS, 'text')
			textEl.innerHTML = line

			// In order to make it in the right position. 
			textEl.setAttribute('y', `${i + 1}em`)

			// Captcha text shouldn't overflow #messages element, so I divide the width of the messages container with the overvalued length of each line in order to get an undervalued max width of each character, and than multiply it by 2 (The overvalued aspect ratio of a character) because the font-size attribute means the height of a character. 
			textEl.setAttribute('font-size', `${$('#messages').clientWidth / lines[0].length * 1.5}px`)
			textEl.setAttribute('fill', 'white')

			// Preserve spaces.
			textEl.style.whiteSpace = 'pre'

			svgEl.appendChild(textEl)
		}

		pEl.appendChild(svgEl)

		messageEl.appendChild(pEl);
		$('#messages').appendChild(messageEl);

		window.scrollTo(0, document.body.scrollHeight);
	}
}


function pushMessage(args, options = {}) {
	// for f**king shabby firefox 68
	let i18n = options.i18n !== null && options.i18n !== void 0 ? options.i18n : true
	let isHtml = options.isHtml !== null && options.isHtml !== void 0 ? options.isHtml : false // This is only for better controll to rendering. There are no backdoors to push HTML to users in my repo.
	let raw = options.raw !== null && options.raw !== void 0 ? options.raw : false
	let noFold = options.noFold !== null && options.noFold !== void 0 ? options.noFold : false

	if (i18n && args.text) {
		args.text = i18ntranslate(args.text, ['system', 'info'])
	}

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
				input.focus();
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

		if (args.color) {
			nickLinkEl.title = nickLinkEl.title + ' #' + args.color
		}

		nickSpanEl.appendChild(nickLinkEl);
	}

	// Text
	var textEl = document.createElement('p');
	textEl.classList.add('text');
	let folded = autoFold && checkLong(args.text) && !noFold
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
	if (folded) {
		textEl.classList.add('folded')
		textEl.onclick = function (e) {
			e.preventDefault()
			if (textEl.classList.contains('folded')) {
				textEl.classList.remove('folded')
			} else {
				textEl.classList.add('folded')
			}
		}
	}
	if (raw) {
		textEl.dataset.raw = raw
		textEl.dataset.displayingRaw = 'false'
		textEl.oncontextmenu = function (e) {
			if (!devMode) {
				return
			}
			e.preventDefault()
			if (textEl.dataset.displayingRaw == 'true') {
				textEl.lastElementChild.remove()
				textEl.dataset.displayingRaw = 'false'
				textEl.onmouseleave = null
			} else {
				let pEl = document.createElement('p')
				pEl.innerHTML = md.render('```json\n' + raw + '\n```')
				textEl.appendChild(pEl)
				textEl.dataset.displayingRaw = 'true'
				textEl.onmouseleave = function (e) {
					textEl.lastElementChild.remove()
					textEl.dataset.displayingRaw = 'false'
					textEl.onmouseleave = null
				}
			}
			if (isAtBottom() && myChannel/*Frontpage should not be scrolled*/) {
				window.scrollTo(0, document.body.scrollHeight)
			}
		}
	}
	// Optimize CSS of code blocks which have no specified language name: add a hjls class for them
	textEl.querySelectorAll('pre > code').forEach((element) => {
		let doElementHasClass = false
		element.classList.forEach((cls) => {
			if (cls.startsWith('language-') || cls == 'hljs') {
				doElementHasClass = true
			}
		})
		if (!doElementHasClass) {
			element.classList.add('hljs')
		}
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


function send(data) {
	if (ws && ws.readyState == ws.OPEN) {
		ws.send(JSON.stringify(data));
	}
}

/* ---Main--- */

if (myChannel == '') {
	$('#footer').classList.add('hidden');
	/*$('#sidebar').classList.add('hidden');*/
	/*I want to be able to change the settings without entering a channel*/
	$('#clear-messages').classList.add('hidden');
	$('#export-json').classList.add('hidden');
	$('#export-readable').classList.add('hidden');
	$('#users-div').classList.add('hidden');
	pushFrontPage()
	if (shouldGetInfo) {
		getInfo().then(function () {
			$('#messages').innerHTML = '';
			pushFrontPage()
		})
	}
} else {
	join(myChannel);
}

let a = 'HC++ Made by 4n0n4me at hcer.netlify.app'
console.log(a)
