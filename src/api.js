import axios from 'axios';
import LRU from 'lru-cache';

const projectPermissions = {
    'PROJECT_READ': 'Read',
    'PROJECT_WRITE': 'Write',
    'PROJECT_ADMIN': 'Admin',
};

const repoPermissions = {
    'REPO_READ': 'Read',
    'REPO_WRITE': 'Write',
    'REPO_ADMIN': 'Admin',
};

class BitbucketServerApi {
    constructor({ url, pageLimit = 100, cache }) {
        this.url = url;
        this.pageLimit = pageLimit;
        this.cache = cache !== false ? new LRU({ max: 50, maxAge: 1000 * 60, ...cache }) : null;
    }

    async fetchGroups(username, password) {
        const key = `$groups$_${username}`;
        if (this.cache && this.cache.has(key))  return this.cache.get(key);
        const res = await axios({
            method: 'get',
            url: `${this.url}/rest/api/1.0/admin/users/more-members?context=${username}`,
            auth: {
                username,
                password,
            }
        });
        const result = (res.data.values || []).map(value => value.name);
        if(this.cache) this.cache.set(key, result);
        return result;
    }

    async fetchProjects(username, password) {
        const key = `$projects$_${username}`;
        if (this.cache && this.cache.has(key)) return this.cache.get(key);
        const values = await Promise.all(Object.keys(projectPermissions)
            .map(async (permission) => {
                const res = await axios({
                    method: 'get',
                    url: `${this.url}/rest/api/1.0/projects?limit=${this.pageLimit}&permission=${permission}`,
                    auth: {
                        username,
                        password,
                    }
                });
                return res.data.values.map(project => `${project.name}(${projectPermissions[permission]})`);
            }));
        const result = [].concat(...values);
        if(this.cache) this.cache.set(key, result);
        return result;
    }

    async fetchRepos(username, password) {
        const key = `$repos$_${username}`;
        if (this.cache && this.cache.has(key)) return this.cache.get(key);
        const values = await Promise.all(Object.keys(repoPermissions)
            .map(async (permission) => {
                const res = await axios({
                    method: 'get',
                    url: `${this.url}/rest/api/1.0/repos?limit=${this.pageLimit}&permission=${permission}`,
                    auth: {
                        username,
                        password,
                    }
                });
                return res.data.values.map(repo => `${repo.name}(${repoPermissions[permission]})`);
            }));
        const result = [].concat(...values);
        if(this.cache) this.cache.set(key, result);
        return result;
    }
}

export { projectPermissions, repoPermissions, BitbucketServerApi };
export default BitbucketServerApi;
