/**
 * Created by marcelo on 20/11/15.
 */
var fs = require('fs');

Date.prototype.format = function() {
    return this.getFullYear() + '-' +
        ((this.getMonth() < 10) ? '0' + this.getMonth() : this.getMonth()) +
        '-' + ((this.getDay() < 10) ? '0' + this.getDay() : this.getDay())
};


function read(titleCode, day, path){
    return JSON.parse(fs.readFileSync(path + '/' + titleCode + '/' + day.format() + '.json', 'utf8'));
}

var path = process.argv[2];
var title = process.argv[3];

read(title, new Date(), path).forEach(function(item) {
    console.log(item.value);
});
