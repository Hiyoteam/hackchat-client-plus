try {
    // Load all allowed plugins in the localStorage
    var plugins = JSON.parse(localStorageGet("plugins") ?? "[]")
    console.log("Loading plugins:", plugins)
    let hasInvaild = false
    // add into the head
    plugins.forEach(element => {
        let e = document.createElement("script")
        if (!debugMode && getDomain(element) != "plugins.hach.chat") {
            hasInvaild = true
            console.warn("Invalid plugin: ", element)
        } else {
            e.setAttribute("src", element)
            e.setAttribute("type", "application/javascript");
            document.getElementsByTagName('head')[0].appendChild(e);
            console.log("Loaded plugin: ", element)
        }
    });
    if (hasInvaild) {
        pushMessage({ nick: "!", text: "From 2024/2/22, you can only load plugins from plugins.hach.chat due to security reasons. Please remove invaild plugins from the list." })
    }
} catch (e) {
    console.warn("Error when loading plugins")
    console.log(e)
}
