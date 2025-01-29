const User = require('./user');
const Blog = require('./blog');
const Team = require('./team');
const Membership = require('./membership');
const ReadingList = require('./readinglist');



User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Team, { 
  through: Membership,
  as: 'teams'
});


Team.belongsToMany(User, { 
  through: Membership,
  as: 'members'
});

User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readinglist'
});

Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'read_by_users'
});

module.exports = {
  User,
  Blog,
  Team,
  Membership,
  ReadingList
};
