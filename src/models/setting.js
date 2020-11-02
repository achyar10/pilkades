export default (sequelize, DataTypes) => {
    const setting = sequelize.define('setting', {
        app_name: DataTypes.STRING,
        app_logo: DataTypes.STRING,
        app_alert: DataTypes.TEXT,
        app_location: DataTypes.STRING,
        app_year: DataTypes.STRING,
        app_type: {
            type: DataTypes.ENUM,
            values: ['panitia', 'timses'],
            defaultValue: 'panitia'
        },
    })
    return setting;
}