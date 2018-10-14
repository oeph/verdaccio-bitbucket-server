const utils = {
    removeTrailingSlash: function (serverUrl) {
        return serverUrl.replace(/\/+$/, "");
    },

    parseGroups: function (groupsString) {
        return groupsString.split(',').map(g => g.trim(g));
    }
};

export default utils;