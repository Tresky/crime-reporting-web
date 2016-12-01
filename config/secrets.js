/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */
'use strict';

module.exports = {

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  //will be generated. Take a look at the bottom of this file
  postgres: {},
  sessionTable: 'session',
  googleAnalyticsCode: process.env.GOOGLE_ANALYTICS_CODE || null,

  googleMaps: process.env.GOOGLE_MAPS_CODE || 'AIzaSyAu_I-8fBuC3d_UrovCDMCswAfWmuF-iYE',

  /*  */
  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '754220301289665',
    clientSecret: process.env.FACEBOOK_SECRET || '41860e58c256a3d7ad8267d3c1939a4a',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
    enableProof: true,
    authOptions: { scope: ['email', 'user_location'] }
  },

  google: {
    clientID: process.env.GOOGLE_ID || '828110519058.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'JdZsIaWhUFIchmC1a_IZzOHb',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
    enableProof: true,
    authOptions: { scope: 'profile email' }
  },

  twilio: {
    sid: process.env.TWILIO_SID || 'AC6f0edc4c47becc6d0a952536fc9a6025',
    token: process.env.TWILIO_TOKEN || 'a67170ff7afa2df3f4c7d97cd240d0f3'
  }
};

// constructing Postgres connection string
if (process.env.NODE_ENV === 'test') {
  module.exports.postgres = 'postgres://crime_user@127.0.0.1/test_crime';
} else {
  module.exports.postgres = process.env.DATABASE_URL || 'postgres://crime_user:123@db/crime';
}
