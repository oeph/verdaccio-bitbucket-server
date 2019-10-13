import { parseGroups, removeTrailingSlash } from './utils';
import BitbucketServerApi, { repoPermissions } from './api';

const $ALL = '$all';
const $AUTH = '$authenticated';

export default class BitbucketServerAuth {
    constructor(config, stuff) {
        this.allowedGroups = parseGroups(config.allow);
        this.roleTypes = config.roleTypes || ['groups', 'projects', 'repos'];

        this.api = new BitbucketServerApi({
            url: removeTrailingSlash(config.url || config.serverUrl),
            pageLimit: config.limit,
        });

        this.logger = stuff.logger;
        this.logger.debug('[bitbucket-server] config: \n', config);
    }

    authenticate(username, password, cb) {
        this.logger.debug(
            `[bitbucket-server] authenticating user: ${username}`
        );

        const groups = this.api.fetchGroups(username, password).then(groups => {
            if (
                this.allowedGroups.length === 0 ||
                groups.some(group => this.allowedGroups.indexOf(group) !== -1)
            ) {
                this.logger.debug(
                    `[bitbucket-server] authenticated user (${username}) with groups: ${groups.join(
                        ','
                    )}`
                );
                return groups;
            } else {
                this.logger.debug(
                    `[bitbucket-server] user (${username}) was not allowed to login (see config.allow)`
                );
                throw new Error('User was not allowed to login.');
            }
        });

        const projects = this.api.fetchProjects(username, password);
        const repos = this.api.fetchRepos(username, password);

        Promise.all([groups, projects, repos])
            .then(values => {
                cb(null, [].concat(...values));
            })
            .catch(err => {
                this.logger.warn(
                    `[bitbucket-server] Error during authentication: ${err.response.status} for URL (${err.response.request.path})`
                );
                cb(err, false);
            });
    }

    adduser(username, password, cb) {
        this.logger.trace(
            '[bitbucket-server] adduser was called for user ' + username
        );
        cb(null, true);
    }

    allow_access(user, _package, cb) {
        if (!_package.bitbucketServer) return cb(null, false);

        const access = _package.access || [];

        if (access.includes($ALL)) {
            return cb(null, true);
        }

        if (user.name === undefined) {
            return cb(new Error('Acces denied. User is not authenticated.'));
        }

        if (this.matchAccessRules(user, access, _package)) {
            return cb(null, true);
        } else {
            return cb(
                new Error(
                    'Access denied. User does not have the required groups.'
                )
            );
        }
    }

    allow_publish(user, _package, cb) {
        if (!_package.bitbucketServer) return cb(null, false);

        const publish = _package.publish || [];

        if (access.includes($ALL)) {
            return cb(null, true);
        }

        if (user.name === undefined) {
            return cb(new Error('Acces denied. User is not authenticated.'));
        }

        if (this.matchAccessRules(user, publish, _package)) {
            return cb(null, true);
        } else {
            return cb(
                new Error(
                    'Access denied. User does not have the required groups.'
                )
            );
        }
    }

    matchAccessRules(user, access, _package) {
        if (access.includes($AUTH)) {
            return true;
        }
        if (
            user.real_groups !== undefined &&
            access.some(group => user.real_groups.includes(group))
        ) {
            return true;
        }
        if (
            access.some(group => repoPermissions.hasOwnProperty(group.slice(1)))
        ) {
            const permissionType = repoPermissions[group.slice(1)];
            if (
                user.real_groups.includes(`${_package.name}(${permissionType})`)
            ) {
                return true;
            }
        }
        return false;
    }
}
