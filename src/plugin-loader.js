// Load all allowed plugins in the localStorage
plugins=JSON.parse(localstorageGet("plugins"))
// add into the head
plugins.forEach(element => {
    e=document.createElement("script")
    e.setAttribute("src",element)
    document.head.appendChild(e)
});