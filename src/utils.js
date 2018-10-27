const utils = {
    removeTrailingSlash: function (serverUrl) {
        return serverUrl ? serverUrl.replace(/\/+$/, "") : "";
    },

    parseGroups: function (groupsString) {
        return groupsString ? groupsString.split(',').map(g => g.trim(g)) : [];
    }
};

export default utils;