const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

let projection = d3.geoMercator()
    .scale(Math.min(width, height) / 3.25)
    .translate([width / 2, height / 1.6]);

let path = d3.geoPath().projection(projection);

const zoom = d3.zoom()
    .scaleExtent([0.5, 10])
    .on('zoom', (event) => {
        mapGroup.attr('transform', event.transform)
            .selectAll('path')
            .attr("stroke-width", 1 / event.transform.k);
    });

svg.call(zoom);

const mapGroup = svg.append("g");

d3.json("world.json").then((geoData) => {
    mapGroup.selectAll("path")
        .data(geoData.features)
        .enter().append("path")
        .each(function (d) {
            d.randomValue = Math.floor(Math.random() * 1001);
        })
        .attr("d", path)
        .attr("fill", d => `rgba(0, 128, 0, ${d.randomValue / 1000})`)
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    mapGroup.selectAll("text")
        .data(geoData.features)
        .enter().append("text")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .text(d => d.randomValue)
        .attr("fill", "#000")
        .attr("font-size", 10);
});
