$('#sidebar').onmouseenter = $('#sidebar').onclick = function (e) {
	if (e.target == $('#sidebar-close')) {
		return
	}
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

$('#set-template').onclick = function () {
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
$('#add-tunnel').onclick = function () {
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

$('#remove-tunnel').onclick = function () {
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

$('#img-upload').onclick = function () {
	if (localStorageGet('image-upload') != 'true') {
		confirmed = confirm(i18ntranslate('Image host provided by DataEverything team. All uploads on your own responsibility.', prompt))
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
} else {
	$('#soft-mention').checked = false;
}

$('#soft-mention').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('soft-mention', enabled);
}

if (localStorageGet('auto-precaution') == 'true') {
	$('#auto-precaution').checked = true;
} else {
	$('#auto-precaution').checked = false;
}

var autoFold

$('#auto-precaution').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('auto-precaution', enabled);
}
if (localStorageGet('auto-fold') == 'true') {
	$('#auto-fold').checked = true;
	autoFold = true;
} else {
	$('#auto-fold').checked = false;
	autoFold = false;
}

$('#auto-fold').onchange = function (e) {
	var enabled = !!e.target.checked;
	localStorageSet('auto-fold', enabled);
	autoFold = enabled;
}

var doLogMessages

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

var shouldGetInfo

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
	keyActions.tab()
}

document.querySelectorAll('button.char').forEach(function (el) {
	el.onclick = function () {
		insertAtCursor(el.innerHTML)
	}
})

$('#sent-pre').onclick = function () {
	if (lastSentPos < lastSent.length - 1) {
		keyActions.up()
	}
}

$('#sent-next').onclick = function () {
	if (lastSentPos > 0) {
		keyActions.down()
	}
}

$('#send').onclick = function () {
	keyActions.send()
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
	target = prompt(i18ntranslate('target channel:(defaultly random channel generated by server)', 'prompt'))
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
	'rainbow',
	'turbid-jade',
	'old-paper',
	'chemistory-blue',
	// 'crosst-chat-night',
	// 'crosst-chat-city',
	'backrooms-liminal',
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
	$('#scheme-link').href = "schemes/" + scheme + ".css";
	localStorageSet('scheme', scheme);
}

function setHighlight(scheme) {
	currentHighlight = scheme;
	$('#highlight-link').href = "vendor/hljs/styles/" + scheme + ".min.css";
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
	$('#tunnel-selector').appendChild(tunnel)
})
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

languages.forEach(function (item) {
	var option = document.createElement('option');
	option.textContent = item[0];
	option.value = item[1];
	$('#i18n-selector').appendChild(option);
});


$('#scheme-selector').onchange = function (e) {
	setScheme(e.target.value);
}

$('#highlight-selector').onchange = function (e) {
	setHighlight(e.target.value);
}

$('#i18n-selector').onchange = function (e) {
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

$('#scheme-selector').value = currentScheme;
$('#highlight-selector').value = currentHighlight;
$('#i18n-selector').value = lang;
$("#tunnel-selector").value = ctunnel;
