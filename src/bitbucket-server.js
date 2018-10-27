import utils from './utils';
import BitbucketServerApi from './api';

export default class BitbucketServerAuth {
    constructor(config, stuff) {
        this.allowedGroups = utils.parseGroups(config.allow);
        this.roleTypes = config.roleTypes || ['groups'];

        this.api = new BitbucketServerApi({
            url: utils.removeTrailingSlash(config.url || config.serverUrl),
            pageLimit: config.limit,
        })

        this.logger = stuff.logger;
        this.logger.debug('[bitbucket-server] config: \n', config);
    }

    authenticate(username, password, cb) {
        this.logger.debug(`[bitbucket-server] authenticating user: ${username}`);


        const groups = this.api.fetchGroups(username, password)
            .then(groups => {
                if (this.allowedGroups.length === 0 || groups.some(group => this.allowedGroups.indexOf(group) !== -1)) {
                    this.logger.debug(`[bitbucket-server] authenticated user (${username}) with groups: ${groups.join(',')}`)
                    return groups;
                } else {
                    this.logger.debug(`[bitbucket-server] user (${username}) was not allowed to login (see config.allow)`);
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
                this.logger.warn('[bitbucket-server] Error during authentication: ', err);
                cb(err, false);
            });
    }

    adduser(username, password, cb) {
        cb(null, false);
    }
}