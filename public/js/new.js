var svg = d3.select("svg"),
	width = svg.attr("width"),
	height = svg.attr("height");
d3.json("../json/new.json", function(error, combinedData) {
	if(error) return console.warn(error);
	data = combinedData.data;
	meta = combinedData.meta;		
	visualization();
});

function visualization() {
	//user defined variables
	var part2 = 500;
	curvature = 0.1;
	max_score = 100;
	width = width - part2;
	
	//variables based on data
	var num_of_students = data.length,
		num_of_rows = Math.round(Math.sqrt((num_of_students*height)/width)),
	
	var num_of_cols = Math.ceil(num_of_students/ num_of_rows),
		gridSize = parseFloat(Math.floor(height / num_of_rows) < Math.floor(width / num_of_cols) ? Math.floor(height / num_of_rows) : Math.floor(width / num_of_cols)),
		col = 0,
		row = 0;
		
	var canvas = svg.append("g")
					.attr("transform", "translate(0,0)")
					.attr("id", "canvas");
					
	for(var i = 0; i < num_of_students; i++) {
		var x = colFunction(i);
		var y = rowFunction(i);							
	
		group = canvas.append("g")
					  .attr("id", data[i].id)
					  .attr("x", x)
					  .attr("y", y)
						.on("mouseenter", handleMouseEnter)
						.on("mouseleave", handleMouseLeave)
		
		group.append("rect")
			  .attr("x", x)
			  .attr("y", y)
			  .attr("rx", gridSize*curvature)
			  .attr("ry", gridSize*curvature)
			  .attr("width", gridSize)
			  .attr("height", gridSize)
			  .attr("stroke", "grey")
			  .style("fill", "white");
		
				
		var keys = Object.keys(data[i].scores);
		var num_of_parameters = 0;
		keys.forEach(function(key) {
			num_of_parameters = num_of_parameters + 1;
		})
		
		var gap = parseFloat(gridSize * (curvature));
		var w1 = parseFloat(gridSize-(2*gap))/parseFloat(num_of_parameters);
		var a1 = 0;

		keys.forEach(function (key){
			var h1 = (data[i].scores[key]/max_score)*(gridSize-(gap*2));
			var y1 = y - gap - h1;
			group.append("rect")
				  .attr("x",x + gap +a1*w1)
				  .attr("y", y + gridSize - gap - (data[i].scores[key]/max_score)*(gridSize-(gap*2)))
				  .attr("width", w1)
				  .attr("height",h1)
				  .attr("stroke", "grey")
				  .attr("opacity", ".8")
				  .style("fill", "black");
			a1 = a1 + 1;
	})
	}
	
	function colFunction(i) {		
		if(col < num_of_cols) {
			col = col + 1;
		} else {
			col = 1;
		}
		return (col-1) * gridSize;
	}
	
	function rowFunction(i) {
		row = Math.floor(i / num_of_cols);
		return row*gridSize;
	}
	
	function handleMouseEnter() {
		d3.selectAll("#temp").remove();		
		var size = parseFloat(part2);
		var y2 = parseFloat(d3.select(this).attr("y"));	
		var y3 = (y2 + size) < height ? y2 : height - size
		temp = canvas.append("g")
				.attr("id", "temp")
				
		temp.append("rect")			  
		  .attr("x", width)
		  .attr("y", y3)
		  .attr("width", size)
		  .attr("height", size)
		  .attr("stroke", "grey")
		  .style("fill", "none");
		
		var id = d3.select(this).attr("id");
		var scores;
		for(var i = 0; i < num_of_students; i++) {
			if (id == data[i].id) {
				scores = data[i].scores;
				break;
			}
		}
		
		var keys = Object.keys(scores);			
		var gap = parseFloat(size * (curvature));
		var w1 = parseFloat(size-(2*gap))/parseFloat(num_of_parameters);
		var a1 = 0;
		keys.forEach(function (key){
			var h1 = (data[i].scores[key]/max_score)*(size-(gap*2));
			var y1 = y - gap - h1;
			temp.append("rect")
				  .attr("x",width + gap +a1*w1)
				  .attr("y", y3 + size - gap - (scores[key]/max_score)*(size-(gap*2)))
				  .attr("width", w1)
				  .attr("height",h1)
				  .attr("stroke", "grey")
				  .attr("opacity", ".8")
				  .style("fill", "black");
			a1 = a1 + 1;
	})		
	}	
	function handleMouseLeave() {
	//	d3.selectAll("#temp").remove();
	}
}
