var antiLatex = true;

/**
 * @param {String} query
 * @returns {Element|HTMLElement}
 */
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

/**
 * @param {String} id
 * @returns {Element|HTMLElement}
 */
function $id(id) {
	return document.getElementById(id)
}

/* ---Markdown--- */

// initialize markdown engine
var markdownOptions = {
	html: false,
	xhtmlOut: false,
	breaks: true,
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
var camo=false || localStorageGet("test-camo")!=undefined
var camoAddrs=[
	"https://camo.hach.chat/"
];
var imgHostWhitelist = [
	'i.imgur.com',
	'imgur.com',
	'share.lyka.pro',
	'cdn.discordapp.com',
	'i.gyazo.com',
	'img.thz.cool',
	'i.loli.net', 's2.loli.net', //SM-MS图床
	's1.ax1x.com', 's2.ax1x.com', 'z3.ax1x.com', 's4.ax1x.com', //路过图床
	'i.postimg.cc', //postimages图床
	'mrpig.eu.org', //慕容猪的图床
	'gimg2.baidu.com', //百度
	'files.catbox.moe', //catbox
	'img.liyuv.top', //李鱼图床
	location.hostname, // 允许我自己
	'bed.paperee.repl.co', 'filebed.paperee.guru', // 纸片君ee的纸床
	'imagebed.s3.bitiful.net', //Dr0让加的
	'img1.imgtp.com', 'imgtp.com', // imgtp
	'api.helloos.eu.org', // HelloOsMe's API
	'cdn.luogu.com.cn', // luogu
	'i.ibb.co', // imgbb
	'picshack.net',
	'hcimg.s3.bitiful.net', //24a's
]; // Some are copied from https://github.com/ZhangChat-Dev-Group/ZhangChat/

function getDomain(link) {
	try {
		return new URL(link).hostname
	} catch (err) {
		return new URL("http://example.com").hostname
	}
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
	}else if(allowImages && camo){
		var proxiedAddr = camoAddrs[Math.floor(Math.random()*camoAddrs.length)]+"?proxyUrl="+tokens[idx].src
		var imgSrc = ' src="' + Remarkable.utils.escapeHtml(proxiedAddr) + '"';
		var title = tokens[idx].title ? (' title="' + Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title)) + '"') : '';
		var alt = ' alt="' + (tokens[idx].alt ? Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(Remarkable.utils.unescapeMd(tokens[idx].alt))) : '') + '"';
		var suffix = options.xhtmlOut ? ' /' : '';
		var scrollOnload = isAtBottom() ? ' onload="window.scrollTo(0, document.body.scrollHeight)"' : '';
		return '<a href="' + proxiedAddr + '" target="_blank" rel="noreferrer"><img' + scrollOnload + imgSrc + alt + title + suffix + ` referrerpolicy="no-referrer" onerror="this.style.display='none';let addr=document.createElement('p');addr.innerText='${Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(src))}';this.parentElement.appendChild(addr)"></a>`;
	}

	return '<a href="' + src + '" target="_blank" rel="noreferrer">' + Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(src)) + '</a>';
};

md.renderer.rules.link_open = function (tokens, idx, options) {
	var title = tokens[idx].title ? (' title="' + Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title)) + '"') : '';
	var target = options.linkTarget ? (' target="' + options.linkTarget + '"') : '';
	return '<a rel="noreferrer" onclick="return mdClick(event)" href="' + Remarkable.utils.escapeHtml(tokens[idx].href) + '"' + title + target + '>';
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

function mdClick(e) {
	e.stopPropagation();
	e = e || window.event;
	var targ = e.target || e.srcElement || e;
	if (targ.nodeType == 3) targ = targ.parentNode;
	return verifyLink(targ);
}

function verifyLink(link) {
	var linkHref = Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(link.href));
	if (linkHref !== link.innerHTML) {
		return confirm(i18ntranslate('Warning, please verify this is where you want to go: ' + linkHref, 'prompt'));
	}

	return true;
}

var verifyNickname = function (nick) {
	return /^[a-zA-Z0-9_]{1,24}$/.test(nick);
}

//LaTeX weapon and too-many-quotes weapon defence
function verifyMessage(args) {
	// iOS Safari doesn't support zero-width assertion
	if (!antiLatex) return true;
	if (/([^\s^_]+[\^_]{){8,}|(^|\n)(>[^>\n]*){5,}/.test(args.text) || /\$.*[[{]\d+(?:mm|pt|bp|dd|pc|sp|cm|cc|in|ex|em|px)[\]}].*\$/.test(args.text) || /\$\$[\s\S]*[[{]\d+(?:mm|pt|bp|dd|pc|sp|cm|cc|in|ex|em|px)[\]}][\s\S]*\$\$/.test(args.text) || /^[ \t]*(?:[+\-*][ \t]){3,}/m.test(args.text)) {
		return false;
	} else {
		return true;
	}
}

function checkLong(text) {
	return msgLineLength(text) > 8
}

function msgLineLength(text) {
	let lines = 0;
	let byteCount = 0;
	let currentSubstring = '';
	for (let i = 0; i < text.length; i++) {
		let byteLength = text.charCodeAt(i) <= 127 ? 1 : 2;
		if (text[i] === '\n') {
			if (byteCount + byteLength >= 72) {
				lines += 1;
				byteCount = 0;
				currentSubstring = '';
			}
			currentSubstring += text[i];
			lines += 1;
			byteCount = 0;
			currentSubstring = '';
		} else if (byteCount + byteLength > 72) {
			lines += 1;
			byteCount = byteLength;
			currentSubstring = text[i];
		} else {
			byteCount += byteLength;
			currentSubstring += text[i];
		}
	}
	if (currentSubstring !== '') lines += 1
	text.split("\n").forEach(e => {
		if (e.startsWith("#")) lines += 1
	})
	return lines;
}

var input = $id('chatinput');

function insertAtCursor(text) {
	var start = input.selectionStart || 0;
	var before = input.value.substr(0, start);
	var after = input.value.substr(start);

	before += text;
	input.value = before + after;
	input.selectionStart = input.selectionEnd = before.length;

	updateInputSize();
}

function backspaceAtCursor(length = 1) {
	var start = input.selectionStart || 0;
	var before = input.value.substr(0, start);
	var after = input.value.substr(start);

	before = before.slice(0, -length);
	input.value = before + after;
	input.selectionStart = input.selectionEnd = before.length;

	updateInputSize();
}
