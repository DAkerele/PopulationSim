$(document).ready(function() {


    var allNodes = [];
    var selectedNode;
    var currentSelectedNode;
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


    context.fillStyle = "#FDFEFE";
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

                var node = new Node(false, posX, posY, nodeColors[NodeCount], (NodeCount + 1), .5, 100, 100, 1.0, 1.0, 1.0, 1);

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

            $("#nodeSelect").append("<option value="+currentSelectedNode.NodeNum+">Node"+currentSelectedNode.NodeNum+"</option>")

            for (var j = 0; j < currentSelectedNode.numRuns; j++) {

                calcPoints(currentSelectedNode);
                

                for (var i = 0; i < genArray.length; i++) {
                    console.log(genArray[i]);
                }

                plotPoints(genArray);
                
            }

            document.getElementById("RunTotal").innerHTML = " " + currentSelectedNode.numRuns;

            return false;

        }

         document.getElementById("nodeSelect").onchange = function changeBarGraph(){

            barGraphCtx.clearRect(0, 0, barGraphCtx.width, barGraphCtx.height);
            intializeBarGraph();
            var sel = document.getElementById("nodeSelect");
              switch(sel.options[sel.selectedIndex].value) {
                case "1":
                    plotBars(genArray);
                     break;
                case "2":
                    plotBars(genArray);
                    break;
                case "3":
                   plotBars(genArray);
                   break;
                case "4":
                  plotBars(genArray);
                  break;
                case "5":
                   plotBars(genArray);
                   break;
                case "6":
                   plotBars(genArray);
                   break;
                case "7":
                   plotBars(genArray);
                   break;
                case "8":
                   plotBars(genArray);
                   break;
                case "9":
                   plotBars(genArray);
                   break;
                case "10":
                   plotBars(genArray);
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

    function calcPoints(node) {



        var nextPopArray = [];

        genArray.splice(0, genArray.length);
        for (var j = 0; j <= 1; j++) {
            nextPopArray.push(node.startPer);
        }
        genArray.push(nextPopArray);
        beginGen = 0;
        endGen = node.genNum;


        var currentPopSize = node.startPop * 2;

        var pbar;
        var p = 0.0;
        var q;
        var w;
        var pp1;
        var pp2;

        var nx;
        var ny;

        for (var i = 0; i < node.genNum; i++) {

            numFixedPops = 0;
            numLostPops = 0;
            pbar = 0.0;
            nextPopArray = [];


            var popArray = genArray[i];
            for (var j = 1; j <= 1; j++) {
                var end = popArray[j];
                pbar += end;
                if (end <= 0.0) {
                    numLostPops += 1;
                }
                if (end >= 1.0) {
                    numFixedPops += 1;
                }
            }


            pbar /= 1;
            for (var j = 0; j <= 1; j++) {
                p = popArray[j];
                if (j > 0) {
                    p = p * (1.0 - 0.0) + 0.0 * pbar;
                }
                p = (1 - 0) * p + 0 * (1 - p);

                if ((p > 0.0) && (p < 1.0)) {
                    q = 1 - p;
                    w = (p * p * node.plusplusS) + (2.0 * p * q * node.plusminusS) + (q * q * node.minusminusS);
                    pp1 = (p * p * node.plusplusS) / w;
                    pp2 = (2.0 * p * q * node.plusminusS) / w;
                    if (j > 0) {
                        nx = binomial(node.startPop, pp1);

                        if (pp1 < 1.0 && nx < node.startPop) {
                            ny = binomial((node.startPop - nx), (pp2 / (1.0 - pp1)));
                        } else {
                            ny = 0;
                        }

                        nextPopArray.push(((nx * 2.0) + ny) / currentPopSize);
                    } else {
                        nextPopArray.push(pp1 + (pp2 / 2.0));
                    }
                } else {
                    if (p <= 0.0) {
                        p = 0.0;
                    } else {
                        p = 1.0;
                    }
                    nextPopArray.push(p);
                }

            }
            genArray.push(nextPopArray);
        }

        for (var i = 0; i < genArray.length; i++) {
            console.log(genArray[i]);
        }



    }


    function binomial(n, pp) {
        var j;
        var bnl;
        bnl = 0;
        for (j = 1; j <= n; j++) {
            if (Math.random() < pp) {
                bnl++;
            }
        }

        return bnl;
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
        var lineSpaceHor = lineGraph.height / 11;
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



    function plotPoints(genData) {


        var pointSpace = lineGraph.width / 100;
        var lastPointY = 220;
        lineGraphCtx.beginPath();
        lineGraphCtx.lineWidth = 0.5;
        lineGraphCtx.strokeStyle = currentSelectedNode.Color;
        lineGraphCtx.moveTo(0, 220); //zeroY
        for (var r = 0; r < genData.length; r++) {


            if (genData[r][1] > .500) {
                lineGraphCtx.lineTo(pointSpace * (r + 1), 402 - (genData[r][1] * 402));
                lineGraphCtx.moveTo(pointSpace * (r + 1), 402 - (genData[r][1] * 402));

                lineGraphCtx.stroke();

            } else if (genData[r][1] < .500) {
                lineGraphCtx.lineTo(pointSpace * (r + 1), 402 - (genData[r][1] * 402));
                lineGraphCtx.moveTo(pointSpace * (r + 1), 402 - (genData[r][1] * 402));

                lineGraphCtx.stroke();

            }




        }
        lineGraphCtx.closePath();
    }

    function plotBars(genData){

        finalFreq = genData[genData.length-1][1];
        barGraphCtx.fillStyle =  String(currentSelectedNode.Color);
        
        if(finalFreq <= 0.1){

            barGraphCtx.strokeRect(0,300,50,100);
            barGraphCtx.fillRect(0,300,50,100);
            
            

        }else if(finalFreq > 0.1 && finalFreq <= 0.2){
            barGraphCtx.strokeRect(50,300,50,100);
            barGraphCtx.fillRect(50,300,50,100);
            
            
            
        }
        
        else if(finalFreq > 0.2 && finalFreq <= 0.3){
            barGraphCtx.strokeRect(100,300,50,100);
            barGraphCtx.fillRect(100,300,50,100);
                        
        }
        else if(finalFreq > 0.3 && finalFreq <= 0.4){
            barGraphCtx.strokeRect(150,300,50,100);
            barGraphCtx.fillRect(150,300,50,100);
            

            
        }
        else if(finalFreq > 0.4 && finalFreq <= 0.5){
            barGraphCtx.strokeRect(200,300,50,100);
            barGraphCtx.fillRect(200,300,50,100);
            
            
        }
        else if(finalFreq > 0.5 && finalFreq <= 0.6){
            barGraphCtx.strokeRect(250,300,50,100);
            barGraphCtx.fillRect(250,300,50,100);
            
            
        }
        else if(finalFreq > 0.6 && finalFreq <= 0.7){
            barGraphCtx.strokeRect(300,300,50,100);
            barGraphCtx.fillRect(300,300,50,100);

            
            
        }
        else if(finalFreq > 0.7 && finalFreq <= 0.8){
            barGraphCtx.strokeRect(350,300,50,100);
            barGraphCtx.fillRect(350,300,50,100);

            
           
        }
        else if(finalFreq > 0.8 && finalFreq <= 0.9){
            barGraphCtx.strokeRect(400,300,50,100);
            barGraphCtx.fillRect(400,300,50,100);
            
           
        }
        else if(finalFreq > 0.9 && finalFreq <= 1.0){
            barGraphCtx.strokeRect(450,300,50,100);
            barGraphCtx.fillRect(450,300,50,100);
            
           
        }

    }



    /*function intersects(x,y){
            
          for (var i = 0; i < allNodes.length; i++) {
            if(NodeCount == 1){
                var distance = (x - allNodes[0].CoordX) * (x - allNodes[0].CoordX) + (y - allNodes[0].CoordY) * (y - allNodes[0].CoordY);
            }
            else if(NodeCount > 1){
                var distance = (x - allNodes[NodeCount-1].CoordX) * (x - allNodes[NodeCount-1].CoordX) + (y - allNodes[NodeCount-1].CoordY) * (y - allNodes[NodeCount-1].CoordY);
            }
            
                if(distance < 3000){
                  return true;
                }
                else if(distance > 3000){
                  return false;
                  
                }
                
            }
    }*/




});
