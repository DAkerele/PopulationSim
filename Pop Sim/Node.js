
 function Node(selected,posX,posY,Color,NodeNum,startPer,genNum,startPop,plusplusS,plusminusS,minusminusS,numRuns, alleleData){
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

        this.alleleData = genArray;
        alert("yes")

       
        

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






