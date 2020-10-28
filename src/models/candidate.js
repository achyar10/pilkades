import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const candidate = sequelize.define('candidate', {
        no_urut: DataTypes.STRING(5),
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        vision: DataTypes.TEXT,
        mission: DataTypes.TEXT,
        isBlank: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['no_urut']
            }
        ]
    })
    candidate.associate = function (models) {
        candidate.hasMany(models.vote, {
            as: 'votes',
            foreignKey: 'candidateId',
            onDelete: 'CASCADE'
        })
    }
    sequelizePaginate.paginate(candidate)
    return candidate;
}