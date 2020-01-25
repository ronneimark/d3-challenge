// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight =560;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 20,
  bottom: 90,
  left: 90
};

// Define dimensions of the chart area
var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.95,
            d3.max(censusData, d => d[chosenXAxis]) * 1.05
        ])
        .range([0, width]);
  
    return xLinearScale;
    }

function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.95,
        d3.max(censusData, d => d[chosenYAxis]) * 1.05
        ])
        .range([height, 0]);
      
    return yLinearScale;
    }

// function used for updating xAxis var upon click on axis label

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
   }  

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
    //   .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
    
  }

function renderText(textGroup, newXScale, chosenXAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
    //   .attr("y", d => newYScale(d[chosenYAxis]));
  
    return textGroup;
    
  }

function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
    //   .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
    
  }

function renderTextY(textGroup, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
    //   .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return textGroup;
    
  }
// function renderCirclesY(circlesGroup, newYScale, chosenYaxis) {

//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cy", d => newYScale(d[chosenYAxis]));
  
//     return circlesGroup;
//   }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {

    if (chosenXAxis === "poverty") {
        var Xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "age") {
        var Xlabel = "Median Age: ";
    }
    else if (chosenXAxis === "income"){
        var Xlabel = "Median Income: $";
    }

    if (chosenYAxis === "obesity") {
        var Ylabel = "Obesity: ";
    }
    else if (chosenYAxis === "smokes") {
        var Ylabel = "Smokes: ";
    }
    else if (chosenYAxis === "healthcare"){
        var Ylabel = "Lacks Healthcare: ";
    }   

    var toolTip = d3.tip()   
        .attr("class", "d3-tip")               
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state}<br><center>${Xlabel}${d[chosenXAxis]}<br>${Ylabel}${d[chosenYAxis]}%</center>`)
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(d) { 
            toolTip.show(d, this);     
   
          })                  
          .on("mouseout", function(d, index) {       
            toolTip.hide(d);   
          });

    return circlesGroup;
};
    
d3.csv("/assets/data/data.csv").then(function(censusData) {
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        abbrev = data.abbr
        state = data.state;

    console.log(censusData)        
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(censusData, d => d.obesity)])
    // .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0)`)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("fill", "red")
        .attr("opacity",".55")
        .attr("stroke","black")
        .attr("stroke-width","1px");

    var textGroup = circlesGroup.select("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("text-anchor","middle")
        .attr("alignment-baseline","middle")
        .attr("font-family", "cursive")
        .attr("font-size", "12px")
        .text(function (d) {return(d.abbr)})
        .style("stroke","white")
        //.style("stroke-width",".5px")
        .style("fill", "white");

    // Create group for  3 x- axis labels
    var XlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%)");
    
    var incomeLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Household Income");

    var ageLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");

    // Create group for  3 y- axis labels
    var YlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(0, ${height-20})`);

    var obesityLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 200)
        .attr("y", -40)
        .attr("value", "obesity") // value to grab for event listener
        .attr("dy","1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Obesity (%)");
    
    var smokesLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 200)
        .attr("y", -60)
        .attr("value", "smokes") // value to grab for event listener
        .attr("dy","1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smokes (%)");

    var healthcareLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 200)
        .attr("y", -80)
        .attr("value", "healthcare") // value to grab for event listener
        .attr("dy","1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Lacks healthcare (%)");        
    
    // append y axis
    // chartGroup.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - chartMargin.left)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("Obesity");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    XlabelsGroup.selectAll("text")
    .on("click", function() {

      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(censusData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, chosenYAxis, yLinearScale);
      textGroup = renderText(textGroup, xLinearScale, chosenXAxis, chosenYAxis, yLinearScale);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "age") {
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "income") {
        incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);  
      }
    }
  });

    // y axis labels event listener
    YlabelsGroup.selectAll("text")
    .on("click", function() {

      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(censusData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);
      textGroup = renderTextY(textGroup, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "smokes") {
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "healthcare") {
        healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);  
      }
    }
  });


}).catch(function(error) {
console.log(error);
});