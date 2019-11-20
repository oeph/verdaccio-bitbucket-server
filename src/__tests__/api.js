import BitbucketServerApi from '../api';
import axios from 'axios';

jest.mock('axios');

describe('api:BitbucketServerApi', () => {
    /** @type {BitbucketServerApi} */
    let api;

    beforeAll(() => {
        api = new BitbucketServerApi({});
        axios.mockResolvedValue({ data: { values: [] } });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetchGroups', async () => {
        expect.assertions(3);
        expect(await api.fetchGroups('user', 'pass')).toEqual([]);
        expect(await api.fetchGroups('user', 'pass')).toEqual([]);
        expect(axios.mock.calls.length).toBe(1);
    });

    it('fetchProjects', async () => {
        expect.assertions(3);
        expect(await api.fetchProjects('user', 'pass')).toEqual([]);
        expect(await api.fetchProjects('user', 'pass')).toEqual([]);
        expect(axios.mock.calls.length).toBe(3);
    });

    it('fetchRepos', async () => {
        expect.assertions(3);
        expect(await api.fetchRepos('user', 'pass')).toEqual([]);
        expect(await api.fetchRepos('user', 'pass')).toEqual([]);
        expect(axios.mock.calls.length).toBe(3);
    });

    it('no cache', async () => {
        api = new BitbucketServerApi({ cache: false });
        expect.assertions(3);
        expect(await api.fetchGroups('user', 'pass')).toEqual([]);
        expect(await api.fetchGroups('user', 'pass')).toEqual([]);
        expect(axios.mock.calls.length).toBe(2);
    });
});
