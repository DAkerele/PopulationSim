$(document).ready(function() {
    var allNodes = [];
    var selectedNodes = [];
    var currentSelectedNode = null;
    var nodeColors = ["#c82124", "#82FA58", "#FE2E2E", "#61210B", "#FE2EF7", "#9A2EFE", "#58FAF4", "#F4FA58", "#FF8000", "#585858"]
    var NodeCount = 0; // number of nodes allowed on canvas
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var nd = [10];
    var ni = [10];
    var value = [10];
    intializeArrays();
    var tempz;


    context.fillStyle = "#FDFEFE";
    context.fillRect(10, 10, canvas.width, canvas.height);

    function intializeArrays() {

        for (var r = 0; r < 10; r++) {
            nd[r] = new Array(5);
            for (var c = 0; c < 5; c++) {
                nd[r][c] = 0;
            }
        }


        for (var i = 0; i < 10; i++) {
            ni[i] = new Array(5);
            for (var j = 0; j < 5; j++) {
                ni[i][j] = 0;
            }
        }

        for (var a = 0; a < 10; a++) {
            value[a] = new Array(500);
            for (var b = 0; b < 500; b++) {
                value[a][b] = new Array(250);
                for (var c = 0; c < 250; c++) {
                    value[a][b][c] = 0.0;

                }
            }
        }
    }




    function draw(e) { //draws nodes on click event
        var pos = getMousePos(canvas, e);
        posX = pos.x;
        posY = pos.y;


        if (NodeCount < 10) {
            if (Overlap(posX, posY) == false) { 
                context.fillStyle = nodeColors[NodeCount];
                context.beginPath();
                context.arc(posX, posY, 25, 0, 2 * Math.PI, false);
                context.closePath();
                context.fill();
                context.fillStyle = "black";
                context.fillText((NodeCount + 1).toString(), posX - 3, posY + 2);

                var node = new Node(false, posX, posY, nodeColors[NodeCount], (NodeCount + 1), 50, 1, 100, 100, 100, 100);

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
                    if (allNodes[i].NodeNum != currentSelectedNode) {
                        allNodes[i].isSelected = false;
                    }

                    if (allNodes[i].NodeNum == isInCircle.NodeNum) {
                        allNodes[i].isSelected = true;
                    }

                    //currentSelectedNode = allNodes[i].NodeNum;
                }


                document.getElementById("enterVals").onclick = function enterValues() {
                    setSelectedNodeInfo(currentSelectedNode);
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

        node.startPer = document.getElementById("Starting%").value;
        node.genNum = document.getElementById("NumGenerations").value;
        node.startPop = document.getElementById("StartingPop").value;
        node.plusplusS = document.getElementById("++Survival%").value;
        node.plusminusS = document.getElementById("+-Survival%").value;
        node.minusminusS = document.getElementById("--Survival%").value;

    }


    canvas.addEventListener("click", draw);


    function getMousePos(canvas, evt) { //gets mouse position in canvas

        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.pageX,
            y: evt.pageY
        };


    }

    function findValueofNode(paramInt, paramFloat) {
        var m = 0;
        var n = 0;
        var i1 = 0;
        var f5 = 0.0;
        var str3 = "";
        var str1 = "";
        var str2 = "";
        var f6 = nd[paramInt][1] / 100.0;
        var f7 = nd[paramInt][2] / 100.0;
        var f8 = nd[paramInt][3] / 100.0;
        var f1 = paramFloat * paramFloat;
        var f2 = 2.0 * paramFloat * (1.0 - paramFloat);
        var f3 = (1.0 - paramFloat) * (1.0 - paramFloat);
        var i = f1 * ni[paramInt][1];
        var j = f2 * ni[paramInt][1];
        var k = ni[paramInt][1] - (i + i);
        while (m + n + i1 < ni[paramInt][1]) {
            str1 = choosePerson(f1, f2);
            str2 = choosePerson(f1, f2);
            str3 = determineChild(str1, str2);
            var f4 = Math.random();
            if ((str3 == "PP") && (f4 < f6)) {
                m++;
            }
            if ((str3 == "PM") && (f4 < f7)) {
                n++;
            }
            if ((str3 == "MM") && (f4 < f8)) {
                i1++;
            }
        }
        f5 = (2 * m + n) / (2 * (m + n + i1));
        return f5;
    }

    function determineChild(paramFloat1, paramFloat2) {
        var f1 = Math.random();
        if ((paramString1 == "PP") && (paramString2 == "PP")) {
            return "PP";
        }
        if (((paramString1 == "PP") && (paramString2 == "MM")) || ((paramString1 == "MM") && (paramString2 == "PP"))) {
            return "PM";
        }
        if (((paramString1 == "PP") && (paramString2 == "PM")) || ((paramString1 == "PM") && (paramString2 == "PP"))) {
            if (f1 < 0.5) {
                return "PP";
            }
            return "PM";
        }
        if (((paramString1 == "PM") && (paramString2 == "MM")) || ((paramString1 == "MM") && (paramString2 == "PM"))) {
            if (f1 < 0.5) {
                return "PM";
            }
            return "MM";
        }
        if ((paramString1 == "MM") && (paramString2 == "MM")) {
            return "MM";
        }
        if ((paramString1 == "PM") && (paramString2 == "PM")) {
            if (f1 < 0.5) {
                return "PM";
            }
            if ((f1 >= 0.5) && (f1 < 0.75)) {
                return "PP";
            }
            if (f1 >= 0.75) {
                return "MM";
            }
        }
        return "";
    }

    function choosePerson(paramString1, paramString2) {
        var f1 = myRandom.nextFloat();
        if ((f1 >= 0.0) && (f1 < paramFloat1)) {
            return "PP";
        }
        if ((f1 >= paramFloat1) && (f1 < paramFloat1 + paramFloat2)) {
            return "PM";
        }
        return "MM";
    }

    function Overlap(x, y) {
      
            if (allNodes.length == 0) 
            {
                return false;
            }
            else if (pointInCircle(x, y) !== undefined && allNodes.length >= 1) 
            {
                    return true;
            }
            else if(pointInCircle(x, y) == undefined && allNodes.length >= 1 && intersects(x,y) == false)
            {
                return false;
            }
        
    }

    function intersects(x,y){
          for (var i = 0; i < allNodes.length; i++) {
            var distance = (x - allNodes[i].CoordX) * (x - allNodes[i].CoordX) + (y - allNodes[i].CoordY) * (y - allNodes[i].CoordY);
                if(50 > distance){
                  return true;
                }
                else if(50 < distance){
                  return false;
                }
            }
    }
       
        
    


});
