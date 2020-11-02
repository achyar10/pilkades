import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const vote = sequelize.define('vote', {
        male: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        female: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        numberOfVote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })
    vote.associate = function (models) {
        vote.belongsTo(models.candidate)
        vote.belongsTo(models.district)
        vote.belongsTo(models.tps, { as: 'tps' })
        vote.belongsTo(models.user)
    }
    sequelizePaginate.paginate(vote)
    return vote;
}