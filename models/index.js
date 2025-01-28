const Blog = require('./blog');
const User = require('./user');
const Team = require('./team')
const Membership = require('./membership')
const ReadingList = require('./readinglist')

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
  as: 'reading_list'
});
Blog.belongsToMany(User, { 
  through: ReadingList,
  as: 'read_by_users'
});

module.exports = {
  Blog,
  User,
  Team,
  Membership,
  ReadingList
};