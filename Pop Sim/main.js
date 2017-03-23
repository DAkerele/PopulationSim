$(document).ready(function() {



    var allNodes = [];
    var selectedNode;
    var currentSelectedNode = {};
    var nodeColors = ["#c82124", "#82FA58", "#FE2E2E", "#61210B", "#FE2EF7", "#9A2EFE", "#58FAF4", "#F4FA58", "#FF8000", "#585858"]
    var NodeCount = 0; // number of nodes allowed on canvas
    var canvas = document.getElementById("canvas");
    var lineGraph = document.getElementById("lineGraph");
    var barGraph = document.getElementById("barGraph");
    var context = canvas.getContext("2d");
    var lineGraphCtx = lineGraph.getContext("2d");
    var barGraphCtx = barGraph.getContext("2d");
    var unselectedColor = "#FFFFFF";
    var genArray = [];
    var sel = document.getElementById("nodeSelect");
    var rectX, rectY;



    context.fillStyle = "#FDFEFE"
    lineGraphCtx.fillStyle = "#FDFEFE";
    barGraphCtx.fillStyle = "#FDFEFE";
    barGraphCtx.fillRect(0, 0, barGraph.width, barGraph.height);
    lineGraphCtx.fillRect(0, 0, lineGraph.width, lineGraph.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    intializeLineGraph();
    intializeBarGraph();




    function draw(e) { //draws nodes on click event
        var pos = getMousePos(canvas, e);
        posX = pos.x;
        posY = pos.y;


        if (NodeCount < 10) {

            if (overlap(posX, posY) == false) {
                context.fillStyle = nodeColors[NodeCount];
                context.beginPath();
                context.arc(posX, posY, 25, 0, 2 * Math.PI, false);
                context.closePath();
                context.fill();

                context.strokeStyle = "#f44242";
                context.beginPath();
                context.arc(posX, posY, 30, 0, 2 * Math.PI);
                context.stroke();


                context.fillStyle = "black";
                context.fillText((NodeCount + 1).toString(), posX - 3, posY + 2);

                var node = new Node(false, posX, posY, nodeColors[NodeCount], (NodeCount + 1), .5, 100, 100, 1.0, 1.0, 1.0, 1, []);


                allNodes.push(node);
                NodeCount++;




            }

        }
        var isInCircle = pointInCircle(posX, posY);
        document.getElementById("NodeSelected").innerHTML = "Data for Node: " + isInCircle.NodeNum;

        var nodeX = isInCircle.CoordX;
        var nodeY = isInCircle.CoordY;
        var nodeColor = isInCircle.nodeColor;

        for (var i = 0; i < allNodes.length; i++) {

            if (allNodes[i].NodeNum == isInCircle.NodeNum) {

                allNodes[i].isSelected = true;
                currentSelectedNode = allNodes[i];
                selectedNode = allNodes[i];
                context.strokeStyle = "#f44242";
                context.beginPath();
                context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 30, 0, 2 * Math.PI);
                context.stroke();


            } else if (allNodes[i].NodeNum != currentSelectedNode) {
                allNodes[i].isSelected = false;
                for (var j = 0; j < 10; j++) {
                    context.strokeStyle = "#FFFFFF";
                    context.beginPath();
                    context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 30, 0, 2 * Math.PI);
                    context.stroke();
                }

            }




        }




        document.getElementById("enterVals").onclick = function enterValues() {
            setSelectedNodeInfo(currentSelectedNode);

            return false;


        }

        document.getElementById("Run").onclick = function beginRun() {

            $("#nodeSelect").append("<option value=" + currentSelectedNode.NodeNum + ">Node" + currentSelectedNode.NodeNum + "</option>");
            

            for (var j = 0; j < currentSelectedNode.numRuns; j++) {
                currentSelectedNode.runSim();

                plotPoints(currentSelectedNode.alleleData[j]);

            }




            return false;

        }

        document.getElementById("nodeSelect").onchange = function changeBarGraph() {
            $("#RunTotal").html(""+currentSelectedNode.numRuns);



            barGraphCtx.clearRect(0, 0, barGraph.width, barGraph.height);
            barGraphCtx.fillStyle = "#FDFEFE";
            barGraphCtx.fillRect(0, 0, barGraph.width, barGraph.height);
            intializeBarGraph();

            
                switch (sel.options[sel.selectedIndex].value) {

                    case "1":
                        plotBars(allNodes[0]);
                        $("#RunTotal").html(""+allNodes[0].numRuns);
                        break;
                    case "2":
                        plotBars(allNodes[1]);
                        $("#RunTotal").html(""+allNodes[1].numRuns);
                        break;
                    case "3":
                        plotBars(allNodes[2]);
                        $("#RunTotal").html(""+allNodes[2].numRuns);
                        break;
                    case "4":
                        plotBars(allNodes[3]);
                        $("#RunTotal").html(""+allNodes[3].numRuns);
                        break;
                    case "5":
                        plotBars(allNodes[4]);
                        $("#RunTotal").html(""+allNodes[4].numRuns);
                        break;
                    case "6":
                        plotBars(allNodes[5]);
                        $("#RunTotal").html(""+allNodes[5].numRuns);
                        break;
                    case "7":
                        plotBars(allNodes[6]);
                        $("#RunTotal").html(""+allNodes[6].numRuns);
                        break;
                    case "8":
                        plotBars(allNodes[7]);
                        $("#RunTotal").html(""+allNodes[7].numRuns);
                        break;
                    case "9":
                        plotBars(allNodes[8]);
                        $("#RunTotal").html(""+allNodes[8].numRuns);
                        break;
                    case "10":
                        plotBars(allNodes[9]);
                        $("#RunTotal").html(""+allNodes[9].numRuns);
                        break;
                }
            

        }




    }

    function pointInCircle(x, y) { //checks if mouse click is located within a node
        for (var i = 0; i < allNodes.length; i++) {
            var distance = (x - allNodes[i].CoordX) * (x - allNodes[i].CoordX) + (y - allNodes[i].CoordY) * (y - allNodes[i].CoordY);
            if (distance <= 25 * 25) {
                currentSelectedNode = allNodes[i];
                return allNodes[i];
            }
        }
    }

    function setSelectedNodeInfo(node) { //sets Text fields to set value for corresponding node
        node.numRuns = parseInt($("#NumRuns").val());
        node.startPer = parseFloat($("#Starting").val());
        node.genNum = parseInt($("#NumGenerations").val());
        node.startPop = parseInt($("#StartingPop").val());
        node.plusplusS = parseFloat($("#PPSurvival").val());
        node.plusminusS = parseFloat($("#PMSurvival").val());
        node.minusminusS = parseFloat($("#MMSurvival").val());


    }


    canvas.addEventListener("click", draw);


    function getMousePos(canvas, evt) { //gets mouse position in canvas

        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.pageX,
            y: evt.pageY
        };


    }




    function overlap(x, y) {
        for (var i = 0; i < 10; i++) {
            if(NodeCount == 0){
                return false;
            }
             else if (pointInCircle(x,y) == allNodes[i]) {
                return true; 
            }

            else if(pointInCircle(x,y) == undefined){
                return false;
            }
        }
       
        
        

    }

    function intializeLineGraph() {
        var lineSpaceHor = lineGraph.height / 10;
        var lineSpaceVer = lineGraph.width / 11;
        lineGraphCtx.beginPath();
        for (var i = 0; i < lineGraph.height; i += lineSpaceHor) {
            lineGraphCtx.moveTo(0, i);
            lineGraphCtx.lineTo(lineGraph.width, i);
            lineGraphCtx.stroke();

        }
        lineGraphCtx.closePath();
        lineGraphCtx.beginPath();
        for (var j = 0; j < lineGraph.width; j += lineSpaceVer) {
            lineGraphCtx.moveTo(j, lineGraph.height);
            lineGraphCtx.lineTo(j, 390);
            lineGraphCtx.stroke();

        }
        lineGraphCtx.closePath();



    }

    function intializeBarGraph() {

        var ylineSpace = barGraph.height / 4;
        var xValueSpace = barGraph.width / 10;

        barGraphCtx.beginPath();
        for (var i = 0; i < barGraph.height; i += ylineSpace) {
            barGraphCtx.moveTo(0, i);
            barGraphCtx.lineTo(barGraph.width, i);
            barGraphCtx.stroke();
        }

    }


    function plotPoints(genArray) {

        var pointSpace = lineGraph.width / 100;
        var lastPointY = 220;
        lineGraphCtx.beginPath();
        lineGraphCtx.lineWidth = 0.5;
        lineGraphCtx.strokeStyle = currentSelectedNode.Color;
        lineGraphCtx.moveTo(0, 220); //zeroY
        for (var r = 0; r < genArray.length; r++) {


            if (genArray[r][1] > .500) {
                lineGraphCtx.lineTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));
                lineGraphCtx.moveTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));

                lineGraphCtx.stroke();

            } else if (genArray[r][1] < .500) {
                lineGraphCtx.lineTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));
                lineGraphCtx.moveTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));

                lineGraphCtx.stroke();

            }




        }
        lineGraphCtx.closePath();

    }




    function plotBars(node) {
        
        var rectHeight = 400;
        var barIncrease = barGraph.height/node.numRuns;
        var freqs = []
        var freq01 = 0,
            freq12 = 0,
            freq23 = 0,
            freq34 = 0,
            freq45 = 0,
            freq56 = 0,
            freq67 = 0,
            freq78 = 0, 
            freq89 = 0,
            freq91 = 0;
        barGraphCtx.fillStyle = String(allNodes[(sel.options[sel.selectedIndex].value) - 1].Color);
       for(var i = 0; i < node.numRuns; i++)
       {
            var finalFreq = node.alleleData[i][node.alleleData[i].length - 2][1];

            if (finalFreq <= 0.1){
                freq01 += barIncrease;
            }   
            else if (finalFreq > 0.1 && finalFreq <= 0.2){
                freq12 += barIncrease;
            }
            else if (finalFreq > 0.2 && finalFreq <= 0.3){
                freq23 += barIncrease;
            }
            else if (finalFreq > 0.3 && finalFreq <= 0.4){
                freq34 += barIncrease;
            }
            else if (finalFreq > 0.4 && finalFreq <= 0.5){
                freq45 += barIncrease;
            }
            else if (finalFreq > 0.5 && finalFreq <= 0.6){
                freq56 += barIncrease;
            }
            else if (finalFreq > 0.6 && finalFreq <= 0.7){
                freq67 += barIncrease;
            }
            else if (finalFreq > 0.7 && finalFreq <= 0.8){
                 freq78 += barIncrease;
            }
            else if (finalFreq > 0.8 && finalFreq <= 0.9){
                freq89 += barIncrease;
            }
            else if (finalFreq > 0.9 && finalFreq <= 1.0){
                freq91 += barIncrease;
            }
                
       }

        barGraphCtx.strokeRect(0, rectHeight-freq01, 50, barGraph.height+freq01);
        barGraphCtx.fillRect(0, rectHeight-freq01, 50, barGraph.height+freq01);
       




        barGraphCtx.strokeRect(50, rectHeight-freq12, 50, barGraph.height+freq12);
        barGraphCtx.fillRect(50, rectHeight-freq12, 50, barGraph.height+freq12);
        




        barGraphCtx.strokeRect(100, rectHeight-freq23, 50, barGraph.height+freq23);
        barGraphCtx.fillRect(100, rectHeight-freq23, 50, barGraph.height+freq23);
       



        barGraphCtx.strokeRect(150, rectHeight-freq34, 50, barGraph.height+freq34);
        barGraphCtx.fillRect(150, rectHeight-freq34, 50, barGraph.height+freq34);
       



        barGraphCtx.strokeRect(200, rectHeight-freq45, 50, barGraph.height+freq45);
        barGraphCtx.fillRect(200, rectHeight-freq45, 50, barGraph.height+freq45);
       



        barGraphCtx.strokeRect(250, rectHeight-freq56, 50, barGraph.height+freq56);
        barGraphCtx.fillRect(250, rectHeight-freq56,50, barGraph.height+freq56);
       

        barGraphCtx.strokeRect(300, rectHeight-freq67, 50, barGraph.height+freq67);
        barGraphCtx.fillRect(300, rectHeight-freq67, 50, barGraph.height+freq67);
       



        barGraphCtx.strokeRect(350, rectHeight-freq78, 50, barGraph.height+freq78);
        barGraphCtx.fillRect(350, rectHeight-freq78, 50, barGraph.height+freq78);
        



        barGraphCtx.strokeRect(400, rectHeight-freq89, 50, barGraph.height+freq89);
        barGraphCtx.fillRect(400, rectHeight-freq89, 50, barGraph.height+freq89);
       


        barGraphCtx.strokeRect(450, rectHeight-freq91, 50, barGraph.height+freq91);
        barGraphCtx.fillRect(450, rectHeight-freq91, 50, barGraph.height+freq91);
       
    

}


   



   







/*function intersects(x,y){
        
      for (var i = 0; i < allNodes.length; i++) {
        if(NodeCount == 1){
            var distance = (x - allNodes[0].CoordX) * (x - allNodes[0].CoordX) + (y - allNodes[0].CoordY) * (y - allNodes[0].CoordY);
        }
        else if(NodeCount > 1){
            var distance = (x - allNodes[NodeCount-1].CoordX) * (x - allNodes[NodeCount-1].CoordX) + (y - allNodes[NodeCount-1].CoordY) * (y - allNodes[NodeCount-1].CoordY);
        }
        
            if(distance < rectHeight-freq*freq0){
              return true;
            }
            else if(distance > rectHeight-freq*freq0){
              return false;
              
            }
            
        }
}*/




});
                context.strokeStyle = "#f44242";
                context.beginPath();
                context.arc(posX, posY, 30, 0, 2 * Math.PI);
                context.stroke();


                context.fillStyle = "black";
                context.fillText((NodeCount + 1).toString(), posX - 3, posY + 2);

                var node = new Node(false, posX, posY, nodeColors[NodeCount], (NodeCount + 1), .5, 100, 100, 1.0, 1.0, 1.0, 1, []);


                allNodes.push(node);
                NodeCount++;




            }

        }
        var isInCircle = pointInCircle(posX, posY);
        document.getElementById("NodeSelected").innerHTML = "Data for Node: " + isInCircle.NodeNum;

        var nodeX = isInCircle.CoordX;
        var nodeY = isInCircle.CoordY;
        var nodeColor = isInCircle.nodeColor;

        for (var i = 0; i < allNodes.length; i++) {

            if (allNodes[i].NodeNum == isInCircle.NodeNum) {

                allNodes[i].isSelected = true;
                currentSelectedNode = allNodes[i];
                selectedNode = allNodes[i];
                context.strokeStyle = "#f44242";
                context.beginPath();
                context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 30, 0, 2 * Math.PI);
                context.stroke();


            } else if (allNodes[i].NodeNum != currentSelectedNode) {
                allNodes[i].isSelected = false;
                for (var j = 0; j < 10; j++) {
                    context.strokeStyle = "#FFFFFF";
                    context.beginPath();
                    context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 30, 0, 2 * Math.PI);
                    context.stroke();
                }

            }




        }




        document.getElementById("enterVals").onclick = function enterValues() {
            setSelectedNodeInfo(currentSelectedNode);

            return false;


        }

        document.getElementById("Run").onclick = function beginRun() {

            $("#nodeSelect").append("<option value=" + currentSelectedNode.NodeNum + ">Node" + currentSelectedNode.NodeNum + "</option>");
            

            for (var j = 0; j < currentSelectedNode.numRuns; j++) {
                currentSelectedNode.runSim();

                plotPoints(currentSelectedNode.alleleData[j]);

            }




            return false;

        }

        document.getElementById("nodeSelect").onchange = function changeBarGraph() {
            $("#RunTotal").html(""+currentSelectedNode.numRuns);



            barGraphCtx.clearRect(0, 0, barGraph.width, barGraph.height);
            barGraphCtx.fillStyle = "#FDFEFE";
            barGraphCtx.fillRect(0, 0, barGraph.width, barGraph.height);
            intializeBarGraph();

            
                switch (sel.options[sel.selectedIndex].value) {

                    case "1":
                        plotBars(allNodes[0]);
                        $("#RunTotal").html(""+allNodes[0].numRuns);
                        break;
                    case "2":
                        plotBars(allNodes[1]);
                        $("#RunTotal").html(""+allNodes[1].numRuns);
                        break;
                    case "3":
                        plotBars(allNodes[2]);
                        $("#RunTotal").html(""+allNodes[2].numRuns);
                        break;
                    case "4":
                        plotBars(allNodes[3]);
                        $("#RunTotal").html(""+allNodes[3].numRuns);
                        break;
                    case "5":
                        plotBars(allNodes[4]);
                        $("#RunTotal").html(""+allNodes[4].numRuns);
                        break;
                    case "6":
                        plotBars(allNodes[5]);
                        $("#RunTotal").html(""+allNodes[5].numRuns);
                        break;
                    case "7":
                        plotBars(allNodes[6]);
                        $("#RunTotal").html(""+allNodes[6].numRuns);
                        break;
                    case "8":
                        plotBars(allNodes[7]);
                        $("#RunTotal").html(""+allNodes[7].numRuns);
                        break;
                    case "9":
                        plotBars(allNodes[8]);
                        $("#RunTotal").html(""+allNodes[8].numRuns);
                        break;
                    case "10":
                        plotBars(allNodes[9]);
                        $("#RunTotal").html(""+allNodes[9].numRuns);
                        break;
                }
            

        }




    }

    function pointInCircle(x, y) { //checks if mouse click is located within a node
        for (var i = 0; i < allNodes.length; i++) {
            var distance = (x - allNodes[i].CoordX) * (x - allNodes[i].CoordX) + (y - allNodes[i].CoordY) * (y - allNodes[i].CoordY);
            if (distance <= 25 * 25) {
                currentSelectedNode = allNodes[i];
                return allNodes[i];
            }
        }
    }

    function setSelectedNodeInfo(node) { //sets Text fields to set value for corresponding node
        node.numRuns = parseInt($("#NumRuns").val());
        node.startPer = parseFloat($("#Starting").val());
        node.genNum = parseInt($("#NumGenerations").val());
        node.startPop = parseInt($("#StartingPop").val());
        node.plusplusS = parseFloat($("#PPSurvival").val());
        node.plusminusS = parseFloat($("#PMSurvival").val());
        node.minusminusS = parseFloat($("#MMSurvival").val());


    }


    canvas.addEventListener("click", draw);


    function getMousePos(canvas, evt) { //gets mouse position in canvas

        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.pageX,
            y: evt.pageY
        };


    }




    function overlap(x, y) {

        if (allNodes.length == 0) {
            return false;
        } else if (pointInCircle(x, y) !== undefined && allNodes.length >= 1) {
            return true;
        } else if (pointInCircle(x, y) == undefined && allNodes.length >= 1) {
            return false;
        }

    }

    function intializeLineGraph() {
        var lineSpaceHor = lineGraph.height / 10;
        var lineSpaceVer = lineGraph.width / 11;
        lineGraphCtx.beginPath();
        for (var i = 0; i < lineGraph.height; i += lineSpaceHor) {
            lineGraphCtx.moveTo(0, i);
            lineGraphCtx.lineTo(lineGraph.width, i);
            lineGraphCtx.stroke();

        }
        lineGraphCtx.closePath();
        lineGraphCtx.beginPath();
        for (var j = 0; j < lineGraph.width; j += lineSpaceVer) {
            lineGraphCtx.moveTo(j, lineGraph.height);
            lineGraphCtx.lineTo(j, 390);
            lineGraphCtx.stroke();

        }
        lineGraphCtx.closePath();



    }

    function intializeBarGraph() {

        var ylineSpace = barGraph.height / 4;
        var xValueSpace = barGraph.width / 10;

        barGraphCtx.beginPath();
        for (var i = 0; i < barGraph.height; i += ylineSpace) {
            barGraphCtx.moveTo(0, i);
            barGraphCtx.lineTo(barGraph.width, i);
            barGraphCtx.stroke();
        }

    }


    function plotPoints(genArray) {

        var pointSpace = lineGraph.width / 100;
        var lastPointY = 220;
        lineGraphCtx.beginPath();
        lineGraphCtx.lineWidth = 0.5;
        lineGraphCtx.strokeStyle = currentSelectedNode.Color;
        lineGraphCtx.moveTo(0, 220); //zeroY
        for (var r = 0; r < genArray.length; r++) {


            if (genArray[r][1] > .500) {
                lineGraphCtx.lineTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));
                lineGraphCtx.moveTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));

                lineGraphCtx.stroke();

            } else if (genArray[r][1] < .500) {
                lineGraphCtx.lineTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));
                lineGraphCtx.moveTo(pointSpace * (r + 1), 402 - (genArray[r][1] * 400));

                lineGraphCtx.stroke();

            }




        }
        lineGraphCtx.closePath();

    }




    function plotBars(node) {
        
        var rectHeight = 400;
        var barIncrease = barGraph.height/node.numRuns;
        var freqs = []
        var freq01 = 0,
            freq12 = 0,
            freq23 = 0,
            freq34 = 0,
            freq45 = 0,
            freq56 = 0,
            freq67 = 0,
            freq78 = 0,
            freq89 = 0,
            freq91 = 0;
        barGraphCtx.fillStyle = String(allNodes[(sel.options[sel.selectedIndex].value) - 1].Color);
       for(var i = 0; i < node.numRuns; i++)
       {
            var finalFreq = node.alleleData[i][node.alleleData[i].length - 2][1];

            if (finalFreq <= 0.1){
                freq01 += barIncrease;
            }   
            else if (finalFreq > 0.1 && finalFreq <= 0.2){
                freq12 += barIncrease;
            }
            else if (finalFreq > 0.2 && finalFreq <= 0.3){
                freq23 += barIncrease;
            }
            else if (finalFreq > 0.3 && finalFreq <= 0.4){
                freq34 += barIncrease;
            }
            else if (finalFreq > 0.4 && finalFreq <= 0.5){
                freq45 += barIncrease;
            }
            else if (finalFreq > 0.5 && finalFreq <= 0.6){
                freq56 += barIncrease;
            }
            else if (finalFreq > 0.6 && finalFreq <= 0.7){
                freq67 += barIncrease;
            }
            else if (finalFreq > 0.7 && finalFreq <= 0.8){
                 freq78 += barIncrease;
            }
            else if (finalFreq > 0.8 && finalFreq <= 0.9){
                freq89 += barIncrease;
            }
            else if (finalFreq > 0.9 && finalFreq <= 1.0){
                freq91 += barIncrease;
            }
                
       }

        barGraphCtx.strokeRect(0, rectHeight-freq01, 50, barGraph.height+freq01);
        barGraphCtx.fillRect(0, rectHeight-freq01, 50, barGraph.height+freq01);
       




        barGraphCtx.strokeRect(50, rectHeight-freq12, 50, barGraph.height+freq12);
        barGraphCtx.fillRect(50, rectHeight-freq12, 50, barGraph.height+freq12);
        




        barGraphCtx.strokeRect(100, rectHeight-freq23, 50, barGraph.height+freq23);
        barGraphCtx.fillRect(100, rectHeight-freq23, 50, barGraph.height+freq23);
       



        barGraphCtx.strokeRect(150, rectHeight-freq34, 50, barGraph.height+freq34);
        barGraphCtx.fillRect(150, rectHeight-freq34, 50, barGraph.height+freq34);
       



        barGraphCtx.strokeRect(200, rectHeight-freq45, 50, barGraph.height+freq45);
        barGraphCtx.fillRect(200, rectHeight-freq45, 50, barGraph.height+freq45);
       



        barGraphCtx.strokeRect(250, rectHeight-freq56, 50, barGraph.height+freq56);
        barGraphCtx.fillRect(250, rectHeight-freq56,50, barGraph.height+freq56);
       

        barGraphCtx.strokeRect(300, rectHeight-freq67, 50, barGraph.height+freq67);
        barGraphCtx.fillRect(300, rectHeight-freq67, 50, barGraph.height+freq67);
       



        barGraphCtx.strokeRect(350, rectHeight-freq78, 50, barGraph.height+freq78);
        barGraphCtx.fillRect(350, rectHeight-freq78, 50, barGraph.height+freq78);
        



        barGraphCtx.strokeRect(400, rectHeight-freq89, 50, barGraph.height+freq89);
        barGraphCtx.fillRect(400, rectHeight-freq89, 50, barGraph.height+freq89);
       


        barGraphCtx.strokeRect(450, rectHeight-freq91, 50, barGraph.height+freq91);
        barGraphCtx.fillRect(450, rectHeight-freq91, 50, barGraph.height+freq91);
       
    

}


   



   







/*function intersects(x,y){
        
      for (var i = 0; i < allNodes.length; i++) {
        if(NodeCount == 1){
            var distance = (x - allNodes[0].CoordX) * (x - allNodes[0].CoordX) + (y - allNodes[0].CoordY) * (y - allNodes[0].CoordY);
        }
        else if(NodeCount > 1){
            var distance = (x - allNodes[NodeCount-1].CoordX) * (x - allNodes[NodeCount-1].CoordX) + (y - allNodes[NodeCount-1].CoordY) * (y - allNodes[NodeCount-1].CoordY);
        }
        
            if(distance < rectHeight-freq*freq0){
              return true;
            }
            else if(distance > rectHeight-freq*freq0){
              return false;
              
            }
            
        }
}*/




});
