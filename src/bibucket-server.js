import utils from './utils';
import axios from 'axios';

export default class Bitbucket {
    constructor(config, stuff) {
        this.serverUrl = utils.removeTrailingSlash(config.serverUrl);
        this.allowedGroups = utils.parseGroups(config.allow);
        this.pageLimit = config.limit || 100;
        this.logger = stuff.logger;
    }

    authenticate(username, password, cb) {
        return axios({
            method: 'get',
            url: `${this.serverUrl}/rest/api/1.0/groups?limit=${this.pageLimit}`,
            auth: {
                username,
                password
            }
        }).then(res => {
            const { values = [] } = res.data;
            if (values.some(group => this.allowedGroups.indexOf(group) !== -1)) {
                cb(null, values);
            } else {
                cb(null, []);
            }
        }).catch(err => {
            this.logger.warn({
                user: username,
                err: err,
            }, `Bitbucket Server Authentication error: ${err}`);
            cb(err, false);
        })
    }
}