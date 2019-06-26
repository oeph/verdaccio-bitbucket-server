# verdaccio-bitbucket-server
![npm](https://img.shields.io/npm/v/verdaccio-bitbucket-server.svg)
![npm](https://img.shields.io/npm/dy/verdaccio-bitbucket-server.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/oeph/verdaccio-bitbucket-server.svg)
![NPM](https://img.shields.io/npm/l/verdaccio-bitbucket-server.svg)

[Verdaccio](https://github.com/verdaccio/verdaccio) Authentication Plugin for Bitbucket Server

## Installation

```sh
$ npm install -g verdaccio-bitbucket-server
```

## Plugin Configuration

```yaml
auth:
  bitbucket-server:
    url: "http://your-server:port"
    allow: "Team A, Developer" # optional; default = ""
    roleTypes: [groups, projects] # optional; default = [groups, projects, repos]
    limit: 100 # optional; default = 100
```

### allow
The "allow" config can be used to restrict access to Verdaccio based on groups of the user from bitbucket server. In the above example, only users that have the group "Team A" or "Developer" can login.

**Default: "" *(empty: all groups are allowed to log in)***

*Hint: This can only be used if the roleTypes config is not used or does include "groups"*

### roleTypes
The "roleTypes" specifies, which entities are used for the retrieval of user roles.

**Default: [groups, projects, roles]**

### limit
The "limit" config specifies how many entities are fetched from the server, since paging of the responses is currently not supported.

**Default: 100**

## Package Configuration

```yaml
package:
  '**':
    access: $authenticated
    publish: $REPO_WRITE
    proxy: npmjs
    bitbucketServer: true
```

### Access rules
General rules:
- $all
- $authenticated

Package rules:
- $REPO_READ
- $REPO_WRITE
- $REPO_ADMIN

The package rules will match the respective rights for the repository.