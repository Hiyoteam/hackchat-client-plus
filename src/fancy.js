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
		if (logList.length <= args[0] || !do_log_messages) {
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
	goto(...args) {
		if (args.length != 1) {
			pushMessage({ nick: '!', text: `${args.length} arguments are given while 1 is needed.` })
			return
		}
		location.href = new URL(args[0], location.href)
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
		$id('messages').innerHTML = '';
		pushMessage({ nick: '*', text: 'Info test' })
		pushMessage({ nick: '!', text: 'Warn test' })
		pushMessage({ nick: '[test]', text: '# Title test\n\ntext test\n\n[Link test](https://hcwiki.github.io/)\n\n> Quote test' })
		$id('footer').classList.remove('hidden')
	},
	addplugin(...args) {
		if (args.length != 1) {
			pushMessage({ nick: '!', text: `${args.length} arguments are given while 1 is needed.` })
			return
		}
		let plugin_address=args[0]
		//get the cmds first
		let plugins=localStorageGet("plugins")
		if(plugins != undefined){
			plugins=JSON.parse(plugins)
		}else{
			plugins=[]
		}
		//add the plugin
		plugins.push(plugin_address)
		//save
		localStorageSet("plugins",JSON.stringify(plugins))
		pushMessage({nick:"*",text:"Added plugin."})
	},
	listplugins(...args){
		let plugins=localStorageGet("plugins")
		if(plugins != undefined){
			plugins=JSON.parse(plugins)
		}else{
			plugins=[]
		}
		pushMessage({nick:"*",text:"Restigered plugins:"+JSON.stringify(plugins)})
	},
	clearplugins(...args){
		localStorageSet("plugins","[]")
		pushMessage({nick:"*",text:"Plugins cleared."})
	}
}

$id('special-cmd').onclick = function () {
	let cmdText = input.value || prompt(i18ntranslate('Input command:(This is for the developers to access/test some special experimental functions.)', 'prompt'));
	if (!cmdText) {
		return;
	}
	let cmdArray = cmdText.split(' ')
	if (run[cmdArray[0]]) {
		try{
			run[cmdArray[0]](...cmdArray.slice(1))
		}catch(e){
			pushMessage({nick:"!",text:"Error when executeing \""+cmdArray[0]+"\",Send the following error messages to the developer.\n```"+e+"\n```"})
		}
	} else {
		pushMessage({ nick: '!', text: "No such function: " + cmdArray[0] })
	}
}

function coderMode() {
	for (let char of ['(', ')', '"']) {
		let btn = document.createElement('button')
		btn.type = 'button'
		btn.classList.add('char')
		btn.textContent = char
		btn.onclick = function () {
			insertAtCursor(btn.innerHTML)
		}
		$id('more-mobile-btns').appendChild(btn)
	}
}

if (localStorageGet('coder-mode') == 'true') {
	coderMode()
}
