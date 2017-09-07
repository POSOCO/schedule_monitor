var state = {
    "file_path": "D:\\scada_wrldc\\"
};

module.exports.set = function (key, str) {
    state[key + ""] = str;
};

module.exports.get = function (key) {
    return state["" + key];
};