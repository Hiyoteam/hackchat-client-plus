// Handle switch states and localStorage updates
function initializeSwitch(switchElement, storageKey, onChangeCallback) {
    var storedValue = localStorageGet(storageKey);
    if (storedValue === null) {
        localStorageSet(storageKey, "false");
        switchElement.checked = false;
    } else {
        switchElement.checked = storedValue === "true";
    }

    switchElement.addEventListener('change', (event) => {
        localStorageSet(storageKey, switchElement.checked);
        if (onChangeCallback) onChangeCallback(event);
    });
}

// Request notification permissions
async function RequestNotifyPermission() {
    try {
        let result = await Notification.requestPermission();
        console.log("Notification permission: " + result);
        if (result === "granted") {
            if (notifyPermissionExplained === 0) {
                pushMessage({
                    cmd: "chat",
                    nick: "*",
                    text: "Notifications permission granted.",
                    time: null
                });
                notifyPermissionExplained = 1;
            }
        } else {
            if (notifyPermissionExplained === 0) {
                pushMessage({
                    cmd: "chat",
                    nick: "*",
                    text: "Notifications permission denied.",
                    time: null
                });
                notifyPermissionExplained = -1;
            }
        }
        return result === "granted";
    } catch (error) {
        pushMessage({
            cmd: "chat",
            nick: "*",
            text: "Unable to request notification permission.",
            time: null
        });
        console.error("Error requesting notification permissions:", error);
        return false;
    }
}

// Initialize switches
var notifySwitch = document.getElementById("notify-switch");
var soundSwitch = document.getElementById("sound-switch");

if (notifySwitch) {
    initializeSwitch(notifySwitch, "notify-api", async () => {
        if (notifySwitch.checked) {
            await RequestNotifyPermission();
        }
    });
}

if (soundSwitch) {
    initializeSwitch(soundSwitch, "notify-sound");
}

// Create notification with error handling
function spawnNotification(title, body) {
    try {
        if (!("Notification" in window)) {
            console.error("This browser does not support desktop notifications.");
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(title, { body: body, icon: "/favicon-96x96.png" });
        } else if (Notification.permission !== "denied") {
            RequestNotifyPermission().then(granted => {
                if (granted) {
                    new Notification(title, { body: body, icon: "/favicon-96x96.png" });
                }
            });
        }
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

// Handle notifications and sounds
function notify(args) {
    try {
        if (notifySwitch.checked) {
            spawnNotification("?" + myChannel + "  ·  " + args.nick, args.text);
        }

        if (soundSwitch.checked) {
            let soundElement = document.getElementById("notify-sound");
            if (soundElement) {
                let soundPromise = soundElement.play();
                if (soundPromise) {
                    soundPromise.catch(error => {
                        console.error("Problem playing sound:", error);
                    });
                }
            }
        }
    } catch (e) {
        console.error("Error in notify function:", e);
    }
}
