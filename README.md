# hackchat-client-plus

**New update: shabby i18n (Simplified Chinese) now available!!!**

A tweaked hackchat client. aka hackchat++.
Most code, and icon, are from <https://github.com/hack-chat/main>.
Hosted at https://hcer.netlify.app/ and https://hc.thz.cool/ and https://hach.chat/ and https://hcer.fourohfour.link/ (thanks to 0x24a for domains).

Some of the current features:(* means optional features, which can be set to the original behavior instead of tweaked behavior)

- Up to date (Includes all known features of 2022/10 hack-chat official client)
- Open source and safe (No message or password recording)
- Defend known latex weapons (Malicious latex messages wont be rendered but will be shown in plain text)
- Repair the display of yourself's messages (Now no matter whether you use a tripcode, you can see the nickname of yourself in a different color from others', if you haven't set a custom nickname color with `/color` or `changecolor` command.)
- Custom invite (Now you can invite another user to a certain channel decided by you instead of a random channel.)
  - You can just press enter to send a normal invite.
- Fast quote (To reply to a certain message, just rightclick the sender's nickname) (thanks to <https://crosst.chat> for this part of code)
- *Autocolor (When joining a channel, the client will automatically change your nickname color to what you want with a `changecolor` command. As you dont need to set color mannually every time, your nickname wont be colorless any more.)
- Better reconnect (When you are disconnected from the server, the client will reconnect with your nickname with an extra underline to avoid being blocked because of having the same nickname as your former connection which still exists in the server. And if it fails to reconnect, when you try to send something the client will try reconnecting again.)
- No line overflows, *even for block-level latex formulas*. (The same with official client. *And even better.*)
- More picture source can be rendered (SM-MS and postimages and 路过图床 and catbox and so on.)
- No iPhone scaling issue (When an iPhone user clicks on the input field, the website won't be scaled.)
- *Soft mention (When you mention somebody with an @ by clicking his or her nickname, the client can add a space between the @ and the nickname so that he or she won't be notified.)
- *Message log (If you choose to record messages, when the websocket connection receives a message, the json data will recorded in a string and when the client shows a message to you, the text will be recorded in a more readable format in a string. You can copy the string to the clipboard. However, if you close the tab, this log will no longer exist.)
- Defend an unknown overflow function (If a moderator tries to crash your browser by sending a join message of a nickname more than 24 characters in length, which is probably a command called `overflow`, it won't work on this client.)
- Captcha rendering optimization (Makes the captcha ~~a bit easier to read~~ way easier to read now I guess. And mobile users can ~~enjoy~~ read captcha too.)
- \*Mobile buttons (Mobile users can use ↑, ↓, Tab, and can quickly input @, *, /, #. And a send button is added for users who find enter working as a line feed. A button to close the sidebar is added as well.)
- Custom websocket url. To use it, ~~add the ws url in the url like <hcer.netlify.app/?your-channel@wss://example-ws-url.com>. If you need character `@` in your channel name, use `@@` instead.~~ set a tunnel from the sidebar instead.
  - Notice that this client is not designed to connect to multi versions of servers, so it is very likely to work wierdly connecting other chatrooms, like [Crosst-Chat](https://github.com/CrosSt-Chat/CSC-main) or [ZhangChat](https://github.com/ZhangChat-Dev-Group/ZhangChat).
  - This feature is originally made to support reverse proxy connections, in order to help those who have difficulties connecting to hack.chat.

---

## My Links

[ZhangClient](https://client.zhangsoft.cf/) (Chinese Hack.Chat client, very easy for Chinese users to use. Even some server messages translated.) （中文客户端，适合中国用户，甚至服务器消息也翻译了）

---

## 免责声明/DISCLAIMER

使用本工具即视为同意以下免责声明。
免责声明以中文为准。本工具的功能皆来源于hack-chat服务端的接口，本工具的功能皆是其它hack-chat客户端也可以实现的，本工具没有任何特别的运行原理。使用本工具或本工具的任何衍生产品发表或阅读的任何言论，本质上是通过hack-chat服务器发表或阅读的，使用其它客户端也能发表或阅读，与本工具作者无关。使用本工具或本工具的任何衍生产品发表或阅读的任何言论，不代表本工具作者的观点，与本工具作者无关。


Using this tool implies agreement to the following disclaimer. THE DISCLAIMER IS IN CHINESE. All the functions of this tool are sourced from the hack-chat server interface, and these functions can also be implemented by other hack-chat clients. THIS TOOL HAS NO SPECIAL OPERATING PRINCIPLE. Therefore, any comments or readings published or read using this tool or any other hack-chat client are essentially conducted through the hack-chat server and are unrelated to the author of this tool. PLEASE NOTE THAT ANY COMMENTS OR READINGS PUBLISHED OR READ USING THIS TOOL OR ANY OF ITS DERIVATIVE PRODUCTS DO NOT REPRESENT THE VIEWS OF THE AUTHOR OF THIS TOOL AND ARE UNRELATED TO THE AUTHOR OF THIS TOOL.

## TODOs

- [x] better userlist
- [ ] better button switcher
- [ ] better whisper
- [x] whisper mode
- [x] mode of no picture whitelist
- [ ] better ignore
- [ ] better system message

---

- [x] better close sidebar button (Now I know what is click through)
- [x] r-string mode
- [ ] auto picture upload
- [ ] elegant mode (auto *Italic*)

(Sorry, now I don't remember what do some of the todos mean, and todos that are not implemented now probably won't be implemented in the future, in favor of WIP NeoHC++.)

## Credits

- HackChat.
- 0x24a, for providing host and domains, and contrinuting to HC++ (even though I dismiss some of his ideas of updating HC++).
- [CroSst Chat](https://github.com/CrosSt-Chat/CSC-main), for providing code to implement quote reply.
- MrZhang365, for making ZhangClient which inspires me to make i18n.
- woo/DarkT, for making PipeChat and WhiteChat which inspires me to make colored user list.
- all early users (paperee, await, ...), for providing advices and giving me feedbacks.
- all users that promote HC++.
