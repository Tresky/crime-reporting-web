'use strict';

var db = require('../models/sequelize');

var PSW_RESET_TOKEN_VALID_FOR = 3; //hours
var ONE_HOUR = 3600000;
var repo = {};

function addAvatarToProfile(provider, url, profile) {
  if(!profile.avatars)
    profile.avatars = {};

  if(!url || url.length < 1)
    return;

  profile.avatars[provider] = url;
  if(!profile.picture)
    profile.picture = url;
}

repo.getUserById = function(id) {
  return db.User.findById(id);
};

repo.createUser = function(user) {
  return db.User.count({ where: { email: user.email } })
    .then(function(c) {
      if (c > 0)
        throw 'Account with that email address already exists.';

      var dbUser = db.User.build(user);

      dbUser.set('tokens', {});
      dbUser.set('profile', {});

      return dbUser.save();
    });
};

repo.assignResetPswToken = function(email, token) {
  return db.User.findOne({ where: { email: email } })
    .then(function(user) {
      if(!user)
        throw 'No account with that email address exists.';

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + PSW_RESET_TOKEN_VALID_FOR * ONE_HOUR;

      return user.save();
    });
};

repo.changeProfileData = function(userId, reqBody) {
  return db.User.findById(userId)
    .then(function(user) {
      user.email = reqBody.email || '';
      user.profile.name = reqBody.name || '';
      user.profile.gender = reqBody.gender || '';
      user.profile.location = reqBody.location || '';
      user.profile.website = reqBody.website || '';
      user.set('profile', user.profile);

      if(user.changed('email')) {
        return db.User.count({ where: { email: user.email } })
          .then(function(c) {
            if(c > 0)
              throw 'Cannot change e-mail address, because address ' + user.email + ' already exists';

            return user.save();
          });
      }
      return user.save();
    });
};

repo.findUserByResetPswToken = function(token) {
  return db.User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    }
  });
};

repo.removeUserById = function(userId) {
  return db.User.destroy({ where: { id: userId } });
};

repo.changeUserPassword = function(userId, newPassword) {
  return db.User.findById(userId)
    .then(function(user) {
      if(!user)
        throw 'Account not found';

      user.password = newPassword;

      return user.save();
    });
};

repo.changeUserPswAndResetToken = function(token, newPassword) {
  if(!token || token.length < 1)
    throw 'Token cannot be empty!';

  return db.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      }
    })
    .then(function(user) {
      if(!user)
        throw 'User was not found.';

      user.password = newPassword;
      user.set('resetPasswordToken', null);
      user.set('resetPasswordExpires', null);

      return user.save();
    });
};

repo.unlinkProviderFromAccount = function(provider, userId) {
  return db.User.findById(userId)
    .then(function(user) {
      if(!user)
        throw 'User was not found.';

      var attrInfo = {};
      attrInfo[provider + 'Id'] = null;
      attrInfo.tokens = user.tokens || {};
      attrInfo.tokens[provider.toLowerCase()] = null;
      if(provider === 'twitter')
        attrInfo.tokens.twitterSecret = null;

      return user.updateAttributes(attrInfo);
    });
};


/**
 * Facebook
 */
repo.linkFacebookProfile = function(userId, accessToken, refreshToken, profile) {
  var profileId = profile.id.toString();

  return db.User.findOne({ where: { facebookId: profileId } })
    .then(function(existingUser) {
      if (existingUser)
        throw 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.';

      return db.User.findById(userId);
    })
    .then(function(user) {
      user.facebookId = profileId;
      if(!user.tokens) user.tokens = {};
      if(!user.profile) user.profile = {};
      user.tokens.facebook = accessToken;
      user.profile.name = user.profile.name || profile.displayName;
      user.profile.gender = user.profile.gender || profile._json.gender;
      addAvatarToProfile('facebook', 'https://graph.facebook.com/' + profileId + '/picture?type=large', user.profile);
      user.set('tokens', user.tokens);
      user.set('profile', user.profile);

      return user.save();
    });
};

repo.createAccFromFacebook = function(accessToken, refreshToken, profile) {
  if(!profile._json) {
    throw 'Facebook profile is missing _json property!';
  }
  var profileId = profile.id.toString();

  return db.User.findOne({ where: { facebookId: profileId } })
    .then(function(existingUser) {
      if (existingUser)
        return existingUser;

      return db.User.findOne({ where: { email: profile._json.email } })
        .then(function(emailUser) {
          if (emailUser)
            throw 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.';

          var user = db.User.build({ facebookId: profileId });
          user.email = profile._json.email || ( profileId + '@facebook.com' );
          user.tokens = { facebook: accessToken };
          user.profile = {
            name: profile.displayName,
            gender: profile.gender
          };
          addAvatarToProfile('facebook', 'https://graph.facebook.com/' + profileId + '/picture?type=large', user.profile);
          return user.save();
        });
    });
};

/**
 * Google
 */
repo.linkGoogleProfile = function(userId, accessToken, tokenSecret, profile) {
  return db.User.findOne({ where: { googleId: profile.id.toString() } })
    .then(function(existingUser) {
      if (existingUser)
        throw 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.';

      return db.User.findById(userId);
    })
    .then(function(user) {
      user.googleId = profile.id.toString();
      if(!user.tokens) user.tokens = {};
      if(!user.profile) user.profile = {};
      user.tokens.google = accessToken;
      user.profile.name = user.profile.name || profile.displayName;
      user.profile.gender = user.profile.gender || profile.gender;
      addAvatarToProfile('google', (profile._json.image ? profile._json.image.url : ''), user.profile);
      user.set('tokens', user.tokens);
      user.set('profile', user.profile);

      return user.save();
    });
};

repo.createAccFromGoogle = function(accessToken, tokenSecret, profile) {
  return db.User.findOne({ where: { googleId: profile.id.toString() } })
    .then(function(existingUser) {
      if (existingUser)
        return existingUser;

      return db.User.findOne({ where: { email: profile.emails[0].value } })
        .then(function(existingEmailUser) {
          if (existingEmailUser)
            throw 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.';

          var user = db.User.build({ googleId: profile.id.toString() });
          user.email = profile.emails[0].value;
          user.tokens = { google: accessToken };
          user.profile = {
            name: profile.displayName,
            gender: profile.gender
          };
          addAvatarToProfile('google', (profile._json.image ? profile._json.image.url : ''), user.profile);
          return user.save();
        });
    });
};

module.exports = repo;
