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

    console.log('Upgrade schema with TitleEndsDaily');
    var TitleEndsDailySchema = new Schema({_id: Schema.ObjectId, name: String, ends: [{buyAmount: Number,
        buyPrice: Number, saleAmount: Number, salePrice: Number}], price: Number, estimated: Number, percent: Number,
    averangeEstimated: Number, averangePercent: Number}, {strict: false});
    var TitleEndsDaily = database.mongoose.model('TitleEndsDaily', TitleEndsDailySchema);
    database.TitleEndsDaily = TitleEndsDaily;
};
module.exports = addSchema;