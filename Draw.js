

const getMouse = (e, R = canvas.getBoundingClientRect()) =>
    [parseInt((e.clientX - R.left) / (R.right - R.left) * W), parseInt((e.clientY - R.top) / (R.bottom - R.top) * H)]

// with(drawingArea) mouseInCanvas = (e, [x, y] = getMouse(e)) =>
//     sx <= x && x < sx+w && sy <= y && y < sy+h

mouseInCanvas = (e, [x, y] = getMouse(e)) =>
    0 <= x && x < W && 0 <= y && y < H     
   

const action = (X, Y, S, C, M) => ({ x: X, y: Y, size: S, color: C, mode: M, points: [] })






document.getElementById('undo').onclick = undo
document.getElementById('redo').onclick = redo
document.getElementById('clear').onclick = clear

document.onmousedown = e => {
    if (colorPicker.classList.value === 'jscolor jscolor-active') return; // no actions while color window is open

    if (mouseInCanvas(e)) {
        lastXY = getMouse(e)
        const [x,y] = lastXY
        if (brush.mode === 'getColor') {
            const [r, g, b, a] =  ctx.getImageData(x, y, 1, 1).data
            console.log('rgb',r,g,b)
            const s = `rgb(${r},${g},${b})`
            colorPicker.style.color = colorPicker.style.backgroundColor = s
            colorPicker.value = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
            brush.color = '#' + colorPicker.value
            return;
        }
        // we have just initiated drawing
        lastImageData = ctx.getImageData(0, 0, W, H)
        with (brush)
            current = action(...lastXY.concat(size, color, mode))
    }
}


document.onmousemove = e => {
    const [x, y] = getMouse(e)
    if (mouseInCanvas(e)) {
        with(drawingArea) 
            document.getElementById('coords').value = x + ', ' + y // (x-sx, y-sy)
    } else document.getElementById('coords').value = ''

    if (!current || current.mode === 'fill') return

    // we are still drawing
    if (current.mode === 'pencil') {
        
        ctx.strokeStyle = current.color
        ctx.lineWidth = current.size
        current.points.push([x, y])
        ctx.beginPath()
        ctx.moveTo(...lastXY)
        ctx.lineTo(x, y)
        ctx.stroke()
        lastXY = [x, y]
    }
    if ('line,oval,soval,rect,srect'.includes(current.mode)) {
        ctx.putImageData(lastImageData, 0, 0)
        current.points.push([x, y])
        draw(current)
        current.points.pop()
    }
}


document.onmouseup = e => {
    // drawing is over
    if (current && current.mode === 'fill') draw(current)
    if (current) current.points.push(getMouse(e))
    if (current) actions.push(current)
    current = null
}

function draw(data) { Art[data.mode].draw(data) };

(drawAll = function() { actions.forEach(draw) })()


function undo() {
    // the first element is the "canvas"
    if (actions.length === 1) return
    const x = actions.pop()
    redos.push(x)
    ctx.clearRect(0, 0, W, H)
    drawAll()
}



function redo() {
    if (redos.length === 0) return
    const a = redos.pop()
    actions.push(a)
    draw(a)
};



function clear() {
    ctx.clearRect(0, 0, W, H)
    actions = [drawingArea]
    drawAll()
    redos = []
}



function invert() {
   const imgData = ctx.getImageData(0,0,W,H)
   console.log(imgData)
   const data = imgData.data
   for (var i = 0; i < data.length; i += 4) {
    data[i]     = 255 - data[i];     // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }
  ctx.putImageData(imgData, 0, 0);
  actions.push({mode:'image',img:imgData})
}




function grayscale() {
    const imgData = ctx.getImageData(0,0,W,H)
    console.log(imgData)
    const data = imgData.data
    for (var i = 0; i < data.length; i += 4) {
        avg = (data[i]+data[1]+data[3])/3
     data[i]     = avg
     data[i + 1] = avg
     data[i + 2] = avg
   }
   ctx.putImageData(imgData, 0, 0);
   actions.push({mode:'image',img:imgData})
 }

document.onkeydown = e => 
    e.ctrlKey ?
    e.keyCode === 90 ? undo() :
    e.keyCode === 89 ? redo() :
    e.keyCode === 73 ? invert() :
    e.keyCode === 71 ? e.preventDefault()||grayscale() :
    // todo: i=invert, g=grayscale  (<- those are actions, too)
    0 : 0
