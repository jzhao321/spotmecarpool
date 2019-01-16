import Sequelize from "sequelize";

export var seq = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
});

export const garage = seq.define("garage", {
    name: {
        type: Sequelize.STRING
    },
    current:{
        type: Sequelize.INTEGER
    },
    max:{
        type: Sequelize.INTEGER
    },
    upCount:{
        type: Sequelize.INTEGER
    },
    downCount:{
        type: Sequelize.INTEGER
    }
});

export const markers = seq.define("markers", {
    name: Sequelize.STRING,
    lat: Sequelize["DOUBLE PRECISION"],
    lng: Sequelize["DOUBLE PRECISION"],
    key: Sequelize.STRING
});

export const log = seq.define("timeLog", {
    garage: Sequelize.STRING,
    current: Sequelize.INTEGER,
    time: Sequelize.BIGINT
});
