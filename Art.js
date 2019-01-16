Art = {}




Art.image = {
    draw:data=>
        ctx.putImageData(data.img,0,0)
}







Art.canvas = {
    draw:_=>{
        // ctx.fillStyle = 'white'
        // const a=3,F=(x,y)=>ctx.fillRect(x,y,a,a)
        // with(drawingArea) {
        //     ctx.fillRect(sx,sy,w,h)
        //     ctx.fillStyle = '#222222'
        //     // corners
        //     F(sx+w,sy+h)
        //     F(sx+w,sy-a)
        //     F(sx+w,sy+h)
        //     F(sx-a,sy+h)
        //     F(sx-a,sy-a)
        //     // edges
        //     F(sx+w/2,sy-a)
        //     F(sx+w/2,sy+h)
        //     F(sx-a,sy+h/2)
        //     F(sx+w,sy+h/2)
        // }
    }
}








Art.oval = {
    draw:(data,solid)=>{
        const [X, Y] = [data.x, data.y]
        ctx.strokeStyle = data.color
        ctx.fillStyle = data.color
        ctx.lineWidth = data.size
        const [x, y] = data.points[0], A = Math.abs
        ctx.beginPath()
        ctx.ellipse(X, Y, A(X - x), A(Y - y), 0, 0, 7)
        if (solid) ctx.fill(); else ctx.stroke()
        return
    }
}
Art.soval = { draw:data => Art.oval.draw(data,true) }





ctx.globalAlpha = 0
ctx.lineWidth = 0.1


Art.rect = {
    draw:(data,solid)=>{
        const [X, Y] = [data.x, data.y]
        ctx.strokeStyle = data.color
        ctx.fillStyle = data.color
        ctx.lineWidth = data.size
        const [x, y] = data.points[0]
        ctx.beginPath()
        ctx.rect(X, Y, x - X, y - Y)
        if (solid) ctx.fill(); else ctx.stroke()
        return
    }
}
Art.srect = { draw:data => Art.rect.draw(data,true) }








Art.line = {
    draw:data=>{
        let [X, Y] = [data.x, data.y]
        ctx.strokeStyle = data.color
        ctx.fillStyle = data.color
        ctx.lineWidth = data.size
        for (let [x, y] of data.points) {
            ctx.beginPath()
            ctx.moveTo(X, Y)
            ctx.lineTo(x, y)
            ctx.stroke()
            X = x; Y = y
        }
    }
}








Art.pencil = {
    draw:Art.line.draw
}








Art.fill = {

    draw:data=>{
        console.log('Attempting to fill')
        const pixelLayer = ctx.getImageData(0, 0, W, H),
            [R, G, B] = hexToRGB(data.color),
            [x, y] = [data.x, data.y],
            startColor = ctx.getImageData(x, y, 1, 1),
            [r, g, b, alpha] = startColor.data,
            stack = [[x, y]]
        if (R === r && G === g && B === b && alpha === 255) { console.log('that color is already there'); return }
        while (stack.length) {
            let x, y, pixelPos, reachLeft, reachRight;
            [x, y] = stack.pop();

            pixelPos = (y * W + x) * 4;
            while (y-- >= 0 && matchStartColor(pixelPos)) pixelPos -= W * 4;
            pixelPos += W * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            while (y++ < H - 1 && matchStartColor(pixelPos)) {
                colorPixel(pixelPos);

                if (x > 0) {
                    if (matchStartColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            stack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    }
                    else if (reachLeft)
                        reachLeft = false;
                }

                if (x < W - 1) {
                    if (matchStartColor(pixelPos + 4)) {
                        if (!reachRight) {
                            stack.push([x + 1, y]);
                            reachRight = true;
                        }
                    }
                    else if (reachRight)
                        reachRight = false;
                }

                pixelPos += W * 4;
            }
        }
        ctx.putImageData(pixelLayer, 0, 0);

        console.log('fill completed')
        return;

        function matchStartColor(pixelPos) {
            return [0, 1, 2, 3].every(i => pixelLayer.data[i + pixelPos] === startColor.data[i])
        }
        function colorPixel(pixelPos) {
            for(let [a,b] of [[0, R],[1, G],[2, B],[3, 255]])
                pixelLayer.data[pixelPos + a] = b
        }
    }
}
function hexToRGB(hex, alpha) {
    const
        r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b, alpha || 0]
}