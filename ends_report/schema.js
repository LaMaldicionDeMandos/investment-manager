/**
 * Created by boot on 12/21/15.
 */
function addSchema(database) {
    console.log('Upgrade schema with TitleEnds');
    var Schema = database.Schema;
    var TitleEndsSchema = new Schema({_id: Schema.ObjectId, name: String, ends: [{date: String, ends:
        [{buyAmount: Number, buyPrice: Number, saleAmount: Number, salePrice: Number}]}]}, {strict: false});
    var TitleEnds = database.mongoose.model('TitleEnds', TitleEndsSchema);
    database.TitleEnds = TitleEnds;
};
module.exports = addSchema;