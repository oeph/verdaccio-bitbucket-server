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
    serverUrl: "http://your-server:port"
    allow: "Team A, Developer"
    limit: 100 # pagination limit for bitbucket server (optional, defaults to 100)
```

## Notes
Currently only authenticate is supported. However, the current plan is to support also the other verdaccio authentication functions.