let i18n = new Map([
    [
        'zh-CN', new Map([
            ['Send', '发送'],
            ['Settings', '设置'],
            ['Pin sidebar', '固定侧边栏'],
            ['Sound notifications', '提示音'],
            ['Screen notifications', '浏览器通知'],
            ['Join/left notify', '显示加入、退出消息'],
            ['Allow LaTeX', '显示LaTeX公式'],
            ['Allow Highlight', '代码高亮'],
            ['Allow Images', '显示图片'],
            ['Allow All Images (Not Recommended)', '允许所有来源的图片（不推荐）'],
            ['Soft @Mention', '@中间加空格'],
            ['Record Messages', '客户端记录信息'],
            ['Mobile buttons', '手机版按钮'],
            ['Index Online Count', '首页显示在线人数'],
            ['Language', '语言'],
            ['Color scheme', '配色方案'],
            ['Highlight scheme', '代码高亮方案'],
            ['Upload Image', '上传图片'],
            ['Clear all messages', '清空本页聊天记录'],
            ['Set auto color', '设置用户名自动改色'],
            ['Set Massage Template', '设置消息模板'],
            ['Copy JSON Record', '复制JSON记录'],
            ['Copy Message Record', '复制消息记录'],
            ['Don\'t Click', '隐藏功能'],
            ['Users online', '在线列表'],
            ['(Click user to invite; rightclick to ignore.)', '(点击邀请,右键拉黑)'],

            ['Welcome to hack.chat, a minimal, distraction-free chat application.', '欢迎来到hack.chat，最小化、无干扰的聊天室。'],
            ['You are now experiencing hack.chat with a tweaked client: hackchat\\+\\+. Official hack.chat client is at: https://hack.chat.', '你正在使用一个改版客户端，hackchat++，体验 hack.chat。官方客户端在此：https://hack.chat。'],
            ['Channels are created, joined and shared with the url, create your own channel by changing the text after the question mark. Example: ', '频道是通过网址创建、加入和分享的。通过改变问号后的内容，你就可以创建自己的频道。例如：'],
            ['There are no channel lists *for normal users*, so a secret channel name can be used for private discussions.', '没有*公开给普通人*的频道列表，所以一个秘密的频道名称可以用于私密交流。'],
            ['Here are some pre-made channels you can join: ', '以下是一些你可以加入的公开频道：'],
            ['users online, ', '个用户在线，'],
            [' channels existing when you enter this page', '个频道存在，当你进入这个首页'],
            ['(Online counts disabled', '在线人数显示已关闭'],
            ['And here\'s a random one generated just for you: ', '这是一个为你准备的随机频道：'],
            ['Formatting:', '排版：'],
            ['Notice: Dont send raw source code without using a code block!', '注意：不要不带代码块直接发源代码！'],
            ['Surround LaTeX with a dollar sign for inline style $\\zeta(2) = \\pi^2/6$, and two dollars for display. ', '用美元符号包裹行内公式： $\\zeta(2) = \\pi^2/6$，用两个美元符号包裹块级公式。'],
            ['For syntax highlight, wrap the code like: \\`\\`\\`<language> <the code>\\`\\`\\` where <language> is any known programming language.', '像这样包裹代码来获得语法高亮：\\`\\`\\`<编程语言名称> <代码>\\`\\`\\`'],
            ['Current Github: ', '当前Github仓库：'],
            ['Legacy GitHub: ', '旧版Github仓库：'],
            ['Bots, Android clients, desktop clients, browser extensions, docker images, programming libraries, server modules and more:', '机器人，安卓客户端，桌面客户端，浏览器扩展，Docker映像，编程库，服务端模块和更多：'],
            ['Server and web client released under the WTFPL and MIT open source license.', '服务端和网页客户端分别采用WTFPL和MIT协议开源。'],
            ['No message history is retained on the hack.chat server, but in certain channels there may be bots made by users which record messages.', '没有聊天记录保存在hack.chat服务器上，但是在某些频道，可能有用户做的机器人保存聊天记录。'],
            ['Github of hackchat++ (aka hackchat-client-plus)', 'hackchat++（又名hackchat client plus）的Github：'],
            ['Hosted at https://hcer.netlify.app/ and hc.thz.cool(thanks to Maggie, aka THZ, for hosting).', '托管在 https://hcer.netlify.app/ 和 hc.thz.cool（感谢Maggie，即THZ，提供托管）。'],
            ['Links: ', '友情链接：'],
            [' (Thanks for providing replying script!) ', '（感谢提供回复功能的代码）'],

            ['Please refresh to apply language. Multi language is in test and not perfect yet. ', '请刷新来应用语言设置。多语言支持目前还在测试当中，并不完美。']
        ])
    ]
])

function i18ntranslate(text) {
    if (lang == 'en-US') return text
    for (let item of i18n.get(lang)) {
        text = text.replace(item[0], item[1])
    }
    return text
}

function localStorageGet(key) {
    try {
        return window.localStorage[key]
    } catch (e) { }
}

let lang = 'en-US'

if (localStorageGet('i18n') && localStorageGet('i18n') != 'en-US') {
    if (i18n.has(localStorageGet('i18n'))) {
        document.querySelector('html').lang = lang
        lang = localStorageGet('i18n')
        document.querySelectorAll('[tr]').forEach((el) => {
            el.innerHTML = i18ntranslate(el.innerHTML)
        })
    } else {
        alert(`Sorry, we have not made language ${localStorageGet('i18n')}. You can try: zh-CN.`)
    }
}