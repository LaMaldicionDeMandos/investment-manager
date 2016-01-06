function Chart(type, cols, colors, colsToShow) {
    cols = cols || [];
    this.type = type;
    this.displayed = true;
    this.data = {
        cols: cols,
        rows: []
    };
    this.options = {
        colors: colors || ['#0000FF'],
        defaultColors: ['#0000FF'],
        isStacked: false,
        fill: 0,
        displayExactValues: true,
        vAxis: {
            gridlines: {count: 6}
        }
    };
    var columns = [];
    var n = cols.length;
    for(var i = 0; i < n;i++) {
        columns.push(i);
    }
    this.view = {columns: colsToShow || columns};
};

Chart.Type = {
    LINE: 'LineChart',
    SCATTER: 'ScatterChart'
};

Chart.createRow = function(columns) {
    var cols = columns.map(function(value) {
        return {v: value};
    });
    return {c:cols};
};