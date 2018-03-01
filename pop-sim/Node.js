var lineGraph = document.getElementById("lineGraph");
var lineGraphCtx = lineGraph.getContext("2d");
var startX = 0;
var notPrint = [];
var pointSpace,addedSpace,startX;


function Node(selected,posX,posY,Color,NodeNum,startPer,genNum,startPop,plusplusS,plusminusS,minusminusS,numRuns, alleleData,isConfirm,linkStartNode,endNodes,linkString){
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
        

        


    }


  Node.prototype.runSim = function () {
    


       
        var genArray = [];

        var nextPopArray = [];

        
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
        var gen = this.genNum;
        var startPop = this.startPop;
        var pp = this.plusplusS;
        var pm = this.plusminusS;
        var mm = this.minusminusS;

        var i;
        for (i = 0; i < gen; i++) {

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
                    w = (p * p * this.plusplusS) + (2.0 * p * q * pm) + (q * q * mm);
                    pp1 = (p * p * pp) / w;
                    pp2 = (2.0 * p * q * pm) / w;
                    if (j > 0) {
                        nx = binomial(startPop, pp1);

                        if (pp1 < 1.0 && nx < startPop) {
                            ny = binomial((startPop - nx), (pp2 / (1.0 - pp1)));
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


    Node.prototype.link = function(scale) {
    if(scale == undefined){scale =100;}        
            var temp = 0;
            pointSpace =((lineGraph.width-30)/scale);//point Spacing for start node
                for (var l = 0; l < this.linkString.length; l++) {

                    for(var m = 0; m < this.linkString[l].numRuns;m++){

                        this.timeout(l,m);
                    }
                }

        return true;
    };

    Node.prototype.timeout = function(l,m){//processes and draws linked nodes with 10 ms timeout to prevent UI unresponsiveness
        $("loader").show();
        var that = this;
        
        
        // # runs must be same to link
            setTimeout(function(){

                startX = 0;
                if(l > 0){
                    that.linkString[l].startPer = that.linkString[l].linkStartNode.alleleData[m][that.linkString[l].linkStartNode.alleleData[m].length-1][1];
                }
                                
                that.linkString[l].runSim();
                temp = that.linkString[l].linkStartNode;
                while(temp != null){
                    startX+= temp.genNum;
                    temp = temp.linkStartNode;
                }

                lineGraphCtx.beginPath();
                                
                lineGraphCtx.strokeStyle = that.linkString[l].Color;               
                lineGraphCtx.moveTo((startX*pointSpace)+30, (lineGraph.height - (that.linkString[l].alleleData[m][0][1] * lineGraph.height))); //zeroY
                for (var n = 0; n < that.linkString[l].alleleData[m].length; n++) {
                    lineGraphCtx.lineTo((startX*pointSpace)+(pointSpace *(n+1)+30), lineGraph.height - (that.linkString[l].alleleData[m][n][1] * lineGraph.height));
                    lineGraphCtx.moveTo((startX*pointSpace)+(pointSpace *(n+1)+30), lineGraph.height - (that.linkString[l].alleleData[m][n][1] * lineGraph.height));
                                    
                    lineGraphCtx.stroke();
                                        

                }
                              
            },10);                   
       

        lineGraphCtx.closePath();
       
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
