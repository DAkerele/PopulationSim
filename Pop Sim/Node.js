var lineGraph = document.getElementById("lineGraph");
var lineGraphCtx = lineGraph.getContext("2d");
var startX = 0;
var notPrint = [];
var pointSpace,addedSpace,startX;

function Node(selected,posX,posY,Color,NodeNum,startPer,genNum,startPop,plusplusS,plusminusS,minusminusS,numRuns, alleleData,isConfirm,linkStartNode,endNodes,linkString,stringSum){
        this.isSelected = selected;
        this.CoordX = posX;
        this.CoordY = posY;
        this.NodeNum = NodeNum;
        this.Color = Color;
        this.startPer = startPer;
        this.genNum = genNum;
        this.startPop = startPop;
        this.plusplusS = plusplusS;
        this.plusminusS = plusminusS;
        this.minusminusS = minusminusS;
        this.numRuns = numRuns;
        this.alleleData = alleleData;
        this.isConfirm = isConfirm;
        this.linkStartNode = linkStartNode;
        this.endNodes = endNodes;
        this.linkString = linkString;
        this.stringSum = stringSum;

        


    }


  Node.prototype.runSim = function () {
       
        var genArray = [];

        var nextPopArray = [];

        genArray.splice(0, genArray.length);
        for (var j = 0; j <= 1; j++) {
            nextPopArray.push(this.startPer);
        }
        genArray.push(nextPopArray);
        beginGen = 0;
        endGen = this.genNum;


        var currentPopSize = this.startPop * 2;

        var pbar;
        var p = 0.0;
        var q;
        var w;
        var pp1;
        var pp2;

        var nx;
        var ny;

        for (var i = 0; i < this.genNum; i++) {

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
                    w = (p * p * this.plusplusS) + (2.0 * p * q * this.plusminusS) + (q * q * this.minusminusS);
                    pp1 = (p * p * this.plusplusS) / w;
                    pp2 = (2.0 * p * q * this.plusminusS) / w;
                    if (j > 0) {
                        nx = binomial(this.startPop, pp1);

                        if (pp1 < 1.0 && nx < this.startPop) {
                            ny = binomial((this.startPop - nx), (pp2 / (1.0 - pp1)));
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

        this.alleleData.push(genArray);
        

        

       
        

    }


    Node.prototype.link = function(scale=100) {
       
        var temp = 0;
        pointSpace =((this.stringSum/scale)*(lineGraph.width)/scale);//point Spacing for start node
            for (var l = 0; l < this.linkString.length; l++) {
                startX = 0;
                for(var m = 0; m < this.linkString[l].numRuns;m++){// # runs must be same to link
                    startX = 0;
                    if(l > 0){
                        this.linkString[l].startPer = this.linkString[l].linkStartNode.alleleData[m][this.linkString[l].linkStartNode.alleleData[m].length-1][1];
                    }
                    
                    this.linkString[l].runSim();
                    temp = this.linkString[l].linkStartNode;
                    while(temp != null){
                        startX+= temp.genNum;
                        temp = temp.linkStartNode;
                    }
                    lineGraphCtx.beginPath();
                    lineGraphCtx.lineWidth = 0.5;
                    lineGraphCtx.strokeStyle = this.linkString[l].Color;
                    lineGraphCtx.moveTo((startX*pointSpace), (400 - (this.linkString[l].alleleData[m][0][1] * 400))); //zeroY
                    for (var n = 0; n < this.linkString[l].alleleData[m].length; n++) {
                        lineGraphCtx.lineTo((startX*pointSpace)+(pointSpace *(n+1)), 400 - (this.linkString[l].alleleData[m][n][1] * 400));
                        lineGraphCtx.moveTo((startX*pointSpace)+(pointSpace *(n+1)), 400 - (this.linkString[l].alleleData[m][n][1] * 400));
                        

                        lineGraphCtx.stroke();
                            

                    }
                    
                    
                }
                    lineGraphCtx.closePath();
            }       

        

    };


    

      


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
