/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
'use strict';

exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['HXN'],
  /**
   * Your New Relic license key.
   */
  license_key: '563d0a1023e5aa512b9787c2fb74cf54d7cdd8c0',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
