var state = {
    "file_path": "D:\\scada_wrldc\\",
    //"file_path": "C:\\Users\\Nagasudhir\\Desktop\\schedule_monitor-master\\data_files\\",
	"mh_renew_path": "D:\\mh_renew\\"
	};

module.exports.set = function (key, str) {
    state[key + ""] = str;
};

module.exports.get = function (key) {
    return state["" + key];
};