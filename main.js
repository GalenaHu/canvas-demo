/*
* @Author: Galena
* @Date:   2019-03-15 14:13:16
* @Last Modified by:   Galena
* @Last Modified time: 2019-03-16 20:00:30
*/

var nav = document.getElementById('nav');
var canvas = document.getElementById('canvas');
var eraser = document.getElementById('eraser');
var usingEraser = false;
var pen = document.getElementById('pen');
var usingPen = true;
var penSelect = document.getElementById('penSelect');
var penSvg = document.getElementById('penSvg');
var eraserSvg = document.getElementById('eraserSvg');
var trash = document.getElementById('trash');
var downLoad = document.getElementById('downLoad');
penSvg.style.fill = selectColor;
pen.style.backgroundColor = '#5C6474';
var ctx = canvas.getContext('2d');


setCanvasSize();
window.onresize = function() {
	setCanvasSize();
}

document.ontouchmove = function(e){
    e.preventDefault();
}

//************************************************************

var selectWidth = 1;
var selectColor = '#000000';
var widthArr = document.getElementsByClassName('selectWidth');
for (var i = 0;i<widthArr.length;i++) {
	widthArr[i].onclick = function() {
		selectWidth = this.id;
	}
}
var colorArr = document.getElementsByClassName('selectColor');
for (var i = 0;i<colorArr.length;i++) {
	colorArr[i].onclick = function() {
		selectColor = this.id;
	}
}

//***********************************************************

var using = false;
var lastPoint = {'x':undefined, 'y':undefined};
var newPoint = {'x':undefined, 'y':undefined};

listenToUser();



function listenToUser() {
	if (document.body.ontouchstart !== undefined) {
		//触屏
		penSelect.style.width = '231px';
		penSelect.style.left = '0';
		canvas.ontouchstart = function(a) {
			using = true;
			var x = a.touches[0].clientX - canvas.getBoundingClientRect().left; 
			var y = a.touches[0].clientY - canvas.getBoundingClientRect().top;
			lastPoint.x = x;
			lastPoint.y = y;
			if (usingEraser) {
				changeClearRect(x, y, 10)
			} else {
				drawCircle(x, y, selectWidth, selectColor);
			}
		}

		canvas.ontouchmove = function(a) {
			if (using) {
				var x = a.touches[0].clientX - canvas.getBoundingClientRect().left; 
				var y = a.touches[0].clientY - canvas.getBoundingClientRect().top;
				newPoint.x = x;
				newPoint.y = y;
				if (usingEraser) {
					changeClearRect(x, y, 10)
				} else {
					drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, selectWidth*2, selectColor);
					drawCircle(x, y, selectWidth, selectColor);
				}
				lastPoint = newPoint;
				newPoint = {'x':undefined, 'y':undefined};
			}

		}

		canvas.ontouchend = function() {
			using = false;
		}
	} else {
		//非触屏
		canvas.onmousedown = function(a) {
			using = true;
			var x = a.clientX - canvas.getBoundingClientRect().left; 
			var y = a.clientY - canvas.getBoundingClientRect().top;
			lastPoint.x = x;
			lastPoint.y = y;
			if (usingEraser) {
				changeClearRect(x, y, 10)
			} else {
				drawCircle(x, y, selectWidth, selectColor);
			}
			
		}
		canvas.onmousemove = function(a) {
			if (using) {
				var x = a.clientX - canvas.getBoundingClientRect().left; 
				var y = a.clientY - canvas.getBoundingClientRect().top;
				newPoint.x = x;
				newPoint.y = y;
				if (usingEraser) {
					changeClearRect(x, y, 10)
				} else {
					drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, selectWidth*2, selectColor);
					drawCircle(x, y, selectWidth, selectColor);
				}
				lastPoint = newPoint;
				newPoint = {'x':undefined, 'y':undefined};
			}
		}

		canvas.onmouseup = function(a) {
			using = false;
		}
	}
}

//***************************************************************

function setCanvasSize() {
	var pageWidth = document.documentElement.clientWidth;
	var pageHeight = document.documentElement.clientHeight;
	canvas.width = pageWidth;
	canvas.height = pageHeight;
}

function drawCircle(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.fill();
}

function drawLine(LPX, LPY, NPX, NPY, W, color) {
	ctx.beginPath();
	ctx.moveTo(LPX, LPY);
	ctx.lineWidth = W;
	ctx.lineTo(NPX, NPY);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function changeClearRect(x, y, r) {
	ctx.save()
	ctx.beginPath()
	ctx.arc(x, y, r, 0, 2*Math.PI);
	ctx.clip()
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.restore();
}




document.onclick = function(e) {
	penSvg.style.fill = selectColor;
	if (e.target.id === 'penSvg' || e.target.id === 'pen' || e.target.parentNode.id === 'penSvg') {
		if (usingPen) {
			penSelect.style.display = 'flex';
		}
		pen.style.backgroundColor = '#5C6474';
		eraser.style.backgroundColor = 'transparent';
		usingPen = true;
		usingEraser = false;
	} else {
		penSelect.style.display = 'none';
	};
	if (e.target.id === 'eraserSvg' || e.target.id === 'eraser' || e.target.parentNode.id === 'eraserSvg') {
		usingEraser = true;
		usingPen = false;
		pen.style.backgroundColor = 'transparent';
		eraser.style.backgroundColor = '#5C6474';
	}
	if (e.target.id === 'trashSvg' || e.target.id === 'trash' || e.target.parentNode.id === 'trashSvg') {
		trash.onmousedown = function() {
			trash.style.backgroundColor = '#5C6474';
		}
		trash.onmouseup = function() {
			trash.style.backgroundColor = 'transparent';
			ctx.clearRect(0,0,canvas.width, canvas.height);
		}
		
	}
	if (e.target.id === 'downLoadSvg' || e.target.id === 'downLoa' || e.target.parentNode.id === 'downLoaSvg') {
		var url = canvas.toDataURL('image/png');
		var a = document.createElement('a');
		document.body.appendChild(a);
		a.href = url;
		a.download = 'image';
		a.click();
		a.remove();
	}
}

