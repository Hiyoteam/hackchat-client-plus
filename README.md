# hackchat-client-plus

A tweaked hackchat client. aka hackchat++.
Most code are from <https://github.com/hack-chat/main>.
Hosted at <https://hcer.netlify.app> or <https://hc.thz.cool> (thanks to Maggie, aka THZ, for hosting)

Some of the current features:(* means optional features, which can be set to the original behavior instead of tweaked behavior)

- Up to date (Includes all known features of 2022/10 hack-chat official client)
- Open source and safe (No message or password recording)
- Defend known latex weapons (Malicious latex messages wont be rendered but will be shown in plain text)
- Repair the display of yourself's messages (Now no matter whether you use a tripcode, you can see the nickname of yourself in a different color from others', if you haven't set a custom nickname color with `/color` or `changecolor` command.)
- *Custom invite (Now you can invite another user to a certain channel decided by you instead of a random channel.)
- Fast quote (To reply to a certain message, just rightclick the sender's nickname) (thanks to <https://crosst.chat> for this part of code)
- *Autocolor (When joining a channel, the client will automatically change your nickname color to what you want with a `changecolor` command. As you dont need to set color mannually every time, your nickname wont be colorless any more.)
- Better reconnect (When you are disconnected from the server, the client will reconnect with your nickname with an extra underline to avoid being blocked because of having the same nickname as your former connection which still exists in the server. And if it fails to reconnect, when you try to send something the client will try reconnecting again.)
- No line overflows (The same with official client.)
- More picture source can be rendered (SM-MS and postimages and 路过图床 and so on.)
- No iPhone scaling issue (When an iPhone user clicks on the input field, the website won't be scaled.)
- *Soft mention (When you mention somebody with an @ by clicking his or her nickname, the client can add a space between the @ and the nickname so that he or she won't be notified.)
- *Message log (If you choose to record messages, when the websocket connection receives a message, the json data will recorded in a string and when the client shows a message to you, the text will be recorded in a more readable format in a string. You can copy the string to the clipboard. However, if you close the tab, this log will no longer exist.)
- Defend an unknown overflow function (If a moderator tries to crash your browser by sending a join message of a nickname more than 24 characters in length, which is probably a command called `overflow`, it won't work on this client.)
- Captcha rendering optimization (Makes the captcha a bit easier to read.)
- Mobile buttons (Mobile users can use ↑, ↓, Tab, and can quickly input @, *, /, #. And a send button is added for users who find enter working as a line feed. A button to close the sidebar is added as well.)

---

## 免责声明/DISCLAIMER

使用本工具即视为同意以下免责声明。
免责声明以中文为准。本工具的功能皆来源于hack-chat服务端的接口，本工具的功能皆是其它hack-chat客户端也可以实现的，本工具没有任何特别的运行原理。使用本工具或本工具的任何衍生产品发表或阅读的任何言论，本质上是通过hack-chat服务器发表或阅读的，使用其它客户端也能发表或阅读，与本工具作者无关。使用本工具或本工具的任何衍生产品发表或阅读的任何言论，不代表本工具作者的观点，与本工具作者无关。

BY USING THIS TOOL, YOU AGREE TO THE FOLLOWING DISCLAIMER.
The disclaimer shall prevail in Chinese. The functions of this tool are all derived from the interface of the hack-chat server. The functions of this tool can also be implemented by other hack-chat clients. This tool does not have any special operating principle. Any remarks published or read using this tool or any derivative products of this tool are essentially published or read through the hack-chat server, and can also be published or read by using other clients, which has nothing to do with the author of this tool. Any remarks published or read using this tool or any derivative of this tool do not represent the views of the author of this tool and have nothing to do with the author of this tool.

TODO:

- [x] better userlist
- [ ] better button switcher
- [ ] better whisper
- [ ] whisper mode
- [ ] mode of no picture whitelist

---

- [ ] better close sidebar button
- [ ] r-string mode
- [ ] auto picture upload
- [ ] elegant mode (auto *Italic*)
