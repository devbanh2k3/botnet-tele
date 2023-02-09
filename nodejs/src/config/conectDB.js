

const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('tbl_databot', 'test', "12345678", {
    host: '103.169.34.2',
    dialect: 'mysql',
    logging: false
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;