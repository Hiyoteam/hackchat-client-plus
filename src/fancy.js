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
		let plugin_address = args[0]
		//validate
		if (!debugMode && getDomain(plugin_address) != "plugins.hach.chat") {
			pushMessage({ nick: "!", text: "From 2024/2/22, you can only load plugins from plugins.hach.chat due to security reasons. This plugin cannot be loaded." })
			return
		}

		//get the cmds first
		let plugins = localStorageGet("plugins")
		if (plugins != undefined) {
			plugins = JSON.parse(plugins)
		} else {
			plugins = []
		}
		if (plugins.indexOf(plugin_address) > -1) {
			pushMessage({ nick: "!", text: "This plugin is already loaded." })
			return
		}
		//add the plugin
		plugins.push(plugin_address)
		//save
		localStorageSet("plugins", JSON.stringify(plugins))

		//load it NOW
		let e = document.createElement("script")
		e.setAttribute("src", plugin_address)
		e.setAttribute("type", "application/javascript");
		document.getElementsByTagName('head')[0].appendChild(e);
		console.log("Loaded plugin: ", e)
		//re-enabled bcs plugins in our plugin index are very safe
		pushMessage({ nick: "*", text: "Added plugin." })
	},
	listplugins(...args) {
		let plugins = localStorageGet("plugins")
		if (plugins != undefined) {
			plugins = JSON.parse(plugins)
		} else {
			plugins = []
		}
		pushMessage({ nick: "*", text: "Restigered plugins:" + JSON.stringify(plugins) })
	},
	clearplugins(...args) {
		localStorageSet("plugins", "[]")
		pushMessage({ nick: "*", text: "Plugins cleared." })
	},
	updatelast(...args) {
		send({ cmd: 'updateMessage', mode: 'overwrite', text: args[0], customId: lastcid });
	},
	ignorehash(...args) {
		let hash = args[0]
		if (ignoredHashs.indexOf(hash) > -1) {
			hashDeignore(hash)
			pushMessage({ nick: '*', text: `Cancelled ignoring hash ${hash}.` })
		} else {
			hashIgnore(hash)
			pushMessage({ nick: '*', text: `Ignored hash ${hash}.` })
		}
	},
	merge_config(...args) {
		if (args.length != 1) {
			pushMessage({ nick: '!', text: `${args.length} arguments are given while 1 is needed.` })
			return
		}
		pushMessage({ nick: '*', text: `Click [this](https://${args[0]}/merge-config.html#${encodeURIComponent(JSON.stringify(localStorage))}) to merge config.` })
	},
	enable_camo(...args) {
		if (args.length > 1) {
			pushMessage({ nick: '!', text: `${args.length} arguments are given while 1 or 0 is needed.` })
			return
		}
		if (args.length == 0) {
			pushMessage({ nick: '!', text: `## Warning:\n Camo is a experimental feature and currently in test.\n**ONCE YOU ENABLED IT, YOU CAN ONLY DISABLE IT VIA CONSOLE.**\nIf you are sure about enabling it, then input \`/enable_camo iamsure\`` })
		} else if (args[0] == "iamsure") {
			localStorageSet("test-camo", 1)
			pushMessage({ nick: '*', text: `Camo enabled. refresh to apply.` })
		} else {
			pushMessage({ nick: '!', text: 'Unknown arguments.' })
		}
	},
	debug(...args) {
		if (args[0] === debugCode) {
			if (debugMode) {
				pushMessage({ nick: '!', text: 'Developer mode has been enabled. To disable it, please refresh the page.' })
			} else {
				debugMode = true
				pushMessage({ nick: '*', text: 'Developer mode has been enabled.' })
				pushMessage({ nick: '!', text: 'Do not keep developer mode enabled for too long. After using it, please refresh immediately to restore protection.'})
				run.eval = (...args) => {
					try {
						let rollback = eval(args.join(" "))
						try {
							pushMessage({ nick: '*', text: JSON.stringify(rollback) })
						} catch (err) {
							pushMessage({ nick: '*', text: '[Unknown Object(Failed to show)]' })
						}
					} catch (err) {
						pushMessage({ nick: '!', text: err.message || err })
					}
				}
			}
		} else {
			debugCode = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
			pushMessage({ nick: '!', text: `You are enabling developer mode. I want you to be aware of what you are doing. Enabling this mode will disable some protections and may lead to password theft. We recommend using a non-personal password in incognito mode to test untrusted things. Executing this command may result in your password being stolen. To proceed with the execution, please run \`/debug ${debugCode}\`.` })
		}
	}
}

var debugCode = false
var debugMode = false
$id('special-cmd').onclick = function () {
	let cmdText = input.value || prompt(i18ntranslate('Input command:(This is for the developers to access/test some special experimental functions.)', 'prompt'));
	if (!cmdText) {
		return;
	}
	let cmdArray = cmdText.split(' ')
	if (run[cmdArray[0]]) {
		try {
			run[cmdArray[0]](...cmdArray.slice(1))
		} catch (e) {
			pushMessage({ nick: "!", text: "Error when executeing \"" + cmdArray[0] + "\",Send the following error messages to the developer.\n```" + e + "\n```" })
		}
	} else {
		pushMessage({ nick: '!', text: "No such function: " + cmdArray[0] })
	}
}

// Feature: let special commands could be executed just like running on server.
function parseSPCmd(input) {
	var name = input.slice(1).split(" ")[0]
	var args = input.split(" ").slice(1)
	return [name, args]
}
function isSPCmd(text) { //P.S SPCmd == SPecial Command
	return (text.startsWith('/') && (run[text.split("/")[1].split(" ")[0]] != undefined))
}
function callSPcmd(text) {
	let data = parseSPCmd(text);
	run[data[0]](...data[1])
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
