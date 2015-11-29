/**
 * Created by marcelo on 26/11/15.
 */
var titles = require('./title-codes.js');
var db = require('./database.js');
var TitleExtreme = db.TitleExtreme;
Date.prototype.format = function() {
    return this.getFullYear() + '-' +
        ((this.getMonth() < 9) ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
        '-' + ((this.getDate() < 10) ? '0' + this.getDate() : this.getDate());
};
var path = process.argv[2];
var file = process.argv[3] || (new Date().format() + '.json');
var fs = require('fs');

function createTitleExtreme(code) {
    var item = new TitleExtreme();
    item._id = db.ObjectId();
    item.code = code;
    item.extremes = [];
    return item;
}

function create(movements) {
    var first = movements[0];
    movements.sort(function(a, b){
        return a.value - b.value;
    });
    var min = movements[0];
    var max = movements.pop();
    var minDate = new Date(min.dateTime);
    var maxDate = new Date(max.dateTime);
    var minE = {percent: 100*(min.value - first.value)/first.value,
        hour: first == min ? 8 : minDate.getHours(),
        minute: first == min ? 0 : minDate.getMinutes()};
    var maxE = {percent: 100*(max.value - first.value)/first.value,
        hour: first == max ? 8 : maxDate.getHours(),
        minute: first == max ? 0 : maxDate.getMinutes()};
    return {date: first.dateTime, min: minE, max: maxE};
}

titles.forEach(function(key, title) {
    var dir = path + "/" + key + "/" + title.name;
    TitleExtreme.findOne({code: title.name}, function(err, item) {
        item = item || createTitleExtreme(title.name);
        var movements = fs.readFileSync(dir + '/' + file);
        var extreme = create(JSON.parse(movements));
        item.extremes.push(extreme);
        item.save();
    });
});