/**
 * Created by boot on 12/21/15.
 */
function addSchema(database) {
    console.log('Upgrade schema with TitleTrend');
    var Schema = database.Schema;
    var TitleTrendSchema = new Schema({_id: Schema.ObjectId, name: String, up: Number, down: Number, zero: Number, days: Number,
        trend: {up: Number, down: Number, zero: Number, size: Number, ups:{}, downs: {}, zeros:{}, upsPercent: {},
            downsPercent: {}, zerosPercent: {}}, upPercent: Number, downPercent: Number, zeroPercent: Number}, {strict: false});
    var TitleTrend = database.mongoose.model('TitleTrend', TitleTrendSchema);
    database.TitleTrend = TitleTrend;
    var clean = database.clean;
    database.clean = function(callback) {
        TitleTrend.remove({});
        clean(callback);
    };
};
module.exports = addSchema;