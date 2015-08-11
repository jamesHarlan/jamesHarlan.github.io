//data, grabbed from out dataSets.js file, to be used in our visualizations
var data = dataSet;
var usPopulationData = data.usPopulation;
var bitcoinTransaction = data.bitcoinTransactions;
var svgWidth = 750;
var svgHeight = 500;

/*==================================US Population===================*/
var usPopulation = function(){



  var svg = d3.select('body')
    .append('svg')
    .attr({
      height:svgHeight,
      width:svgWidth,
    })
    .style('margin-left', 150);

  var yLabelNums = [[0,'0'],[100000,'100,000'], [200000,'200,000'], [300000,'300,000']];

  var xLabel = d3.select('svg')
                    .selectAll('text.xLabel')
                    .data(usPopulationData.data)
                    .enter()
                    .append('text')
                    .text(function(d){
                      return d[0].slice(0,4);
                    })
                    .attr({
                      'font-size':12,
                      y:function(d, i){
                        return (svgWidth - 100) / usPopulationData.data.length * (i+0.7) + 50;
                        },
                      x:function(){
                        return 70 - svgHeight ;
                      },
                      transform:'rotate(270)',
                      class:'xLabel'
                    });


  var title = d3.select('svg')
                          .append('text')
                          .text('US Population Data')
                          .attr({
                            x:svgWidth / 2 - 100,
                            y:150,
                            'font-size':24
                          });

  var yLabel = d3.select('svg')
                 .selectAll('text.yLabel')
                 .data(yLabelNums)
                 .enter()
                 .append('text')
                 .text(function(d){return d[1];})
                 .attr({
                  x:0,
                  y:function(d){
                      return (svgHeight - 100) - (d[0] / 2000);
                    },
                    'font-size':12
                  });


  var bars = d3.select('svg')
                .selectAll('rect')
                .data(usPopulationData.data)
                .enter()
                .append('rect')
                .style({opacity:0})
                .attr( 'x' , function(d, i){
                    return (svgWidth - 100) / usPopulationData.data.length * i + 50;
                })
                .attr( 'y' , function(d){
                    return  svgHeight - 100;
                })
                .attr( 'width' , (svgWidth - 100) / usPopulationData.data.length - 2)
                .attr('height', 0)
                .attr( 'fill' , 'black')
                .transition()
                .duration(1250)
                .style({
                  opacity:1
                })
                .attr( 'y' , function(d){
                    return  (svgHeight - 100) - (d[1] / 2000);
                })
                .attr(
                  'height' , function(d){
                  return ( ( d[1] / 2000 )  )  + 'px';
                });
};

/*===================================Bitcoin Transactions==========================*/

var bitcoinPlot = function(){
  svgWidth = 850;

  var bitcoinSVG = d3.select('body')
                     .append('svg')
                     .attr({
                      width : svgWidth,
                      height : svgHeight + 300
                     });

  bitcoinSVG.selectAll('rect')
            .data(bitcoinTransaction.data)
            .enter()
            .append('rect')
            .attr( 'x' , function(d, i){
                return (100 - svgWidth) / bitcoinTransaction.data.length * i + svgWidth;
            })
            .attr( 'y' , function(d){
                return  svgHeight + 200;
            })
            .attr( 'width' , 1)
            .attr('height', 0)
            .attr( 'fill' , 'teal')
            .transition()
            .duration(5000)
            .attr( 'y' , function(d){
                return  (svgHeight + 200) - (d[1] / 125000);
            })
            .attr( 'height' , function(d){
              return ( ( d[1] / 125000 )  )  + 'px';
            });


  var yAxis = d3.svg.axis()
                .scale(5)
                .orient('left');

  var bitcoinYear = [[2009, 2406],[2010, 2043],[2011, 1678],[2012, 1313],[2013,947],[2014,582],[2015,217]];

  bitcoinSVG.selectAll('text.xLabel')
            .data(bitcoinYear)
            .enter()
            .append('text')
            .text(function(d){
              return ""+d[0];
            })
            .attr('x', 0 - svgWidth)
            .transition()
            .duration(3000)
            .attr({
              x : function(d, i){
                return (svgWidth - 100) / bitcoinYear.length * i + 100;
              },
              y : svgHeight + 225
            });


  var yLabel = [[0,'0'],[10000000,'10,000,000'],[20000000,'20,000,000'],[30000000,'30,000,000'],[40000000,'40,000,000'],[50000000,'50,000,000'],[60000000,'60,000,000'],[70000000,'70,000,000'],[80000000,'80,000,000']];

  bitcoinSVG.selectAll('text.yLabel')
            .data(yLabel)
            .enter()
            .append('text')
            .text(function(d){
              return d[1];
            })
            .attr('x', 0 - svgWidth)
            .transition()
            .duration(5000)
            .attr({
              x : 0,
              y : function(d){
                return (svgHeight + 200) - (d[0] / 125000);
              }
            });

  bitcoinSVG.append('text')
            .text('Total number of unique bitcoin transactions per day')
                          .attr({
                            x:200,
                            y:200,
                            'font-size':24
                          })
            .style('opacity', 0)
            .transition()
            .duration(10000)
            .style('opacity', 1);

};

/*==============================Clear SVG================================*/

var clearSvg = function(){
  d3.selectAll('svg')
    .transition()
    .duration(750)
    .style({
      opacity:0
    })
    .remove();
};

/*==============================Setup Event Listener on Dropdown============*/

document.getElementById('options').addEventListener('change',function(e){

  if( window.stream ){
    clearInterval(window.loopId);
    window.stream.stop();
    delete window.source;
   }

  clearSvg();
  window.called = false;
  if( e.target.value === '_usPop'){
    setTimeout(usPopulation,1000);
  }
  if( e.target.value === '_bitcoin' ){
    setTimeout(bitcoinPlot,750);
  }
  if( e.target.value === 'audioViz' ){
    setTimeout(audioViz, 750);
  }
});










