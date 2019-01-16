(resize = function() {
    Art.canvas.draw()
    let temp = ctx.getImageData(0, 0, W, H)
    ctx.canvas.width = window.innerWidth - 99;
    ctx.canvas.height = window.innerHeight - 99;
    W = canvas.width, H = canvas.height
    ctx.putImageData(temp, 0, 0)

    // $('#br_handle').css({ 
    //     'top': `${H}px`,
    //     'left':`${W}px`
    //  })
    //  $('#bl_handle').css({ 
    //     'top': `${H}px`,
    //     'left':`${0}px`
    //  })
    //  $('#tr_handle').css({ 
    //     'top': `${0}px`,
    //     'left':`${W}px`
    //  })
    //  $('#tl_handle').css({ 
    //     'top': `${0}px`,
    //     'left':`${0}px`
    //  })
})()

window.addEventListener("resize", resize)