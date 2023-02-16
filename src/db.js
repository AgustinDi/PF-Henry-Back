require('dotenv').config()
const { Sequelize } = require('sequelize')
const pet = require('./Models/Pet.js')
const user = require('./Models/User.js')
const donation = require('./Models/Donation.js')
const petitionGet = require('./Models/PetitionGet.js')
const petitionGetLost = require('./Models/PetitionGetLost.js')
const petitionLoad = require('./Models/PetitionLoad.js')
const tracking = require('./Models/Tracking.js')

const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT
} = process.env

const sequelize = process.env.NODE_ENV === 'production'
  ? new Sequelize({
    database: DB_NAME,
    dialect: 'postgres',
    host: DB_HOST,
    port: DB_PORT || 5432,
    username: DB_USER,
    password: DB_PASSWORD,
    pool: {
      max: 3,
      min: 1,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      keepAlive: true
    },
    ssl: true
  })
  : new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pfmascotas`, {
    logging: false,
    native: false
  })

try {
  pet(sequelize)
  user(sequelize)
  donation(sequelize)
  petitionGet(sequelize)
  petitionGetLost(sequelize)
  petitionLoad(sequelize)
  tracking(sequelize)
} catch (e) {
  console.log(e.message)
}

const { Pet, User, Donation, PetitionGet, PetitionLoad, PetitionGetLost, Tracking } = sequelize.models

// relaciones.
Pet.hasMany(Tracking)
Tracking.belongsTo(Pet)

User.hasMany(Pet)
Pet.belongsTo(User)

User.hasMany(Donation)
Donation.belongsTo(User)

User.hasMany(PetitionGet)
PetitionGet.belongsTo(User)

User.hasMany(PetitionLoad)
PetitionLoad.belongsTo(User)

User.hasMany(PetitionGetLost)
PetitionGetLost.belongsTo(User)

module.exports = {
  ...sequelize.models,
  db: sequelize
}
