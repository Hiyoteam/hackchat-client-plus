var replacements;
function loadReplacements(){
    try{
        let replacements=JSON.parse(
            localStorageGet("replacements")
        )
    }catch(e){
        let replacements={}
    }
    return replacements
}
function saveReplacements(replacements){
    localStorageSet("replacements",JSON.stringify(replacements))
}
function checkReplace(message,replaces){
    for(var single in replaces){
        let key=single;
        let value=replaces[single];
        if(message.indexOf(key) != -1){
            message=message.replaceAll(key,value)
        }
    }
}
