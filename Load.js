const canvas = document.getElementById('ctx')
const ctx = canvas.getContext('2d')
var W = canvas.width, H = canvas.height
ctx.imageSmoothingEnabled = false
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

/*                   global variables                     */

// "canvas"
const drawingArea = {sx:4,sy:4,w:300,h:300,mode:'canvas'}

var current // the current "action" taking place

var lastXY // the last coordinate

var actions = [drawingArea], redos = [], lastImageData

const anchors = [[0,0],[W,0],[0,H],[W.H]]

F = x => (console.log(x), x)

// Img = { pencil: new Image() }
// Img.pencil.src = "\\img\\pencil.png"
// Img.pencil.onload = () => 0//ctx.drawImage(Img.pencil,0,0)

// const drawExample = (x, y) => ctx.drawImage(Img.pencil, x, y - 10, 10, 10);






