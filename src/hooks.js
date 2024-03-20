var hooks = {}
// Format like:
// {"commandname":{"before":[func1,func2...],"in":[func1,func2,...],"after":[func1,func2,...]}}
var hook = {} // for storage the hook system
hook.register = function (when, name, func) {
    if (!hooks[name]) {
        // Create
        hooks[name] = { "before": [], "in": [], "after": [] }
    }
    // And the push the command
    hooks[name][when].push(func)
}
hook.run = function (when, name, args) {
    let funcs = hooks[name] ?? { "before": [], "in": [], "after": [] }
    funcs[when].forEach(element => {
        let result = element(args)
        if (result == false) {
            return false //prevent this event run
        }
        if (Array.isArray(result)) {
            args = result
        }
    })
    return args
}