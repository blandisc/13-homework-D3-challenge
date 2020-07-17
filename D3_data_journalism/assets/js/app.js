
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("./assets/data/data.csv").then(function (povertyData) {
    // console.log(povertyData)
    // Step 1: Parse Data/Cast as numbers
     // ==============================
    povertyData.forEach( d=> {
        d.in_poverty = +d.poverty
        d.lacks_healthcare = +d.healthcare
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(povertyData, d => d.in_poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([3.5, d3.max(povertyData, d => d.lacks_healthcare)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("font-size", "16px")
        .call(xAxis);

    chartGroup.append("g")
        .style("font-size", "16px")
        .call(yAxis);
    
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup
    .append("g")
    .selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.in_poverty))
    .attr("cy", d => yLinearScale(d.lacks_healthcare))
    .attr("r", "14")
    .classed("stateCircle", true)


    // Append text
   var text = chartGroup
      .append("g")
      .selectAll("text")
      .data(povertyData)
      .enter()
      .append("text")
      .text(d=>d.abbr)
      .attr("x", d => xLinearScale(d.in_poverty))
      .attr("y", d => yLinearScale(d.lacks_healthcare))
      .classed(".stateText", true)
      .attr("dy", 5)
      .attr("text-anchor","middle")
      .attr("font-size", "13px")
      .attr("fill", "white");



    // Initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
         return (`${d.state}<br> In Poverty: ${d.in_poverty}%<br>Lacks Healthcare: ${d.lacks_healthcare}%`);
        });

    // Create tooltip in the chart
    chartGroup.call(toolTip);
    // 


    // Step 8: Create event listeners to display and hide the tooltip
     // ==============================
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
        
    text.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
      // Create axes labels
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/1.35))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Access to Healthcare (%)");

  chartGroup.append("text")
      .attr("transform", `translate(${width / 3}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Population in Poverty (%)");

});
