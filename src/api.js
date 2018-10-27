import axios from 'axios';

const projectPermissions = {
    'PROJECT_VIEW': 'View',
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
    constructor({ url, pageLimit = 100 }) {
        this.url = url;
        this.pageLimit = pageLimit;
    }

    async fetchGroups(username, password) {
        const res = await axios({
            method: 'get',
            url: `${this.url}/rest/api/1.0/groups?limit=${this.pageLimit}`,
            auth: {
                username,
                password,
            }
        });
        return res.data.values || [];
    }

    async fetchProjects(username, password) {
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
        return [].concat(...values);
    }

    async fetchRepos(username, password) {
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
        return [].concat(...values);
    }
}

export { projectPermissions, repoPermissions, BitbucketServerApi };
export default BitbucketServerApi;