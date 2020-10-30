import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const district = sequelize.define('district', {
        name: DataTypes.STRING
    })
    district.associate = function (models) {
        district.hasMany(models.tps, {
            as: 'tps',
            foreignKey: 'districtId',
            onDelete: 'CASCADE'
        })
    }
    sequelizePaginate.paginate(district)
    return district;
}