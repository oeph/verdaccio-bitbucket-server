/**
 * Removes the trailing slash for an url if there is any.
 * @param {string} serverUrl url for which the trailing slash should be removed
 * @returns {string} new string that contains the url without a trailing slash
 */
const removeTrailingSlash = function(serverUrl) {
    return serverUrl ? serverUrl.replace(/\/+$/, '') : '';
};

/**
 * Returns an array of groups that are taken from the input string.
 * @param {string} groupsString string that may contain several groups
 * @returns {Array} array of groups
 */
const parseGroups = function(groupsString) {
    return groupsString ? groupsString.split(',').map(g => g.trim(g)) : [];
};

export { removeTrailingSlash, parseGroups };
