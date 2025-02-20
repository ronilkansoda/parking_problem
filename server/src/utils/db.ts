import { Sequelize } from "sequelize";

const sequelize = new Sequelize('parking_problem', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
})

export default sequelize;
