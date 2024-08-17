var hooks = {};
const defaultHook = { "before": [], "in": [], "after": [] };

var hook = {
    register: function (when, name, func) {
        if (!hooks[name]) {
            hooks[name] = { ...defaultHook };
        }
        hooks[name][when].push(func);
    },
    run: function (when, name, args) {
        let funcs = hooks[name]?.[when] ?? [];
        for (let func of funcs) {
            let result = func(args);
            if (result === false) {
                return false; // Prevent this event from running
            }
            if (Array.isArray(result)) {
                args = result;
            }
        }
        return args;
    }
};
