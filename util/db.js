const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: false,
  },
});

const connectToDatabase = async () => {
  try {
    console.log('Attempting to connect to the database...');
    await sequelize.authenticate();
    console.log('Connection successful!');
    await runMigrations();
    console.log('Database connected');
  } catch (err) {
    console.log('Connecting to database failed:', err);
    return process.exit(1);
  }
}



const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}




module.exports = { connectToDatabase, sequelize, rollbackMigration }