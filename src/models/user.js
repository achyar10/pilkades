import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        username: DataTypes.STRING(100),
        password: DataTypes.STRING,
        fullname: DataTypes.STRING,
        role: {
            type: DataTypes.ENUM,
            values: ['admin', 'superadmin'],
            defaultValue: 'admin'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['username']
            }
        ]
    })
    user.associate = function (models) {
        user.belongsTo(models.tps, {
            as: 'tps'
        })
    }
    sequelizePaginate.paginate(user)
    return user;
}