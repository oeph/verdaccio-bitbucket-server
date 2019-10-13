import { parseGroups, removeTrailingSlash } from '../utils';

describe('utils:removeTrailingSlash', () => {
    test('should return input string without slashes', () => {
        expect(removeTrailingSlash('123')).toEqual('123');
    });

    test('should return empty string on null input', () => {
        expect(removeTrailingSlash()).toEqual('');
    });

    test('should return empty string on empty string input', () => {
        expect(removeTrailingSlash()).toEqual('');
    });

    test('should remove trailing slash', () => {
        expect(removeTrailingSlash('test/hallo/')).toEqual('test/hallo');
    });

    test('should remove all trailing slashes', () => {
        expect(removeTrailingSlash('http://test//')).toEqual('http://test');
    });
});

describe('utils:parseGroups', () => {
    test('should return empty array on empty string', () => {
        expect(parseGroups('')).toEqual([]);
    });

    test('should return groups', () => {
        expect(parseGroups(' test , group ')).toEqual(['test', 'group']);
    });
});
