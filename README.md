# verdaccio-bitbucket-server
Verdaccio Authentication Plugin for Bitbucket Server

## Installation

```sh
$ npm install -g verdaccio-bitbucket-server
```

## Configuration

```yaml
auth:
  bitbucket-server:
    url: "http://your-server:port"
    allow: "Team A, Developer"
    roleTypes: [groups, projects, repos]
    limit: 100 # pagination limit for bitbucket server (optional, defaults to 100)
```

### allow
The "allow" config can be used to restrict access to Verdaccio based on groups of the user from bitbucket server. In the above example, only users that have the group "Team A" or "Developer" can login.

*Hint: This can only be used if the roleTypes config is not used or does include "groups"*

### roleTypes
The "roleTypes" specifies, which entities are used for the retrieval of user roles.

## Notes
Currently only authenticate is supported. However, the current plan is to support also the other verdaccio authentication functions.