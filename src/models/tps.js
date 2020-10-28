import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const tps = sequelize.define('tps', {
        no_tps: DataTypes.STRING,
        address: DataTypes.TEXT,
        pic: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })
    tps.associate = function (models) {
        tps.hasMany(models.user, {
            as: 'users',
            foreignKey: 'tpsId',
            onDelete: 'CASCADE'
        })
    }
    sequelizePaginate.paginate(tps)
    return tps;
}