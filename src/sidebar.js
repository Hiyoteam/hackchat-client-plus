$id('sidebar').onmouseenter = $id('sidebar').onclick = function (e) {
	if (e.target == $id('sidebar-close')) {
		return
	}
	$id('sidebar-content').classList.remove('hidden');
	$id('sidebar').classList.add('expand');
	e.stopPropagation();
}

$id('sidebar').onmouseleave = document.ontouchstart = function (event) {
	var e = event.toElement || event.relatedTarget;
	try {
		if (e.parentNode == this || e == this) {
			return;
		}
	} catch (e) { return; }

	if (!$id('pin-sidebar').checked) {
		$id('sidebar-content').classList.add('hidden');
		$id('sidebar').classList.remove('expand');
	}
}

$id('sidebar-close').onclick = function () {
	if (!$id('pin-sidebar').checked) {
		$id('sidebar-content').classList.add('hidden');
		$id('sidebar').classList.remove('expand');
	}
}

/* ---Sidebar buttons--- */

$id('clear-messages').onclick = function () {
	// Delete children elements
	var messages = $id('messages');
	messages.innerHTML = '';
}

$id('set-custom-color').onclick = function () {
	// Set auto changecolor
	let color = prompt(i18ntranslate('Your nickname color:(leave blank to reset; input "random" to set it to random color)', 'prompt'))
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
		pushMessage({ nick: '*', text: "Successfully disabled autocolor." })
	} else {
		pushMessage({ nick: '!', text: "Invalid color. Please set color in hex code." })
	}
	localStorageSet('my-color', myColor || '')//if myColor is null, set an empty string so that when it is got it will be ('' || null) (confer {var myColor = localStorageGet('my-color') || null;} at about line 190) the value of which is null
}

$id('set-template').onclick = function () {
	// Set template
	let template = prompt(i18ntranslate('Your template string:(use %m to replace your message content. press enter without inputing to reset.)', 'prompt'))
	if (template == null) {
		return;
	}
	if (template.indexOf('%m') > -1) {
		const rand = String(Math.random()).slice(2)
		templateStr = template
			.replace(/\\\\/g, rand)
			.replace(/\\n/g, '\n')
			.replace(/\\t/g, '\t')
			.replace(new RegExp(rand, 'g'), '\\\\')
		pushMessage({ nick: '*', text: "Suessfully set template." })
	} else if (template == '') {
		templateStr = null;
		pushMessage({ nick: '*', text: "Suessfully disabled template." })
	} else {
		pushMessage({ nick: '!', text: "Invalid template. " })
	}
	localStorageSet('my-template', templateStr || '')
}

$id('export-json').onclick = function () {
	navigator.clipboard.writeText(jsonLog).then(function () {
		pushMessage({ nick: '*', text: "JSON log successfully copied to clipboard. Please save it in case it may be lost." })
	}, function () {
		pushMessage({ nick: '!', text: "Failed to copy log to clipboard." })
	});
}

$id('export-readable').onclick = function () {
	navigator.clipboard.writeText(readableLog).then(function () {
		pushMessage({ nick: '*', text: "Normal log successfully copied to clipboard. Please save it in case it may be lost." })
	}, function () {
		pushMessage({ nick: '!', text: "Failed to copy log to clipboard." })
	});
}
$id('add-tunnel').onclick = function () {
	let tunneladdr = prompt(i18ntranslate("Please input the tunnel URL.(IF YOU DON'T KNOW WHAT THIS DOES, CLICK CANCEL.)", "prompt"));
	if (!tunneladdr) {
		return;
	}
	if (tunneladdr.indexOf('ws') == -1) {
		alert(i18ntranslate("Invaild tunnel URL.", "prompt"))
		return;
	}
	tunnels.push(tunneladdr);
	localStorageSet('tunnels', JSON.stringify(tunnels))
	pushMessage({ nick: '*', text: "Sucessfully added tunnel." })
}

$id('remove-tunnel').onclick = function () {
	let tunneladdr = prompt(i18ntranslate("Please input the tunnel URL.(IF YOU DON'T KNOW WHAT THIS DOES, CLICK CANCEL.)", "prompt"));
	if (!tunneladdr) {
		return;
	}
	if (tunnels.indexOf(tunneladdr) == -1) {
		alert(i18ntranslate("Invaild tunnel URL.", "prompt"))
		return;
	}
	tunnels.splice(tunnels.indexOf(tunneladdr), 1);
	localStorageSet('tunnels', JSON.stringify(tunnels))
	pushMessage({ nick: '*', text: "Sucessfully removed tunnel." })
}

$("#tunnel-selector").onchange = function (e) {
	localStorageSet("current-tunnel", e.target.value)
	pushMessage({ nick: "*", text: "Sucessfully changed tunnel, refresh to apply the changes." })
}

// $id('img-upload').onclick = function () {
// 	if (localStorageGet('image-upload') != 'true') {
// 		confirmed = confirm(i18ntranslate('Image host provided by DataEverything team. All uploads on your own responsibility.', prompt))
// 		if (confirmed) {
// 			localStorageSet('image-upload', true)
// 		} else {
// 			return
// 		}
// 	}
// 	window.open('https://img.thz.cool/upload', 'newwindow', 'height=512, width=256, top=50%,left=50%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no')
// }

/* ---Sidebar settings--- */

function registerSetting(name, default_ = false, callback = null, on_register = null) {
	let checkbox = document.getElementById(name)
	let enabled = default_ ? localStorageGet(name) != 'false' : localStorageGet(name) == 'true'
	checkbox.checked = enabled
	checkbox.onchange = function (e) {
		localStorageSet(name, !!e.target.checked)
		if (typeof callback == 'function') {
			callback(!!e.target.checked)
		}
	}
	if (typeof on_register == 'function') {
		on_register(enabled)
	} else if (on_register == true || on_register == null && typeof callback == 'function') {
		callback(enabled)
	}
	return enabled
}

// Restore settings from localStorage

registerSetting('pin-sidebar', false, null, (enabled) => {
	if (enabled) {
		$id('sidebar-content').classList.remove('hidden');
	}
})

registerSetting('joined-left', true)

registerSetting('parse-latex', true, (enabled) => {
	if (enabled) {
		md.inline.ruler.enable(['katex']);
		md.block.ruler.enable(['katex']);
	} else {
		md.inline.ruler.disable(['katex']);
		md.block.ruler.disable(['katex']);
	}
}, true)

registerSetting('syntax-highlight', true, (enabled) => {
	markdownOptions.doHighlight = enabled
}, true)

registerSetting('allow-imgur', true, (enabled) => {
	allowImages = enabled
	$id('allow-all-images').disabled = !enabled
}, true)

registerSetting('allow-all-images', false, (enabled) => {
	whitelistDisabled = enabled
}, true)

registerSetting('soft-mention', false)

registerSetting('auto-precaution', false)

var auto_fold, do_log_messages, should_get_info

registerSetting('auto-fold', false, (enabled) => {
	auto_fold = enabled
}, true)

registerSetting('message-log', false, (enabled) => {
	do_log_messages = enabled
}, true)

toggleLog()

function toggleLog() {
	let _ = do_log_messages ? '[log enabled]' : '[log disabled]'
	jsonLog += _;
	readableLog += '\n' + _;
}

registerSetting('mobile-btn', false, (enabled) => {
	if (enabled) {
		$id('mobile-btns').classList.remove('hidden');
		$id('more-mobile-btns').classList.remove('hidden');
	} else {
		$id('mobile-btns').classList.add('hidden');
		$id('more-mobile-btns').classList.add('hidden');
	}
	updateInputSize()
}, true)

registerSetting('should-get-info', false, (enabled) => {
	should_get_info = enabled
}, true)

/* ---Buttons for some mobile users--- */

function createMobileButton(text, callback, id) {
	id = id ?? text.toLowerCase()
	let container = $id('more-mobile-btns')
	let button = document.createElement('button')
	button.type = 'button'
	button.classList.add('char')
	button.textContent = text
	button.onclick = typeof callback == 'function' ? callback : (
		typeof callback == 'string' ? () => insertAtCursor(callback) : () => insertAtCursor(text)
	)
	container.appendChild(button)
}

function initiateMobileButtons() {
	createMobileButton('Tab', keyActions.tab, 'mob-btn-tab')

	createMobileButton('/', '/', 'mob-btn-slash')

	createMobileButton('↑', () => {
		if (lastSentPos < lastSent.length - 1) {
			keyActions.up()
		}
	}, 'mob-btn-pre')

	createMobileButton('↓', () => {
		if (lastSentPos > 0) {
			keyActions.down()
		}
	}, 'mob-btn-next')

	createMobileButton('@', '@', 'mob-btn-at')

	createMobileButton('\\n', '\n', 'mob-btn-newline')

	createMobileButton('?', '?', 'mob-btn-question')

	createMobileButton('*', '*', 'mob-btn-astrisk')

	createMobileButton('#', '#', 'mob-btn-hash')

	createMobileButton('`', '`', 'mob-btn-backquote')
}

function clearMobileButtons() {
	$id('more-mobile-btns').innerHTML = ''
}

initiateMobileButtons()

$('#send').onclick = function () {
	keyActions.send()
}

/* ---Sidebar user list--- */

// User list
var onlineUsers = []
var ignoredUsers = []
var ignoredHashs = []
var usersInfo = {};

function userAdd(nick, user_info) {
	let trip = user_info.trip

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

	user.onmouseenter = function (e) {
		user.classList.add('nick')
		addClassToMessage(user.parentElement, user_info)
		addClassToNick(user, user_info)
	}

	user.onmouseleave = function (e) {
		user.style.removeProperty('color')
		user.className = ''
	}

	var userLi = document.createElement('li');
	userLi.appendChild(user);

	if (user_info.hash) {
		userLi.title = user_info.hash
	}

	userLi.id = `user-li-${nick}`

	if (trip) {
		let tripEl = document.createElement('span')
		tripEl.textContent = ' ' + trip
		tripEl.classList.add('trip')
		userLi.appendChild(tripEl)
	}

	$id('users').appendChild(userLi);
	onlineUsers.push(nick);

	usersInfo[nick] = user_info
}

function userRemove(nick, user_info) {
	var users = $id('users');
	var children = users.children;

	users.removeChild(document.getElementById(`user-li-${nick}`))

	var index = onlineUsers.indexOf(nick);
	if (index >= 0) {
		onlineUsers.splice(index, 1);
	}

	delete usersInfo[nick]
}

function userUpdate(args) {
	usersInfo[args.nick] = {
		...usersInfo[args.nick],
		...args
	}

	let user_info = usersInfo[args.nick]

	let user = document.getElementById(`user-li-${args.nick}`).firstChild

	user.onmouseenter = function (e) {
		user.classList.add('nick')
		addClassToMessage(user.parentElement, user_info)
		addClassToNick(user, user_info)
	}
}

function usersClear() {
	var users = $id('users');

	while (users.firstChild) {
		users.removeChild(users.firstChild);
	}

	onlineUsers.length = 0;
}

function userInvite(nick) {
	let target = prompt(i18ntranslate('target channel:(defaultly random channel generated by server)', 'prompt'))
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

function hashIgnore(hash) {
	ignoredHashs.push(hash)
}

function hashDeignore(hash) {
	ignoredHashs.splice(ignoredHashs.indexOf(hash))
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
	'ocean-OLED',
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
	'rainbow',
	'turbid-jade',
	'old-paper',
	'chemistory-blue',
	// 'crosst-chat-night',
	// 'crosst-chat-city',
	'backrooms-liminal',
	'amoled',
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

var languages = [
	['English', 'en-US'],
	['简体中文', 'zh-CN']
]

var currentScheme = 'atelier-dune';
var currentHighlight = 'darcula';

function setScheme(scheme) {
	currentScheme = scheme;
	$id('scheme-link').href = "schemes/" + scheme + ".css";
	localStorageSet('scheme', scheme);
}

function setHighlight(scheme) {
	currentHighlight = scheme;
	$id('highlight-link').href = "vendor/hljs/styles/" + scheme + ".min.css";
	localStorageSet('highlight', scheme);
}

function setLanguage(language) {
	lang = language
	localStorageSet('i18n', lang);
	pushMessage({ nick: '!', text: 'Please refresh to apply language. Multi language is in test and not perfect yet. ' }, { i18n: true })
}
// load tunnels
var tunnels = localStorageGet('tunnels');
if (tunnels) {
	tunnels = JSON.parse(tunnels);
} else {
	tunnels = ["wss://hack.chat/chat-ws"]
	localStorageSet('tunnels', JSON.stringify(tunnels))
}
var currentTunnel = localStorageGet("current-tunnel");
var ws_url
if (currentTunnel) {
	ws_url = currentTunnel
} else {
	localStorageSet("current-tunnel", "wss://hack.chat/chat-ws")
	ws_url = "wss://hack.chat/chat-ws"
}

// Add tunnels options to tunnels selector
tunnels.forEach(function (tunnelurl) {
	var tunnel = document.createElement("option");
	var link = document.createElement("a");
	link.setAttribute("href", tunnelurl);
	tunnel.textContent = link.hostname
	tunnel.value = tunnelurl
	$id('tunnel-selector').appendChild(tunnel)
})
// Add scheme options to dropdown selector
schemes.forEach(function (scheme) {
	var option = document.createElement('option');
	option.textContent = scheme;
	option.value = scheme;
	$id('scheme-selector').appendChild(option);
});

highlights.forEach(function (scheme) {
	var option = document.createElement('option');
	option.textContent = scheme;
	option.value = scheme;
	$id('highlight-selector').appendChild(option);
});

languages.forEach(function (item) {
	var option = document.createElement('option');
	option.textContent = item[0];
	option.value = item[1];
	$id('i18n-selector').appendChild(option);
});


$id('scheme-selector').onchange = function (e) {
	setScheme(e.target.value);
}

$id('highlight-selector').onchange = function (e) {
	setHighlight(e.target.value);
}

$id('i18n-selector').onchange = function (e) {
	setLanguage(e.target.value)
}

// Load sidebar configaration values from local storage if available
if (localStorageGet('scheme')) {
	setScheme(localStorageGet('scheme'));
}

let ctunnel

if (localStorageGet('highlight')) {
	setHighlight(localStorageGet('highlight'));
}

if (localStorageGet('current-tunnel')) {
	ctunnel = localStorageGet('current-tunnel')
} else {
	ctunnel = "wss://hack.chat/chat-ws"
}

$id('scheme-selector').value = currentScheme;
$id('highlight-selector').value = currentHighlight;
$id('i18n-selector').value = lang;
$("#tunnel-selector").value = ctunnel;
