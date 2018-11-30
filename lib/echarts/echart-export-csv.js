/**
 * A Highcharts plugin for exporting data from a rendered chart as CSV, XLS or HTML table
 *
 * Author:   Torstein Honsi
 * Licence:  MIT
 * Version:  1.4.8
 */
/*global Highcharts, window, document, Blob */
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(echarts);
    }
})(function (echarts) {

    var each = echarts.util.each,
        pick = echarts.pick,
        downloadAttrSupported = document.createElement('a').download !== undefined;


    /**
     * Get the data rows as a two dimensional array
     */
    echarts.__proto__.getDataRows = function () {
        var options = ({}).csv || {},
            xAxis,
            // xAxes = this.xAxis,
            xAxes = this._model.option.xAxis,
            rows = {},
            rowArr = [],
            dataRows,
            names = [],
            i,
            x,
            xTitle,
            // Options
            dateFormat = options.dateFormat || '%Y-%m-%d %H:%M:%S',
            columnHeaderFormatter = options.columnHeaderFormatter || function (item, key, keyLength) {
                if (item instanceof echarts.Axis) {
                    return (item.options.title && item.options.title.text) ||
                        (item.isDatetimeAxis ? 'DateTime' : 'Category');
                }
                return item ? 
                    item.name + (keyLength > 1 ? ' ('+ key + ')' : '') :
                    'Category';
            },
            xAxisIndices = [];

        // Loop the series and index values
        i = 0;
        each(this._model.option.series, function (series) {
            // var keys = series.options.keys,
                pointArrayMap = series.pointArrayMap || ['y'],
                valueCount = pointArrayMap.length,
                requireSorting = series.requireSorting,
                categoryMap = {},
                // xAxisIndex = echarts.inArray(series.xAxis, xAxes),
                j;

            // Map the categories for value axes
            each(pointArrayMap, function (prop) {
                categoryMap[prop] = (series[prop + 'Axis'] && series[prop + 'Axis'].categories) || [];
            });

            if (series.options.includeInCSVExport !== false && series.visible !== false) { // #55

                // Build a lookup for X axis index and the position of the first
                // series that belongs to that X axis. Includes -1 for non-axis
                // series types like pies.
                if (!Highcharts.find(xAxisIndices, function (index) {
                    return index[0] === xAxisIndex;
                })) {
                    xAxisIndices.push([xAxisIndex, i]);
                }

                // Add the column headers, usually the same as series names
                j = 0;
                while (j < valueCount) {
                    names.push(columnHeaderFormatter(series, pointArrayMap[j], pointArrayMap.length));
                    j = j + 1;
                }

                each(series.points, function (point, pIdx) {
                    var key = requireSorting ? point.x : pIdx,
                        prop,
                        val;

                    j = 0;

                    if (!rows[key]) {
                        // Generate the row
                        rows[key] = [];
                        // Contain the X values from one or more X axes
                        rows[key].xValues = [];
                    }
                    rows[key].x = point.x;
                    rows[key].xValues[xAxisIndex] = point.x;
                    
                    // Pies, funnels, geo maps etc. use point name in X row
                    if (!series.xAxis || series.exportKey === 'name') {
                        rows[key].name = point.name;
                    }

                    while (j < valueCount) {
                        prop = pointArrayMap[j]; // y, z etc
                        val = point[prop];
                        rows[key][i + j] = pick(categoryMap[prop][val], val); // Pick a Y axis category if present
                        j = j + 1;
                    }

                });
                i = i + j;
            }
        });

        // Make a sortable array
        for (x in rows) {
            if (rows.hasOwnProperty(x)) {
                rowArr.push(rows[x]);
            }
        }

        var binding, xAxisIndex, column;
        dataRows = [names];

        i = xAxisIndices.length;
        while (i--) { // Start from end to splice in
            xAxisIndex = xAxisIndices[i][0];
            column = xAxisIndices[i][1];
            xAxis = xAxes[xAxisIndex];

            // Sort it by X values
            rowArr.sort(function (a, b) {
                return a.xValues[xAxisIndex] - b.xValues[xAxisIndex];
            });

            // Add header row
            xTitle = columnHeaderFormatter(xAxis);
            //dataRows = [[xTitle].concat(names)];
            dataRows[0].splice(column, 0, xTitle);

            // Add the category column
            each(rowArr, function (row) {

                var category = row.name;
                if (!category) {
                    if (xAxis.isDatetimeAxis) {
                        if (row.x instanceof Date) {
                            row.x = row.x.getTime();
                        }
                        category = Highcharts.dateFormat(dateFormat, row.x);
                    } else if (xAxis.categories) {
                        category = pick(
                            xAxis.names[row.x],
                            xAxis.categories[row.x],
                            row.x
                        )
                    } else {
                        category = row.x;
                    }
                }

                // Add the X/date/category
                row.splice(column, 0, category);
            });
        }
        dataRows = dataRows.concat(rowArr);

        return dataRows;
    };

    /**
     * Get a CSV string
     */
    echarts.__proto__.getCSV = function (useLocalDecimalPoint) {
        var csv = '',
            rows = this.getDataRows(),
            options = ({}).csv || {},
            itemDelimiter = options.itemDelimiter || ',', // use ';' for direct import to Excel
            lineDelimiter = options.lineDelimiter || '\n'; // '\n' isn't working with the js csv data extraction

        // Transform the rows to CSV
        each(rows, function (row, i) {
            var val = '',
                j = row.length,
                n = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.';
            while (j--) {
                val = row[j];
                if (typeof val === "string") {
                    val = '"' + val + '"';
                }
                if (typeof val === 'number') {
                    if (n === ',') {
                        val = val.toString().replace(".", ",");
                    }
                }
                row[j] = val;
            }
            // Add the values
            csv += row.join(itemDelimiter);

            // Add the line delimiter
            if (i < rows.length - 1) {
                csv += lineDelimiter;
            }
        });
        return csv;
    };

    function getContent(chart, href, extension, content, MIME) {
        var a,
            blobObject,
            name,
            options = ({}).csv || {},
            url = options.url || 'http://www.highcharts.com/studies/csv-export/download.php';

        if (chart._model.option.title.length) {
            name = chart._model.option.title[0].text.replace(/ /g, '-').toLowerCase();
        } else {
            name = 'chart';
        }

        // MS specific. Check this first because of bug with Edge (#76)
        if (window.Blob && window.navigator.msSaveOrOpenBlob) {
            // Falls to msSaveOrOpenBlob if download attribute is not supported
            blobObject = new Blob([content]);
            window.navigator.msSaveOrOpenBlob(blobObject, name + '.' + extension);

        // Download attribute supported
        } else if (downloadAttrSupported) {
            a = document.createElement('a');
            a.href = href;
            a.download = name + '.' + extension;
            chart._dom.append(a); // #111
            a.click();
            a.remove();

        } else {
            // Fall back to server side handling
            Highcharts.post(url, {
                data: content,
                type: MIME,
                extension: extension
            });
        }
    }

    /**
     * Call this on click of 'Download CSV' button
     */
    echarts.__proto__.downloadCSV = function () {
        var csv = this.getCSV(true);
        getContent(
            this,
            'data:text/csv,\uFEFF' + encodeURIComponent(csv),
            'csv',
            csv,
            'text/csv'
        );
    };

});
