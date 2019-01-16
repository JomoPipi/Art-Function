const addBrush = name => 
    document.getElementById(name).onclick = () => 
        brush.mode = name

const brush = {
    size: 5,
    color: '#007700',
    x: 1e5,
    y: 1e5,
    mode: 'fill'
}
for (m of ['oval', 'line', 'pencil', 'fill', 'getColor','soval','rect','srect']) addBrush(m)

const colorPicker = document.getElementById('color')
colorPicker.onchange = function(){ brush.color = '#' + this.jscolor }

document.getElementById('size').onmousemove = function(){ brush.size = +(this.value) }

