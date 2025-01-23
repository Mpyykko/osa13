const Blog = require('./blog');
const User = require('./user');
const Team = require('./team')
const Membership = require('./membership')

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

module.exports = {
  Blog,
  User,
  Team,
  Membership
};
