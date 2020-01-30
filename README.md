# README
# U.S. Crime Rate by States from 1984 to 2014


## Link
[Live Demo](https://kikicat-meows.github.io/javascript-project/)

## Background
This project uses JavaScript, D3.js, GeoJSON and CSS to create a choropleth map of the U.S. States using the crime rate statistics published by the [Uniform Crime Reporting Statistics (UCR)](https://www.ucrdatatool.gov/index.cfm). 

## Instructions
Once the page loads, users can select the visualization of the desired crime type using the radio buttons provided at the bottom, and drag the slider to render the desired year.

## Technologies:
* JavaScript
* CSS
* D3
* GeoJSON

## Technical Implementation Details:

The choropleth map of the U.S. States is based on the CSV data, which is retrieved using:

```
d3.csv(`./data/${year}.csv`, function (data) {
...

// Load GeoJSON data to merge with the imported states data
        d3.json("./assets/us-states.json", function (json) {
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
        }

// Data mapped using svg (and implementing mouseover tooltip)
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

...

});
```

Changes to the year (through the slider) and the crime rate type (radio buttons) rendered are detected using the following code:

```
const slider = document.getElementById('dataYear');

const radios = document.getElementsByName('crime');
let crimeRateType;

for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function(e) {
        let radio = event.target;
        if (radio.checked) {
            crimeRateType = radio.value;
            d3.selectAll('svg > *').remove();
            d3Mapping(slider.value, crimeRateType, lowColor, highColor[crimeRateType]);
        }
    });

    if (radios[i].checked) {
        crimeRateType = radios[i].value;
    }
}

slider.oninput = function () {
    d3.selectAll('svg > *').remove();
    d3Mapping(slider.value, crimeRateType, lowColor, highColor[crimeRateType]);
}
```

## Future Features:
* In addition to Crime Rate Data, implement data on population (and population distribution), actual crimes reported, and other related factors; provide corresponding options on the page to allow for selection.
* Implementing Population can also change existing tooltip to provide more general information upon hover.


