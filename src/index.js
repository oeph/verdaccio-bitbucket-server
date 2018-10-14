import BitbucketServer from './bibucket-server';

/**
 * A new instance of the authentication module using bitbucket server
 * @param {Object} config 
 * @param {Object} stuff 
 * @returns {Object} new Bitbucket Authentication module
 */
export default function(config, stuff) {
  return new BitbucketServer(config, stuff);
}