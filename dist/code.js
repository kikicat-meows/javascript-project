//Width & Height of Map
const width = 960;
const height = 500;

const lowColor = '#f9f9f9'
const highColor = '#bc2a66'
// const highColor = '#df002c'

//D3 Projection
const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([1000]);

// path generator
const path = d3.geoPath() // convert GeoJSON to SVG
    .projection(projection); // use albersUsa projection

const h1 = document.getElementById('header')

const svg = d3.select('div')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const div = d3.select('div')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);






const capitalizeCrimeRateType = function(string) {
    let words = string.split('_');
    let newWords = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let firstChar = word[0].toUpperCase();
        let rest = word.slice(1).toLowerCase();

        newWords.push(firstChar + rest);
    }

    return newWords.join(' ');
}


const d3Mapping = (year, type) => (
    d3.csv(`../data/${year}.csv`, function (data) {
        // return {
        //     year: +data.year,
        //     state: data.state,
        //     violent_crime_rate: +data.violent_crime_rate,
        //     property_crime_rate: +data.property_crime_rate,
        //     murder_rate: +data.murder_rate,
        //     rape_rate: +data.rape_rate,
        //     robbery_rate: +data.robbery_rate,
        //     aggravated_assault_rate: +data.aggravated_assault_rate,
        //     burglary_rate: +data.burglary_rate,
        //     larceny_theft_rate: +data.larceny_theft_rate,
        //     motor_vehicle_theft_rate: +data.motor_vehicle_theft_rate
        // }
        h1.innerHTML = `U.S. ${capitalizeCrimeRateType(type)} by States in ${year}`;

        let dataArray = [];
        for (var i = 0; i < data.length; i++) {
            dataArray.push(parseFloat(data[i][`${type}`]))
        }

        let minVal = d3.min(dataArray);
        let maxVal = d3.max(dataArray);

        let ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor])

        // Load GeoJSON data and merge with states data
        d3.json("us-states.json", function (json) {
            for (let i = 0; i < data.length; i++) {
                let dataState = data[i].state;

                let dataValue = data[i][`${type}`];

                for (var j = 0; j < json.features.length; j++) {
                    let jsonState = json.features[j].properties.name;

                    if (dataState == jsonState) {
                        json.features[j].properties.value = dataValue;

                        break;
                    }
                }
            }

            svg.selectAll('path')
                .data(json.features)
                .enter()
                .append('path')
                .attr('d', path)
                .style('stroke', "#fff")
                .style('stroke-width', '1')
                .style('fill', function (d) { return ramp(d.properties.value) })
                .on('mouseover', function (d) {
                    div.transition()
                        .duration(200)
                        .style('opacity', .9);
                    div.html(d.properties.name + "<br/>" + 'Rate: ' + d.properties.value)
                        .style('left', (event.clientX - 225) + 'px')
                        .style('top', (event.clientY - 30) + 'px');
                })
                .on('mouseout', function (d) {
                    div.transition()
                        .duration(500)
                        .style('opacity', 0);
                });

            // legend
            var w = 140, h = 300;

            var key = d3.select("div")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class", "legend");

            var legend = key.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "100%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            legend.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", highColor)
                .attr("stop-opacity", 1);

            legend.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", lowColor)
                .attr("stop-opacity", 1);

            key.append("rect")
                .attr("width", w - 100)
                .attr("height", h)
                .style("fill", "url(#gradient)")
                .attr("transform", "translate(0,10)");

            var y = d3.scaleLinear()
                .range([h, 0])
                .domain([minVal, maxVal]);

            var yAxis = d3.axisRight(y);

            key.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(41,10)")
                .call(yAxis)

        });
    })
)



// Scripts for when page load / variables get changed

const slider = document.getElementById('dataYear');

const radios = document.getElementsByName('crime');
let crimeRateType;

for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
        crimeRateType = radios[i].value;
    }
}

d3Mapping(slider.value, crimeRateType);

$(document).on('change', 'input[type=radio]', function() {
    crimeRateType = $('[name="crime"]:checked').val();
    d3.selectAll('svg > *').remove();
    d3Mapping(slider.value, crimeRateType);
})

slider.oninput = function() {
    d3.selectAll('svg > *').remove();
    d3Mapping(slider.value, crimeRateType);
}

