var state = {
    "file_path": "D:\\scada_wrldc\\"
    //"file_path": "C:\\Users\\Nagasudhir\\Documents\\NodeJS Projects\\schedule_reserve\\data_files\\"
};

module.exports.set = function (key, str) {
    state[key + ""] = str;
};

module.exports.get = function (key) {
    return state["" + key];
};