import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const candidate = sequelize.define('candidate', {
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        vision: DataTypes.TEXT,
        mission: DataTypes.TEXT,
        isBlank: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
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