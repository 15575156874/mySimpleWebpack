
class Dot {
  constructor(centerX, centerY, centerZ, radius) {
    var color = 50
    this.dx = centerX; //保存原来的位置
    this.dy = centerY;
    this.dz = centerZ;
    this.tx = 0; //保存粒子聚合后又飞散开的位置
    this.ty = 0;
    this.tz = 0;
    this.z = centerZ; //初始位置
    this.x = centerX;
    this.y = centerY;
    this.radius = radius; //半径
    this.scale = focallength / (focallength + this.z); //深度，缩放比例
    this.color = `rgba(${color*Math.random()},${color*Math.random()},${color*Math.random()},${this.scale})`
  }
  paint() {
    var x = canvas.width / 2 + (this.x - canvas.width / 2) * this.scale
    var y = canvas.height / 2 + (this.y - canvas.height / 2) * this.scale
    context.save();
    context.beginPath();
    context.arc(
      x,
      y,
      this.radius * this.scale, 0, 2 * Math.PI);
    context.fillStyle = this.color
    context.fill()
    context.restore();
  }
  setCurrent(x,y,z){
    this.x=x
    this.y=y
    this.z=z
  }
}
class GetNextArr {
  constructor(arr) {
    this.arr = arr
    this.index = 0
  }
  getBeforeKey(){
    var res=this.arr[this.index]||''
    return res
  }
  getNext() {
    var res
    if (this.arr.length > this.index) {
      res = this.arr[this.index]
      this.index++
    } else {
      res = this.arr[0]
      this.index = 1
    }
    return res
  }
}
class Derection{
  constructor(lock= true,number=0,length=0){
    this.lock= true
    this.number=0
    this.length=0
  }
  checkLock(){
    if(this.number>this.length*0.5){
      return false
    }else{
      return true 
    }
  }
  setLength(length){
    this.length=length
    this.number=0
  }
  addNumber(){
    this.number++
  }
}
var canvas //canvas对象
var context //2d上下文
var textArr = new GetNextArr([ '讯联', '简单','高效','安全','经济' ])
var dots //每次文字对应的坐标
var acceleration //粒子移动加速度
var derection //判断是否执行动画
var focallength = 250;
var obj = {} //缓存点坐标

function init(text) {
  canvas = document.getElementById('c');
  var width=canvas.style.width.slice(0,-2)
  var height=canvas.style.height.slice(0,-2)
  var max =Math.max(width,height)
  if(max>2000){
    alert('场景太大')
    return
  }
  canvas.width= canvas.height=max
 
  context = canvas.getContext('2d');
  derection=new Derection()
  acceleration = 0.1
  if (obj[text]) { //将获得的坐标缓存下来
    dots = obj[text]
    initAnimate()
    console.log('获得缓存数组')
  } else {
    getimgData(text).then(e=>{
      obj[text]=dots = e
      console.log('获得新数组')
      initAnimate()
    })
  }

}
function getimgData(text) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var length=text.length
  var px = canvas.width/length
  function drawText(text) {
    context.save()
    context.font = `${px}px 微软雅黑 bold`;
    context.fillStyle = 'rgba(168,168,168,1)';
    context.textAlign = 'center';
    //context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    context.restore();
    return new Promise(res=>{
      res()
    })
  }
  return drawText(text).then(e=>{
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    //R红,G绿,B蓝,A透明度，0-255，
    // context.clearRect(0, 0, canvas.width, canvas.height);
    var dots = [];
    var pixel=canvas.width/50
    function getPixel(width){
      if(width<300){
        return 4
      }else if(width<500){
        return 5
      }else if(width<1000){
        return 8
      }else{
        return 15
      }
    }
    var pixel=getPixel(canvas.width)
    for (var x = 0; x < imgData.width; x += pixel) {
      for (var y = 0; y < imgData.height; y += pixel) {
        var i = (y * imgData.width + x) * 4;
        if (imgData.data[i + 3] >= 128) { //有颜色的像素
          var dot = new Dot(x - 3, y - 3, 0, 2);
          dots.push(dot);
        }
      }
    }
    return dots;
  });
}
// 2，绘制动画
function initAnimate() {
  var beforeDots=obj[textArr.getBeforeKey()]
  dots.forEach((dot,index) => {
    if(beforeDots&&beforeDots[index]){
      dot.setCurrent(beforeDots[index].x,beforeDots[index].y,beforeDots[index].z)
    }else{
      dot.x = Math.random() * canvas.width;
      dot.y = Math.random() * canvas.height;
      dot.z = Math.random() * focallength * 2 - focallength;
    }
    dot.paint(context, canvas);
  });
  animate();
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  derection.setLength(dots.length)
  dots.forEach(e => {
    var dot = e;
    if (Math.abs(dot.dx - dot.x) < 0.01 && Math.abs(dot.dy - dot.y) < 0.01 && Math.abs(dot.dz - dot.z) < 0.01) {
      dot.x = dot.dx;
      dot.y = dot.dy;
      dot.z = dot.dz;
      derection.addNumber()
    } else {
      dot.x = dot.x + (dot.dx - dot.x) * acceleration ;
      dot.y = dot.y + (dot.dy - dot.y) * acceleration;
      dot.z = dot.z + (dot.dz - dot.z) * acceleration;
    }
    dot.paint(context, canvas);
  });
  if (derection.checkLock()) {
    if ('requestAnimationFrame' in window) {
      requestAnimationFrame(animate);
    } else if ('webkitRequestAnimationFrame' in window) {
      webkitRequestAnimationFrame(animate);
    } else if ('msRequestAnimationFrame' in window) {
      msRequestAnimationFrame(animate);
    } else if ('mozRequestAnimationFrame' in window) {
      mozRequestAnimationFrame(animate);
    }
  } else {
    setTimeout(e => {
      init(textArr.getNext())
    }, 1000)
  }
}
init(textArr.getNext())