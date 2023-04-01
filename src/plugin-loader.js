// Load all allowed plugins in the localStorage
plugins=JSON.parse(localStorageGet("plugins"))
console.log("Loading plugins:",plugins)
// add into the head
plugins.forEach(element => {
    e=document.createElement("script")
    e.setAttribute("src",element)
    document.head.appendChild(e)
    console.log("Loaded plugin: ",element)
});
