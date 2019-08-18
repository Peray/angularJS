/** 
  五角星
  @parma cxt context上下文
  @parma r小圆半径
  @parma R大圆半径
  @parma x横坐标位移
  @parma y纵坐标位移
  @parma rot旋转 
*/
function drawStar(cxt, r, R, x, y, rot){
    cxt.beginPath();
        for(var i = 0; i < 5; i++) {
            cxt.lineTo(Math.cos((18 + i*72 - rot)/180 * Math.PI) * R + x, -Math.sin((18 + i*72 - rot)/180 * Math.PI) * R + y);
            cxt.lineTo(Math.cos((54 + i*72 - rot)/180 * Math.PI) * r + x, -Math.sin((54 + i*72 - rot)/180 * Math.PI) * r + y);
        }
    cxt.closePath();
    cxt.fillStyle = "yellow";
    cxt.strokeStyle = "yellow";
    cxt.fill();
    cxt.stroke();
}

/**矩形*/
function drawRect(cxt, x, y, w, h) {
    cxt.fillStyle = "red";
    cxt.strokeStyle = "red";
    cxt.fillRect(x, y, w, h);
    cxt.strokeRect(x, y, w, h);
}


/** 
  六边形
  @parma cxt context上下文
  @parma r圆半径
  @parma x横坐标位移
  @parma y纵坐标位移
  @parma rot旋转 
*/
function drawSix(cxt, r, x, y, rot){
    cxt.beginPath();
        for(var i = 0; i < 6; i++) {
            cxt.lineTo(Math.cos((60 + i*60 - rot)/180 * Math.PI) * r + x, -Math.sin((60 + i*60 - rot)/180 * Math.PI) * r + y);            
            // cxt.lineTo(Math.cos((54 + i*72 - rot)/180 * Math.PI) * r + x, -Math.sin((54 + i*72 - rot)/180 * Math.PI) * r + y);
        }
    cxt.closePath();
    cxt.fillStyle = "#fff";
    cxt.strokeStyle = "red";
    cxt.fill();
    cxt.stroke();
}

/**星空*/
function starts(cxt, len, canvas){
    var grad = cxt.createRadialGradient(canvas.width/2, canvas.height, 0, canvas.width/2, canvas.height, canvas.height) //创建一个渐变色线性对象
    grad.addColorStop(0,"blue");//定义渐变色颜色         
    grad.addColorStop(1,"black");
    cxt.fillStyle = grad;
    cxt.fillRect(0,0,canvas.width,canvas.height);//和canvas一样大的矩形
    for(var i=0; i<len; i++){
        var R = Math.random() * 1 + 3;//大圆半径10-20
        var x = Math.random() * canvas.width;//x轴偏移量0-width
        var y = Math.random() * canvas.height;//y轴偏移量0-height
        var a = Math.random() * 360;//旋转0-360°
        drawStar(cxt, R/2.0, R, x, y, a);
    }
}