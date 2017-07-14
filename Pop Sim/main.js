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
    var genSel = document.getElementById("genSelect");
    var startLinkSel = document.getElementById("startLink");
    var endLinkSel = document.getElementById("endLink");
    var rectX, rectY;
    var confirmVal = false;
    var nodesListed = [10];
    var genCap = 0;
    var running;
    var largestGen = 0;
    var start, end;
    var allConfirmed = 0;
    var linkedNodes = [];
    var notLinked = [];
    var linkLen = 0;
    var x = 0;

    context.fillStyle = "#FDFEFE";
    lineGraphCtx.fillStyle = "#FDFEFE";
    barGraphCtx.fillStyle = "#FDFEFE";
    barGraphCtx.fillRect(0, 0, barGraph.width, barGraph.height);
    lineGraphCtx.fillRect(0, 0, lineGraph.width, lineGraph.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    intializeLineGraph();
    intializeBarGraph();




    function draw(e) { //draws nodes on click event
        if (!running) {
            var pos = getMousePos(canvas, e);
            posX = pos.x;
            posY = pos.y;


            if (NodeCount < 10) {

                if (overlap(posX, posY) == false) {


                    context.beginPath();
                    context.arc(posX, posY, 30, 0, 2 * Math.PI, false);
                    context.closePath();

                    context.fillStyle = nodeColors[NodeCount];
                    context.beginPath();
                    context.arc(posX, posY, 20, 0, 2 * Math.PI, false);
                    context.closePath()
                    context.fill();

                    context.strokeStyle = "#f44242";
                    context.beginPath();
                    context.arc(posX, posY, 30, 0, 2 * Math.PI);
                    context.stroke();


                    context.fillStyle = "black";
                    context.fillText((NodeCount + 1).toString(), posX - 3, posY + 2);

                    var node = new Node(false, posX, posY, nodeColors[NodeCount], (NodeCount + 1), .5, 100, 100, 1.0, 1.0, 1.0, 1, [], false, null,[],[],0);
                    $("#startLink").append("<option value=" + (NodeCount + 1) + ">" + (NodeCount + 1) + "</option>");
                    $("#endLink").append("<option value=" + (NodeCount + 1) + ">" + (NodeCount + 1) + "</option>");


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

                if (allNodes[i].NodeNum == isInCircle.NodeNum) { //creates red rings surrounding selected node

                    allNodes[i].isSelected = true;
                    currentSelectedNode = allNodes[i];
                    selectedNode = allNodes[i];
                    context.strokeStyle = "#f44242";
                    context.beginPath();
                    context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 30, 0, 2 * Math.PI);
                    context.stroke();


                } else if (allNodes[i].NodeNum != currentSelectedNode) { // overshadows red ring(selected ring) when another node is selected
                    allNodes[i].isSelected = false;
                    for (var j = 0; j < 10; j++) {
                        context.strokeStyle = "#FFFFFF";
                        context.beginPath();
                        context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 30, 0, 2 * Math.PI);
                        context.stroke();
                    }

                }




            }
        }

    }
    document.getElementById("link").onclick = function linkNodes() {
        start = (startLinkSel.options[startLinkSel.selectedIndex].value - 1);
        end = (endLinkSel.options[endLinkSel.selectedIndex].value - 1);
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(allNodes[start].CoordX, allNodes[start].CoordY);
        context.lineTo(allNodes[end].CoordX, allNodes[end].CoordY);
        context.stroke();
        context.closePath();
        allNodes[end].linkStartNode = allNodes[start];
        allNodes[start].endNodes.push(allNodes[end]);
        /*var temp = this.linkStartNode;
        var linkLen = 1;

       while(temp != null){//get link string length
        temp = temp.linkStartNode;
        linkLen++;
       }*/



        return false;
    }

    document.getElementById("unlink").onclick = function unlinkNodes() {
        running = false;
        lineGraphCtx.clearRect(0, 0, lineGraph.width, lineGraph.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        intializeLineGraph();
        barGraphCtx.clearRect(0, 0, barGraph.width, barGraph.height);
        barGraphCtx.fillStyle = "#FDFEFE";
        intializeBarGraph();
        for (var i = 0; i < allNodes.length; i++) {
            context.beginPath();
            context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 30, 0, 2 * Math.PI, false);
            context.closePath();

            context.fillStyle = allNodes[i].Color;
            context.beginPath();
            context.arc(allNodes[i].CoordX, allNodes[i].CoordY, 20, 0, 2 * Math.PI, false);
            context.closePath()
            context.fill();

            context.fillStyle = "black";
            context.fillText(allNodes[i].NodeNum.toString(), allNodes[i].CoordX - 3, allNodes[i].CoordY + 2);
            allNodes[i].linkStartNode = null;
            for (var j = 0; j < allNodes[i].numRuns; j++) {
                lineGraphCtx.strokeStyle = allNodes[i].Color;
                plotPoints(allNodes[i].alleleData[j], allNodes[i].genNum);

            }
        }


        return false;
    }



    document.getElementById("enterVals").onclick = function enterValues() {
     //sets values for each node
        if (!running) {
            setSelectedNodeInfo(currentSelectedNode);
            currentSelectedNode.isConfirm = true;
            allConfirmed++;
        }

        return false;

    }

    document.getElementById("Run").onclick = function beginRun() { //calculates points data
        createStrings();
        start = (startLinkSel.options[startLinkSel.selectedIndex].value - 1);
        end = (endLinkSel.options[endLinkSel.selectedIndex].value - 1);
        notLinked = allNodes.filter(linkCheck);
        
        for (var i = 0; i < allNodes.length; i++) {
             for (var p = 0; p < allNodes[i].linkString.length; p++) {
                allNodes[i].stringSum+=allNodes[i].linkString[p].genNum; 
            }

            if (allNodes[i].genNum > largestGen) {
                largestGen = allNodes[i].genNum;
            }
        }

        for (var i = 0; i < allNodes.length; i++) {
            if(allNodes[i].stringSum > largestGen){
                largestGen = allNodes[i].stringSum;
            }
           
        }


        for (var p = 0; p < allNodes.length; p++) {
            if (!allNodes[p].isConfirm) {
                alert("Please confirm values for node:" + allNodes[p].NodeNum + " before running simulation.");
                p = 0;
                return false;
            }
        }
        if (allConfirmed >= allNodes.length) {
            for (var j = 0; j < allNodes.length; j++) {
                $("#nodeSelect").append("<option value=" + allNodes[j].NodeNum + ">Node" + allNodes[j].NodeNum + "</option>");
                for (var k = 0; k < allNodes[j].numRuns; k++) {
                    if(allNodes[j].linkString.length == 0 && allNodes[j].linkStartNode == null){//plots unlinked nodes
                        allNodes[j].runSim();
                        lineGraphCtx.strokeStyle = allNodes[j].Color;
                        plotPoints(allNodes[j].alleleData[k], allNodes[j].genNum);
                    }
                    else if(allNodes[j].linkString.length > 1 && allNodes[j].linkStartNode == null){//plots linked nodes
                        $("#nodeSelect").append("<option value=" + allNodes[j].NodeNum + ">Node" + allNodes[j].NodeNum + "</option>");
                        allNodes[j].link(largestGen);

                        

                        
                    }
                    
                }
            }
           

        }
        confirmVal = false;
        running = true;
        document.getElementById("endGen").innerHTML = largestGen;
        return false;


    }


    function linkCheck(node) {//filters notLinked nodes from allNodes array

        var links = [];
        for (var i = 0; i < allNodes.length; i++) {
            if(allNodes[i].linkStartNode != null){
                links.push(allNodes[i].linkStartNode);
            }
        }
          if (links.length == 0) {
                return true;
            } 
        
            else if(links.indexOf(node) != -1 && node.linkStartNode != null){//isLinked
                return false;
            }
            else if(links.indexOf(node) == -1 && node.linkStartNode == null){//not Linked
                return true;
            }
            
    } 

    function createStrings(z=0){//creates node linkStrings
        var temp = 0;
        
        while(x < allNodes.length){
            if(allNodes[x].endNodes.length > 0){
                if(z == 0){
                    allNodes[x].linkString.push(allNodes[x]);//appends intial node to linkString
                }
                
                
                if(z <= allNodes[x].linkString.length-1){
                     temp = allNodes[x].linkString[z].endNodes;
                    for (var y = 0; y < temp.length; y++) {
                        allNodes[x].linkString.push(temp[y]); // appends endNodes of current endNode in linkString
                        
                    }
                    
                    return createStrings(z+1);

                }
                
                z=0;
                
                    
            }
            x++;
        }      
        
        
    }
       
        
    

    document.getElementById("restart").onclick = function resetVals() { //resets data
        if (confirm("Are you sure you want to restart the simulation?")) {
            for (var i = 0; i < allNodes.length; i++) {
                allNodes[i].numRuns = 1;
                allNodes[i].startPer = .5;
                allNodes[i].genNum = 100;
                allNodes[i].startPop = 100;
                allNodes[i].plusplusS = 1.0;
                allNodes[i].plusminusS = 1.0;
                allNodes[i].minusminusS = 1.0;
                allNodes[i].alleleData = [];
                allNodes[i].isConfirm = false;
            }

            lineGraphCtx.clearRect(0, 0, lineGraph.width, lineGraph.height);
            intializeLineGraph();
            barGraphCtx.clearRect(0, 0, barGraph.width, barGraph.height);
            barGraphCtx.fillStyle = "#FDFEFE";
            intializeBarGraph();
            genCap = 0;
            running = false;
            largestGen = 0;
            allConfirmed = 0;
            $("#nodeSelect").empty();
            $("#nodeSelect").append("<option value='None'>None</option>");
        }

        return false;
    }


    document.getElementById("nodeSelect").onchange = function changeBarGraph() { //plots bars on barcanvas
        $("#RunTotal").html("" + currentSelectedNode.numRuns);



        barGraphCtx.clearRect(0, 0, barGraph.width, barGraph.height);
        barGraphCtx.fillStyle = "#FDFEFE";
        barGraphCtx.fillRect(0, 0, barGraph.width, barGraph.height);
        intializeBarGraph();


        switch (sel.options[sel.selectedIndex].value) {

            case "1":
                plotBars(allNodes[0]);
                $("#RunTotal").html("" + allNodes[0].numRuns);
                break;
            case "2":
                plotBars(allNodes[1]);
                $("#RunTotal").html("" + allNodes[1].numRuns);
                break;
            case "3":
                plotBars(allNodes[2]);
                $("#RunTotal").html("" + allNodes[2].numRuns);
                break;
            case "4":
                plotBars(allNodes[3]);
                $("#RunTotal").html("" + allNodes[3].numRuns);
                break;
            case "5":
                plotBars(allNodes[4]);
                $("#RunTotal").html("" + allNodes[4].numRuns);
                break;
            case "6":
                plotBars(allNodes[5]);
                $("#RunTotal").html("" + allNodes[5].numRuns);
                break;
            case "7":
                plotBars(allNodes[6]);
                $("#RunTotal").html("" + allNodes[6].numRuns);
                break;
            case "8":
                plotBars(allNodes[7]);
                $("#RunTotal").html("" + allNodes[7].numRuns);
                break;
            case "9":
                plotBars(allNodes[8]);
                $("#RunTotal").html("" + allNodes[8].numRuns);
                break;
            case "10":
                plotBars(allNodes[9]);
                $("#RunTotal").html("" + allNodes[9].numRuns);
                break;
        }


    }


    function pointInCircle(x, y) { //checks if mouse click is located within a node
        for (var i = 0; i < allNodes.length; i++) {
            var distance = Math.sqrt(Math.pow((x - allNodes[i].CoordX), 2) + Math.pow((y - allNodes[i].CoordY), 2));
            if (distance <= 35) {
                currentSelectedNode = allNodes[i];
                return allNodes[i];
            }

        }


    }

    function setSelectedNodeInfo(node) { //Text fields value set to value for corresponding node
        if (parseFloat($("#Starting").val()) > 1 || parseFloat($("#Starting").val()) < 0) {
            alert("Please enter a valid starting percentage(0-1)");
        } else if (parseInt($("#NumGenerations").val()) > 500 || parseInt($("#NumGenerations").val()) <= 0) {
            alert("Please enter a valid number of generations(1-500)");
        } else if (parseFloat($("#PPSurvival").val()) > 1 || parseFloat($("#PPSurvival").val()) < 0) {
            alert("Please enter a valid survival percentage(0-1)");
        } else if (parseFloat($("#PMSurvival").val()) > 1 || parseFloat($("#PMSurvival").val()) < 0) {
            alert("Please enter a valid survival percentage(0-1)");
        } else if (parseFloat($("#MMSurvival").val()) > 1 || parseFloat($("#MMSurvival").val()) < 0) {
            alert("Please enter a valid survival percentage(0-1)");
        } else if (parseInt($("#NumRuns").val()) > 250 || parseInt($("#NumRuns").val()) <= 0) {
            alert("Please enter a valid number of runs(1-250)");
        } else if (parseInt($("#StartingPop").val()) < 0) {
            alert("Please enter a valid starting population");
        } else {


            node.numRuns = parseInt($("#NumRuns").val());
            node.startPer = parseFloat($("#Starting").val());
            node.genNum = parseInt($("#NumGenerations").val());
            node.startPop = parseInt($("#StartingPop").val());
            node.plusplusS = parseFloat($("#PPSurvival").val());
            node.plusminusS = parseFloat($("#PMSurvival").val());
            node.minusminusS = parseFloat($("#MMSurvival").val());
            confirmVal = true;

        }
    }




    canvas.addEventListener("click", draw);


    function getMousePos(canvas, evt) { //gets mouse position in canvas

        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.pageX,
            y: evt.pageY
        };


    }




    function overlap(x, y) { //checks if node will overlap another node before drawn
        var temp = 0;
        for (var i = 0; i < allNodes.length; i++) {
            var distance = Math.sqrt(Math.pow((x - allNodes[i].CoordX), 2) + Math.pow((y - allNodes[i].CoordY), 2));

            if (NodeCount == 0 || distance > 40) {
                temp++;

            }


        }
        if (temp == NodeCount) {
            return false;
        } else {
            return true;
        }



    }


    function intializeLineGraph() {
        lineGraphCtx.fillStyle = "#FDFEFE";
        lineGraphCtx.fillRect(0, 0, lineGraph.width, lineGraph.height);
        lineGraphCtx.strokeStyle = "#000000";
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
        barGraphCtx.fillStyle = "#FDFEFE";
        barGraphCtx.fillRect(0, 0, barGraph.width, barGraph.height);
        var ylineSpace = barGraph.height / 4;
        var xValueSpace = barGraph.width / 10;

        barGraphCtx.beginPath();
        for (var i = 0; i < barGraph.height; i += ylineSpace) {
            barGraphCtx.moveTo(0, i);
            barGraphCtx.lineTo(barGraph.width, i);
            barGraphCtx.stroke();
        }

    }


    function plotPoints(array = genArray, gens = 100, endData = 0) {

        var pointSpace = (((gens / largestGen) * (lineGraph.width) / gens));

        lineGraphCtx.beginPath();
        lineGraphCtx.lineWidth = 0.5;
        lineGraphCtx.moveTo(0, (400 - (array[0][1] * 400))); //zeroY
        for (var r = 0; r < array.length; r++) {
            lineGraphCtx.lineTo(pointSpace * (r + 1), 400 - (array[r][1] * 400));
            lineGraphCtx.moveTo(pointSpace * (r + 1), 400 - (array[r][1] * 400));

            lineGraphCtx.stroke();
            console.log(array[r][1]);


        }

        if (gens != largestGen) {
            lineGraphCtx.beginPath();
            lineGraphCtx.strokeStyle = "#1A1717";
            lineGraphCtx.moveTo((pointSpace * gens), lineGraph.height);
            lineGraphCtx.lineTo((pointSpace * gens), 0);
            lineGraphCtx.font = "30px Arial";
            lineGraphCtx.fillStyle = "black";
            lineGraphCtx.fillText("" + gens, (pointSpace * gens), 200);
            lineGraphCtx.stroke();
            lineGraphCtx.closePath();
        }
        array = [];
        lineGraphCtx.closePath();
    }




    function plotBars(node) {

        var rectHeight = 400;
        var barIncrease = barGraph.height / node.numRuns;
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
        for (var i = 0; i < node.numRuns; i++) {
            var finalFreq = node.alleleData[i][node.alleleData[i].length - 2][1];

            if (finalFreq <= 0.1) {
                freq01 += barIncrease;
            } else if (finalFreq > 0.1 && finalFreq <= 0.2) {
                freq12 += barIncrease;
            } else if (finalFreq > 0.2 && finalFreq <= 0.3) {
                freq23 += barIncrease;
            } else if (finalFreq > 0.3 && finalFreq <= 0.4) {
                freq34 += barIncrease;
            } else if (finalFreq > 0.4 && finalFreq <= 0.5) {
                freq45 += barIncrease;
            } else if (finalFreq > 0.5 && finalFreq <= 0.6) {
                freq56 += barIncrease;
            } else if (finalFreq > 0.6 && finalFreq <= 0.7) {
                freq67 += barIncrease;
            } else if (finalFreq > 0.7 && finalFreq <= 0.8) {
                freq78 += barIncrease;
            } else if (finalFreq > 0.8 && finalFreq <= 0.9) {
                freq89 += barIncrease;
            } else if (finalFreq > 0.9 && finalFreq <= 1.0) {
                freq91 += barIncrease;
            }

        }

        barGraphCtx.strokeRect(0, rectHeight - freq01, 50, barGraph.height + freq01);
        barGraphCtx.fillRect(0, rectHeight - freq01, 50, barGraph.height + freq01);




        barGraphCtx.strokeRect(50, rectHeight - freq12, 50, barGraph.height + freq12);
        barGraphCtx.fillRect(50, rectHeight - freq12, 50, barGraph.height + freq12);




        barGraphCtx.strokeRect(100, rectHeight - freq23, 50, barGraph.height + freq23);
        barGraphCtx.fillRect(100, rectHeight - freq23, 50, barGraph.height + freq23);




        barGraphCtx.strokeRect(150, rectHeight - freq34, 50, barGraph.height + freq34);
        barGraphCtx.fillRect(150, rectHeight - freq34, 50, barGraph.height + freq34);




        barGraphCtx.strokeRect(200, rectHeight - freq45, 50, barGraph.height + freq45);
        barGraphCtx.fillRect(200, rectHeight - freq45, 50, barGraph.height + freq45);




        barGraphCtx.strokeRect(250, rectHeight - freq56, 50, barGraph.height + freq56);
        barGraphCtx.fillRect(250, rectHeight - freq56, 50, barGraph.height + freq56);


        barGraphCtx.strokeRect(300, rectHeight - freq67, 50, barGraph.height + freq67);
        barGraphCtx.fillRect(300, rectHeight - freq67, 50, barGraph.height + freq67);




        barGraphCtx.strokeRect(350, rectHeight - freq78, 50, barGraph.height + freq78);
        barGraphCtx.fillRect(350, rectHeight - freq78, 50, barGraph.height + freq78);




        barGraphCtx.strokeRect(400, rectHeight - freq89, 50, barGraph.height + freq89);
        barGraphCtx.fillRect(400, rectHeight - freq89, 50, barGraph.height + freq89);



        barGraphCtx.strokeRect(450, rectHeight - freq91, 50, barGraph.height + freq91);
        barGraphCtx.fillRect(450, rectHeight - freq91, 50, barGraph.height + freq91);



    }


});
var genCap = 0;
var running;
