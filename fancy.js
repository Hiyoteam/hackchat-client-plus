let run = {
	copy(...args) {//copy the x-th last message
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
	reload(...args) {
		if (args.length != 0) {
			pushMessage({ nick: '!', text: `${args.length} arguments are given while 0 is needed.` })
			return
		}
		location.reload()
	},
	coderMode(...args) {
		if (!localStorageGet('coder-mode') || localStorageGet('coder-mode') != 'true') {
			coderMode()
			localStorageSet('coder-mode', true)
		} else {
			localStorageSet('coder-mode', false)
			pushMessage({ nick: '*', text: `Refresh to hide coder buttons.` })
		}
	},
	test(...args) {
		pushMessage({ nick: '!', text: `${args.length} arguments ${args}` })
	},
	about(...args) {
		let a = 'HC++ Made by 4n0n4me at hcer.netlify.app'
		console.log(a)
	},
	colorful(...args) {
		kolorful = true
	},
	raw(...args) {
		let escaped = mdEscape(cmdText.slice(4))
		pushMessage({ nick: '*', text: `\`\`\`\n${escaped}\n\`\`\`` })
		navigator.clipboard.writeText(escaped).then(function () {
			pushMessage({ nick: '*', text: "Escaped text copied to clipboard." })
		}, function () {
			pushMessage({ nick: '!', text: "Failed to copy log to clipboard." })
		});
	},
	preview(...args) {
		$('#messages').innerHTML = '';
		pushMessage({ nick: '*', text: 'Info test' })
		pushMessage({ nick: '!', text: 'Warn test' })
		pushMessage({ nick: '[test]', text: '# Title test\n\ntext test\n\n[Link test](https://hcwiki.github.io/)\n\n> Quote test' })
		$('#footer').classList.remove('hidden')
	},
}

$('#special-cmd').onclick = function () {
	let cmdText = prompt(i18ntranslate('Input command:(This is for the developer\'s friends to access some special experimental functions.)', 'prompt'));
	if (!cmdText) {
		return;
	}
	cmdArray = cmdText.split(' ')
	if (run[cmdArray[0]]) {
		run[cmdArray[0]](...cmdArray.slice(1))
	} else {
		pushMessage({ nick: '!', text: "No such function: " + cmdArray[0] })
	}
}

function coderMode() {
	for (let char of ['(', ')', '"']) {
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