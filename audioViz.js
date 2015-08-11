navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

var audioContext = new AudioContext();

var analyser = audioContext.createAnalyser();

navigator.getUserMedia({audio:true},function(stream){
  window.source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 512; /* must be power of 2, determines frequency quality data, higher quality --> more processing */
  var bufferLength = analyser.frequencyBinCount;
  window.array = new Float32Array(bufferLength);
  analyser.getFloatFrequencyData(array);
  console.log(array);
  // update(data);
  // console.log(stream);
  var id = setInterval(loop, 20);
},function(err){
  console.log(err);
});


var size = {
  width:500,
  height:400
};

var loop = function(){
  analyser.getFloatFrequencyData(window.array);

  plot(window.array);
};



var svg = d3.select('.deathStar')
            .append('svg')
            .attr({
              width:size.width,
              height:size.height
            });

var plot = function(data){

  var rects = svg.selectAll('rect')
                 .attr({
                  class:'amplitude'
                 })
                   .data(data, function(d){return d;});
  
  rects.enter()
       .append('rect')
       .attr({
          x:function(d,i){return i * 2;},
          y:0,
          width:'1px',
          height:function(d){return -d;}
        });

  rects.exit().remove();

};


// var id = setInterval(loop, 20);




