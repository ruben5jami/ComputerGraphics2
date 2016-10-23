//created by Ruben Jami and Rotem Matetyahu

var action;
var points = [];
var lineArray = [];
var curveArray = [];
var circleArray = [];
var pt = 1;

var windowXmin = 0;
var windowXmax = 500;
var windowYmin = 0;
var windowYmax = 500;



jQuery( document ).ready(function($) {
    simplifyArray(tempLineArray, tempCurveArray, tempCircleArray);
    normalize(lineArray, curveArray, circleArray);
    drawBoat(lineArray, curveArray, circleArray);
    $("input[name=action]:radio").change(function (){    //if action is changed
        action = $("input[name=action]:checked").val();
        points = [];
        if(action == "scale"){
            var imageSize = prompt("Please enter the size of scale", 0.5);
            if(imageSize != null) {
                clearCanvas();
                scaleBoat(imageSize);
                drawBoat(lineArray, curveArray, circleArray);
            }
        }
        else if(action == "rotate"){
            var imageAngle = prompt("Please enter the angle of rotation", 90);
            if(imageAngle != null) {
                clearCanvas();
                rotateBoat(imageAngle);
                drawBoat(lineArray, curveArray, circleArray);
            }
        }
        else if(action == "reflectionx"){
            clearCanvas();
            reflactionX();
            drawBoat(lineArray, curveArray, circleArray);

        }
        else if(action == "reflectiony"){
            clearCanvas();
            reflactionY();
            drawBoat(lineArray, curveArray, circleArray);
        }

    });


    // Instance the tour
    var tour = new Tour({
        debug: true,
        storage: false,
        steps: [
            {
                element: "#l_scale",
                title: "Scale",
                content: "click and type the scale e.g 0.5 will be half the size, to scale again simply click anywhere on the canvas",
                placement: "right"
            },
            {
                element: "#l_translate",
                title: "Translate",
                content: "click on to dots in the screen to move the image",
                placement: "bottom"
            },
            {
                element: "#l_rotate",
                title: "Rotate",
                content: "Click and type the angle to rotate clockwise to rotate again simply click anywhere on the canvas",
                placement: "bottom"
            },
            {
                element: "#l_reflectionx",
                title: "Reflection x",
                content: "just click to see the image's reflection horizontal to reflect again simply click anywhere on the canvas",
                placement: "bottom"

            },
            {
                element: "#l_reflectiony",
                title: "Reflection y",
                content: "just click to see the image's reflection vertical to reflect again simply click anywhere on the canvas",
                placement: "bottom"
            },
            {
                element: "#l_shearx",
                title: "Shear x",
                content: "click on to dots in the screen to shear the image on x axis",
                placement: "bottom"

            },
             {
             element: "#l_sheary",
             title: "Shear y",
             content: "click on to dots in the screen to shear the image on y axis",
             placement: "right"

             },
             {
             element: "#load_file",
             title: "Load file",
             content: "click to reload the original drawing",
             placement: "left"

             },
            {
                element: "#clearbtn",
                title: "Clear",
                content: "Clear the entire canvas",
                placement: "left"
            },
        ]});

    if (tour.ended()) {
        tour.restart();
    } else {
        tour.init();
        tour.start();
    }




});


//get the position in the canvas
document.addEventListener("DOMContentLoaded", init, false);
function init() {
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPosition, false);
}

function getPosition(event) {
    var x;
    var y;
    var canvas = document.getElementById("canvas");
    x = event.x;    //get x position from user
    y = event.y;    //get y position from user
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    points.push({x:x,y:y}); //push to the points array

    if(points.length == 1){
      if(action == "reflectionx"){
            clearCanvas();
            reflactionX();
            drawBoat(lineArray, curveArray, circleArray);
        }
        else if(action == "reflectiony"){
            clearCanvas();
            reflactionY();
            drawBoat(lineArray, curveArray, circleArray);
        }
        if(action == "scale"){
            var imageSize = prompt("Please enter the size of scale", 0.5);
            if(imageSize != null ){
                clearCanvas();
                scaleBoat(imageSize);
                drawBoat(lineArray, curveArray, circleArray);
            }
        }
        else if(action == "rotate"){
            var imageAngle = prompt("Please enter the angle of rotation", 90);
            if(imageAngle != null) {
                clearCanvas();
                rotateBoat(imageAngle);
                drawBoat(lineArray, curveArray, circleArray);
            }
        }
    }

    if(points.length == 2){
        if(action == "translate" ){
            disX = points[1].x - points[0].x;
            disY = points[1].y - points[0].y;
            translateBoat(disX, disY);
            clearCanvas();
            drawBoat(lineArray,curveArray,circleArray);
            points = [];
        }
        else if(action == "shearx"){
            disX = points[1].x - points[0].x;
            shearx(disX);
            clearCanvas();
            drawBoat(lineArray,curveArray,circleArray);
            points = [];
        }
        else if(action == "sheary"){
            disY = points[1].y - points[0].y;
            sheary(disY);
            clearCanvas();
            drawBoat(lineArray,curveArray,circleArray);
            points = [];

        }

    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

//reload the page to reload the php code
function loadFile(){
    location.reload();
}

//transfer the php arrays to javascript array to be used
function simplifyArray(tempLineArray, tempCurveArray, tempCircleArray){

    for(var i = 0; i< tempLineArray.length; i++){
        var temp = tempLineArray[i].split(",");
        lineArray.push({x1:parseFloat(temp[0]),y1:parseFloat(temp[1]), x2: parseFloat(temp[2]),y2: parseFloat(temp[3])});
        }

    for(i = 0; i< tempCurveArray.length; i++){
        var temp = tempCurveArray[i].split(",");
        curveArray.push({x1:parseFloat(temp[0]),y1:parseFloat(temp[1]), x2: parseFloat(temp[2]),y2: parseFloat(temp[3]),
            x3: parseFloat(temp[4]),y3: parseFloat(temp[5]), x4: parseFloat(temp[6]),y4: parseFloat(temp[7])});
    }
    for(i = 0; i< tempCircleArray.length; i++){
        var temp = tempCircleArray[i].split(",");
        circleArray.push({xc:parseFloat(temp[0]),yc:parseFloat(temp[1]), r: parseFloat(temp[2])});
    }
}


//drawing the boat using the parameters in the shape arrays
function drawBoat(lineArray, curveArray, circleArray){
    for(var i = 0; i< lineArray.length; i++){
        drawLine(lineArray[i].x1, lineArray[i].x2,lineArray[i].y1,lineArray[i].y2);
    }
    for(i = 0; i< curveArray.length; i++){
        drawCurve(curveArray[i].x1, curveArray[i].x2,curveArray[i].x3,
            curveArray[i].x4,curveArray[i].y1,curveArray[i].y2,
            curveArray[i].y3,curveArray[i].y4);
    }
    for(i = 0; i< circleArray.length; i++){
        drawCircle(circleArray[i].xc,circleArray[i].yc,circleArray[i].r);
    }
}

//clear all of the canvas before doing a tranformation
function clearCanvas(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height); //clear the canvas
    points = []; //intialize the array of points
}


//drawing a line using 2 points
function drawLine(x1, x2, y1, y2) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    x1 = parseInt(x1);
    x2 = parseInt(x2);
    y1 = parseInt(y1);
    y2 = parseInt(y2);
    //get the m
    var dy = Math.abs(y2 - y1);
    var dx = Math.abs(x2 - x1);
    var sx = x1 < x2? 1 : -1;
    var sy = y1 < y2? 1 : -1;
    if (dx >= dy) {
        var p = 2 * dy - dx;
        while (x1 != x2) {
            ctx.fillRect(x1, y1, pt, pt);   //draw dots all along the line
            if (p > 0) {
                y1 += sy;
                p -= 2 * dx;
            }
            x1 += sx;
            p += 2 * dy;
        }
    }
    else if (dy > dx) {
        var p = 2 * dx - dy;
        while (y1 != y2) {
            ctx.fillRect(x1, y1,pt,pt);
            if (p > 0) {
                x1 += sx;
                p -= 2 * dy;
            }
            y1 += sy;
            p += 2 * dx;
        }
    }
}

//drawing a circle using a point and a radius
function drawCircle(xCenter, yCenter, r){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    xCenter = parseInt(xCenter);
    yCenter = parseInt(yCenter);
    r = parseInt(r);
    if(r == 0){
        r = 1;
    }
    var x = 0;
    var p = 3-2*r;
    while (x<r) {
        //for all the quarters
        ctx.fillRect(xCenter+x, yCenter+r, pt, pt);
        ctx.fillRect(xCenter-x, yCenter+r, pt, pt);
        ctx.fillRect(xCenter+x, yCenter-r, pt, pt);
        ctx.fillRect(xCenter-x, yCenter-r, pt, pt);
        ctx.fillRect(xCenter+r, yCenter+x, pt, pt);
        ctx.fillRect(xCenter-r, yCenter+x, pt, pt);
        ctx.fillRect(xCenter+r, yCenter-x, pt, pt);
        ctx.fillRect(xCenter-r, yCenter-x, pt, pt);
        if (p < 0) {
            p = p+(4*x)+6;
        }
        else {
            p = p+4*(x-r)+10;
            r--;
        }
        x++;
    }
}




//drawing a bezier curve using 4 points
function drawCurve(x1, x2, x3, x4, y1, y2, y3, y4) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    x1 = parseInt(x1);
    x2 = parseInt(x2);
    x3 = parseInt(x3);
    x4 = parseInt(x4);
    y1 = parseInt(y1);
    y2 = parseInt(y2);
    y3 = parseInt(y3);
    y4 = parseInt(y4);
    var accuracy = 70;
    var Mb = [[-1,3,-3,1],[3,-6,3,0],[-3,3,0,0],[1,0,0,0]];
    var Px = [x1, x2, x3, x4];
    var Py = [y1, y2, y3, y4];
    var xParams = matrixMultiply(Mb, Px);
    var yParams = matrixMultiply(Mb, Py);
    var lastX = 0;
    var lastY = 0;
    var xt, yt;
    var step = parseFloat(1 / parseFloat(accuracy));
    for (var t = 0;t <= 1; t += step){
        if (t == 0) { //the first point
            lastX = x1;
            lastY = y1;
            xt = parseInt((xParams[0] * Math.pow(t, 3) + xParams[1] * Math.pow(t, 2) + xParams[2] * t + xParams[3]));
            yt = parseInt((yParams[0] * Math.pow(t, 3) + yParams[1] * Math.pow(t, 2) + yParams[2] * t + yParams[3]));
            drawLine(lastX, xt, lastY, yt);
        }
        else if (t == 1) {//draw the last point
            xt = x4;
            yt = y4;
            drawLine(lastX, xt, lastY, yt);
        }
        else {
            xt = parseInt((xParams[0] * Math.pow(t, 3) + xParams[1] * Math.pow(t, 2) + xParams[2] * t + xParams[3]));
            yt = parseInt((yParams[0] * Math.pow(t, 3) + yParams[1] * Math.pow(t, 2) + yParams[2] * t + yParams[3]));
            drawLine(lastX, xt, lastY, yt);
            lastX = xt;
            lastY = yt;
        }
    }
    drawLine(lastX, x4, lastY, y4);

}

function matrixMultiply(mb, px) {
    var result = [0,0,0,0];
    for (var i=0;i<mb.length;i++) {
        for (var j=0;j<px.length;j++) {
            result[i] += mb[i][j]*px[j];
        }
    }
    return result;
}

//normalize using translate and scale
function normalize(lineArray, curveArray, circleArray){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var minX = getXmin(lineArray, circleArray,curveArray);
    var minY = getYmin(lineArray, circleArray, curveArray);
    var maxX = getXmax(lineArray,circleArray, curveArray);
    var maxY = getYmax(lineArray,circleArray, curveArray);
    maxY = c.height/maxY;
    maxX = c.width/maxX;
    var normalizeScale = 0.8 * Math.min(maxX, maxY);
    minX = -minX;
    minY = -minY;
    translateBoat(minX, minY);
    scaleBoat(normalizeScale);
}
//normalize using a matrix
function normalize2(lineArray, curveArray, circleArray){
    var sx = ( getXmax(lineArray, circleArray, curveArray) - getXmin(lineArray, circleArray, curveArray)) / (windowXmax - windowXmin);
    var sy = ( getYmax(lineArray, circleArray, curveArray) - getYmin(lineArray, circleArray, curveArray) ) / (windowYmax - windowYmin);

    var T = [[sx,0,0], [0,sy,0], [getXmin(lineArray, circleArray, curveArray) - ( sx * windowXmin ),getYmin(lineArray, circleArray, curveArray) - ( sy * windowYmin),1]];
    for (var i = 0; i < lineArray.length; i++) {
        var result = numeric.dot([lineArray[i].x1, lineArray[i].y1, 1], T);
        lineArray[i].x1 = result[0];
        lineArray[i].y1 = result[1];
        result = numeric.dot([lineArray[i].x2, lineArray[i].y2, 1], T);
        lineArray[i].x2 = result[0];
        lineArray[i].y2 = result[1];
    }
    for (i = 0; i < curveArray.length; i++) {
        result = numeric.dot([curveArray[i].x1, curveArray[i].y1, 1], T);
        curveArray[i].x1 = result[0];
        curveArray[i].y1 = result[1];
        result = numeric.dot([curveArray[i].x2, curveArray[i].y2, 1], T);
        curveArray[i].x2 = result[0];
        curveArray[i].y2 = result[1];
        result = numeric.dot([curveArray[i].x3, curveArray[i].y3, 1], T);
        curveArray[i].x3 = result[0];
        curveArray[i].y3 = result[1];
        result = numeric.dot([curveArray[i].x4, curveArray[i].y4, 1], T);
        curveArray[i].x4 = result[0];
        curveArray[i].y4 = result[1];
    }
    for (i = 0; i < circleArray.length; i++) {
        result = numeric.dot([circleArray[i].xc, circleArray[i].yc, 1], T);
        circleArray[i].xc = result[0];
        circleArray[i].yc = result[1];
    }
}

//rotate the boat by receiving the angle as a parameter
function rotateBoat(angle){
    angle = parseInt(angle) * Math.PI / 180;
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var pc = {};
    pc.x = c.height / 2;
    pc.y  = c.width / 2;
    for (var i = 0; i < lineArray.length; i++) {
        p = rotate(pc, new Point(lineArray[i].x1,lineArray[i].y1), angle);
        lineArray[i].x1 = p.x;
        lineArray[i].y1 = p.y;
        p = rotate(pc, new Point(lineArray[i].x2,lineArray[i].y2), angle);
        lineArray[i].x2 = p.x;
        lineArray[i].y2 = p.y;
    }
    for (i = 0; i < curveArray.length; i++) {
        p = rotate(pc, new Point(curveArray[i].x1,curveArray[i].y1), angle);
        curveArray[i].x1 = p.x;
        curveArray[i].y1 = p.y;
        p = rotate(pc, new Point(curveArray[i].x2,curveArray[i].y2), angle);
        curveArray[i].x2 = p.x;
        curveArray[i].y2 = p.y;
        p = rotate(pc, new Point(curveArray[i].x3,curveArray[i].y3), angle);
        curveArray[i].x3 = p.x;
        curveArray[i].y3 = p.y;
        p = rotate(pc, new Point(curveArray[i].x4,curveArray[i].y4), angle);
        curveArray[i].x4 = p.x;
        curveArray[i].y4 = p.y;
    }
    for (i = 0; i < circleArray.length; i++) {
        p = rotate(pc, new Point(circleArray[i].xc,circleArray[i].yc), angle);
        circleArray[i].xc = p.x;
        circleArray[i].yc = p.y;
    }
}


function rotate(pc, pr, t) {
    var R = [[Math.cos(t), Math.sin(t), 0], [-Math.sin(t), Math.cos(t), 0], [0, 0, 1]];
    pc.x = -pc.x;
    pc.y = -pc.y;
    var p = this.translate(pr , pc);
    pc.x = -pc.x;
    pc.y = -pc.y;
    var result = numeric.dot([p.x, p.y, 1], R);
    p = this.translate(new Point(result[0], result[1]), pc);
    p.x = Math.round(p.x);
    p.y = Math.round(p.y);
    return p;
}

function translate (p, pt) {
    var T = [[1, 0, 0], [0, 1, 0], [pt.x, pt.y, 1]];
    var result = numeric.dot([p.x, p.y, 1], T);
    return  new Point(result[0], result[1]);
}

//scaling the boat by receiving a scale size
function scaleBoat(scaleSize){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var pc = {};
    pc.x = c.height / 2;
    pc.y  = c.width / 2;
    var T = [[scaleSize, 0, 0], [0, scaleSize, 0], [pc.x * (1 - scaleSize), pc.y * (1 - scaleSize), 1]];
    for (var i = 0; i < lineArray.length; i++) {
        var result = numeric.dot([lineArray[i].x1, lineArray[i].y1, 1], T);
        lineArray[i].x1 = result[0];
        lineArray[i].y1 = result[1];
        result = numeric.dot([lineArray[i].x2, lineArray[i].y2, 1], T);
        lineArray[i].x2 = result[0];
        lineArray[i].y2 = result[1];
    }
    for (i = 0; i < curveArray.length; i++) {
        result = numeric.dot([curveArray[i].x1, curveArray[i].y1, 1], T);
        curveArray[i].x1 = result[0];
        curveArray[i].y1 = result[1];
        result = numeric.dot([curveArray[i].x2, curveArray[i].y2, 1], T);
        curveArray[i].x2 = result[0];
        curveArray[i].y2 = result[1];
        result = numeric.dot([curveArray[i].x3, curveArray[i].y3, 1], T);
        curveArray[i].x3 = result[0];
        curveArray[i].y3 = result[1];
        result = numeric.dot([curveArray[i].x4, curveArray[i].y4, 1], T);
        curveArray[i].x4 = result[0];
        curveArray[i].y4 = result[1];
    }
    for (i = 0; i < circleArray.length; i++) {
        result = numeric.dot([circleArray[i].xc, circleArray[i].yc, 1], T);
        circleArray[i].xc = result[0];
        circleArray[i].yc = result[1];
        circleArray[i].r = circleArray[i].r *= scaleSize;
    }
}


//move the boat by receiving the distance in x axis and in y axis
function translateBoat (disX, disY) {
    var T = [[1, 0, 0], [0, 1, 0], [disX, disY, 1]];
    for (var i = 0; i < lineArray.length; i++) {
        var result = numeric.dot([lineArray[i].x1, lineArray[i].y1, 1], T);
        lineArray[i].x1 = result[0];
        lineArray[i].y1 = result[1];
        result = numeric.dot([lineArray[i].x2, lineArray[i].y2, 1], T);
        lineArray[i].x2 = result[0];
        lineArray[i].y2 = result[1];
    }
    for (i = 0; i < curveArray.length; i++) {
        result = numeric.dot([curveArray[i].x1, curveArray[i].y1, 1], T);
        curveArray[i].x1 = result[0];
        curveArray[i].y1 = result[1];
        result = numeric.dot([curveArray[i].x2, curveArray[i].y2, 1], T);
        curveArray[i].x2 = result[0];
        curveArray[i].y2 = result[1];
        result = numeric.dot([curveArray[i].x3, curveArray[i].y3, 1], T);
        curveArray[i].x3 = result[0];
        curveArray[i].y3 = result[1];
        result = numeric.dot([curveArray[i].x4, curveArray[i].y4, 1], T);
        curveArray[i].x4 = result[0];
        curveArray[i].y4 = result[1];
    }
    for (i = 0; i < circleArray.length; i++) {
        result = numeric.dot([circleArray[i].xc, circleArray[i].yc, 1], T);
        circleArray[i].xc = result[0];
        circleArray[i].yc = result[1];
    }
}


function shearx(disX){
    disX /= 1000;
    var minX = getXmin(lineArray, circleArray, curveArray);
    var M = [[1, 0, 0], [disX, 1, 0], [-disX * minX, 0, 1]];
    for (var i = 0; i < lineArray.length; i++) {
        var result = numeric.dot([lineArray[i].x1, lineArray[i].y1, 1], M);
        lineArray[i].x1 = result[0];
        lineArray[i].y1 = result[1];
        result = numeric.dot([lineArray[i].x2, lineArray[i].y2, 1], M);
        lineArray[i].x2 = result[0];
        lineArray[i].y2 = result[1];
    }
    for (i = 0; i < curveArray.length; i++) {
        result = numeric.dot([curveArray[i].x1, curveArray[i].y1, 1], M);
        curveArray[i].x1 = result[0];
        curveArray[i].y1 = result[1];
        result = numeric.dot([curveArray[i].x2, curveArray[i].y2, 1], M);
        curveArray[i].x2 = result[0];
        curveArray[i].y2 = result[1];
        result = numeric.dot([curveArray[i].x3, curveArray[i].y3, 1], M);
        curveArray[i].x3 = result[0];
        curveArray[i].y3 = result[1];
        result = numeric.dot([curveArray[i].x4, curveArray[i].y4, 1], M);
        curveArray[i].x4 = result[0];
        curveArray[i].y4 = result[1];
    }
    for (i = 0; i < circleArray.length; i++) {
        result = numeric.dot([circleArray[i].xc, circleArray[i].yc, 1], M);
        circleArray[i].xc = result[0];
        circleArray[i].yc = result[1];
    }
}

function sheary(disY){
    var minY = getYmin(lineArray,circleArray,curveArray);
    disY /= 1000;
    var M = [[1, disY, 0], [0, 1, 0], [0, -disY * minY, 1]];
    for (var i = 0; i < lineArray.length; i++) {
        var result = numeric.dot([lineArray[i].x1, lineArray[i].y1, 1], M);
        lineArray[i].x1 = result[0];
        lineArray[i].y1 = result[1];
        result = numeric.dot([lineArray[i].x2, lineArray[i].y2, 1], M);
        lineArray[i].x2 = result[0];
        lineArray[i].y2 = result[1];
    }
    for (i = 0; i < curveArray.length; i++) {
        result = numeric.dot([curveArray[i].x1, curveArray[i].y1, 1], M);
        curveArray[i].x1 = result[0];
        curveArray[i].y1 = result[1];
        result = numeric.dot([curveArray[i].x2, curveArray[i].y2, 1], M);
        curveArray[i].x2 = result[0];
        curveArray[i].y2 = result[1];
        result = numeric.dot([curveArray[i].x3, curveArray[i].y3, 1], M);
        curveArray[i].x3 = result[0];
        curveArray[i].y3 = result[1];
        result = numeric.dot([curveArray[i].x4, curveArray[i].y4, 1], M);
        curveArray[i].x4 = result[0];
        curveArray[i].y4 = result[1];
    }
    for (i = 0; i < circleArray.length; i++) {
        result = numeric.dot([circleArray[i].xc, circleArray[i].yc, 1], M);
        circleArray[i].xc = result[0];
        circleArray[i].yc = result[1];
    }
}

function reflactionX(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var height = c.height / 2;
    var M = [[1,0,0], [0,-1,0], [0,2 * height,1]];
    for (var i = 0; i < lineArray.length; i++) {
        var result = numeric.dot([lineArray[i].x1, lineArray[i].y1, 1], M);
        lineArray[i].x1 = result[0];
        lineArray[i].y1 = result[1];
        result = numeric.dot([lineArray[i].x2, lineArray[i].y2, 1], M);
        lineArray[i].x2 = result[0];
        lineArray[i].y2 = result[1];
    }
    for (i = 0; i < curveArray.length; i++) {
        result = numeric.dot([curveArray[i].x1, curveArray[i].y1, 1], M);
        curveArray[i].x1 = result[0];
        curveArray[i].y1 = result[1];
        result = numeric.dot([curveArray[i].x2, curveArray[i].y2, 1], M);
        curveArray[i].x2 = result[0];
        curveArray[i].y2 = result[1];
        result = numeric.dot([curveArray[i].x3, curveArray[i].y3, 1], M);
        curveArray[i].x3 = result[0];
        curveArray[i].y3 = result[1];
        result = numeric.dot([curveArray[i].x4, curveArray[i].y4, 1], M);
        curveArray[i].x4 = result[0];
        curveArray[i].y4 = result[1];
    }
    for (i = 0; i < circleArray.length; i++) {
        result = numeric.dot([circleArray[i].xc, circleArray[i].yc, 1], M);
        circleArray[i].xc = result[0];
        circleArray[i].yc = result[1];
    }
}

function reflactionY(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var width = c.width / 2;
    var M = [[-1,0,0], [0,1,0], [2 * width,0,1]];
    for (var i = 0; i < lineArray.length; i++) {
        var result = numeric.dot([lineArray[i].x1, lineArray[i].y1, 1], M);
        lineArray[i].x1 = result[0];
        lineArray[i].y1 = result[1];
        result = numeric.dot([lineArray[i].x2, lineArray[i].y2, 1], M);
        lineArray[i].x2 = result[0];
        lineArray[i].y2 = result[1];
    }
    for (i = 0; i < curveArray.length; i++) {
        result = numeric.dot([curveArray[i].x1, curveArray[i].y1, 1], M);
        curveArray[i].x1 = result[0];
        curveArray[i].y1 = result[1];
        result = numeric.dot([curveArray[i].x2, curveArray[i].y2, 1], M);
        curveArray[i].x2 = result[0];
        curveArray[i].y2 = result[1];
        result = numeric.dot([curveArray[i].x3, curveArray[i].y3, 1], M);
        curveArray[i].x3 = result[0];
        curveArray[i].y3 = result[1];
        result = numeric.dot([curveArray[i].x4, curveArray[i].y4, 1], M);
        curveArray[i].x4 = result[0];
        curveArray[i].y4 = result[1];
    }
    for (i = 0; i < circleArray.length; i++) {
        result = numeric.dot([circleArray[i].xc, circleArray[i].yc, 1], M);
        circleArray[i].xc = result[0];
        circleArray[i].yc = result[1];
    }
}

function getXmin(lines,circles,curves) {
    var xMin = 9999;
    for (var i=0;i<lines.length;i++) {
        var x1 = lines[i].x1;
        var x2 = lines[i].x2;
        if (x1 <= xMin) {
            xMin = x1;
        }
        else if (x2 <= xMin) {
            xMin = x2
        }
    }
    for (var i=0;i<circles.length;i++) {
        var xc = circles[i].xc;
        if (xc < xMin) {
            xMin = xc;
        }
    }
    for (var i=0;i<curves.length;i++) {
        var x1 = curves[i].x1;
        var x2 = curves[i].x2;
        var x3 = curves[i].x3;
        var x4 = curves[i].x4;
        if (x1 <= xMin) {
            xMin = x1;
        }
        else if (x2 <= xMin) {
            xMin = x2
        }
        else if (x3 <= xMin) {
            xMin = x3;
        }
        else if (x4 <= xMin) {
            xMin = x4
        }
    }
    return xMin;
}

function getYmin(lines,circles,curves) {
    var yMin = 9999;
    for (var i=0;i<lines.length;i++) {
        var y1 = lines[i].y1;
        var y2 = lines[i].y2;
        if (y1 <= yMin) {
            yMin = y1;
        }
        else if (y2 <= yMin) {
            yMin = y2
        }
    }
    for (i=0;i<circles.length;i++) {
        var yc = circles[i].yc;
        if (yc < yMin) {
            yMin = yc;
        }
    }
    for (i=0;i<curves.length;i++) {
        var y1 = curves[i].y1;
        var y2 = curves[i].y2;
        var y3 = curves[i].y3;
        var y4 = curves[i].y4;
        if (y1 <= yMin) {
            yMin = y1;
        }
        else if (y2 <= yMin) {
            yMin = y2
        }
        else if (y3 <= yMin) {
            yMin = y3;
        }
        else if (y4 <= yMin) {
            yMin = y4
        }
    }
    return yMin;
}

function getXmax(lines,circles,curves) {
    var xMax = -9999;
    for (var i=0;i<lines.length;i++) {
        var x1 = lines[i].x1;
        var x2 = lines[i].x2;
        if (x1 >= xMax) {
            xMax = x1;
        }
        else if (x2 >= xMax) {
            xMax = x2
        }
    }
    for (var i=0;i<circles.length;i++) {
        var xc = circles[i].xc;
        if (xc > xMax) {
            xMax = xc;
        }
    }
    for (var i=0;i<curves.length;i++) {
        var x1 = curves[i].x1;
        var x2 = curves[i].x2;
        var x3 = curves[i].x3;
        var x4 = curves[i].x4;
        if (x1 >= xMax) {
            xMax = x1;
        }
        else if (x2 >= xMax) {
            xMax = x2
        }
        else if (x3 >= xMax) {
            xMax = x3;
        }
        else if (x4 >= xMax) {
            xMax = x4
        }
    }
    return xMax;
}

function getYmax(lines,circles,curves) {
    var yMax = -9999;
    for (var i=0;i<lines.length;i++) {
        var y1 = lines[i].y1;
        var y2 = lines[i].y2;
        if (y1 >= yMax) {
            yMax = y1;
        }
        else if (y2 >= yMax) {
            yMax = y2
        }
    }
    for (var i=0;i<circles.length;i++) {
        var yc = circles[i].yc;
        if (yc > yMax) {
            yMax = yc;
        }
    }
    for (var i=0;i<curves.length;i++) {
        var y1 = curves[i].y1;
        var y2 = curves[i].y2;
        var y3 = curves[i].y3;
        var y4 = curves[i].y4;
        if (y1 >= yMax) {
            yMax = y1;
        }
        else if (y2 >= yMax) {
            yMax = y2
        }
        else if (y3 >= yMax) {
            yMax = y3;
        }
        else if (y4 >= yMax) {
            yMax = y4
        }
    }
    return yMax;
}












