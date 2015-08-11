var audioViz = function(){

    navigator.getUserMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);

    var audioContext = new AudioContext();

    var analyser = audioContext.createAnalyser();

    navigator.getUserMedia({audio:true},function(stream){
      window.source = audioContext.createMediaStreamSource(stream);
      window.stream = stream;
      source.connect(analyser);
      analyser.fftSize = 512; /* must be power of 2, determines frequency quality data, higher quality --> more processing */
      var bufferLength = analyser.frequencyBinCount;
      window.array = new Float32Array(bufferLength);
      analyser.getFloatFrequencyData(array);
    },function(err){
      console.log(err);
    });


    var size = {
      width:500,
      height:400
    };

    var margin = {
      left:50,
      right:50,
      top:30,
      bottom:30
    };

    var loop = function(){
      analyser.getFloatFrequencyData(window.array);
      plot(window.array);
    };



    var svg = d3.select('.graph')
                .append('svg')
                .attr({
                  width:size.width,
                  height:size.height
                });

    var yLabel = svg.append('text')
                  .text('Decibels (-dB)')
                  .attr({
                    x:-100,
                    y:0
                  });

    var xLabel = svg.append('text')
                    .text('Frequency (Hz)')
                    .attr({
                      x:-100,
                      y:0
                    });

    function callMe(){
      yLabel.transition()
          .duration(2000)
          .attr({
            x:-150,
            y:40,
            transform:'rotate(270)'
          });

        xLabel.transition()
          .duration(2000)
          .attr({
            x:225,
            y:175
          });
    }

    var plot = function(data){

      if(!window.hasOwnProperty('source')){
        return;
      }

      if (!window.called && window.hasOwnProperty('source')){
        callMe();
        window.called = true;
      }

      var rects = svg.selectAll('rect')
                     .attr({
                      class:'amplitude'
                     })
                       .data(data, function(d){return d;});
      
      rects.enter()
           .append('rect')
           .attr({
              x:function(d,i){return i*3 + margin.left ;},
              y:function(d){return -d + margin.bottom;},
              width:'2px',
              height: function(d){
                if ((128+d) < 0){
                  return 0 ;
                }
                return 128+d ;
              }
            });

      rects.exit().remove();

    };


    window.loopId = setInterval(loop, 50);


};

