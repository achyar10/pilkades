import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const vote = sequelize.define('vote', {
        numberOfVote: DataTypes.INTEGER
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