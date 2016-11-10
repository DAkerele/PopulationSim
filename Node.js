"use strict";
class Node{

	 constructor(selected,posX,posY,color,NodeNum,startPer,genNum,startPop,plusplusS,plusminusS,minusminusS){
		this.isSelected = selected;
		this.CoordX = posX;
		this.CoordY = posY;
		this.Color = color;
		this.NodeNum = NodeNum;
		this.startPer = startPer;
		this.genNum = genNum;
		this.startPop = startPop;
		this.plusplusS = plusplusS;
		this.plusminusS = plusminusS;
		this.minusminusS = minusminusS;
	}


	setPosX(pos){

		 centerX = pos;

		}

	setPosY(pos){

		 	centerY = pos;

		}

	setPosY(pos){

		 	enterY = pos;

		}

	getPosX() {
			
			return this;

		}

	getPosY() {

			return centerY;

		}


}
