
class Dot {
  constructor(centerX, centerY, centerZ, radius,color=`rgba(${50*Math.random()},${50*Math.random()},${50*Math.random()},1`) {
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
    this.color = color
  }
  paint(isImg) {
    var x = canvas.width / 2 + (this.x - canvas.width / 2) * this.scale
    var y = canvas.height / 2 + (this.y - canvas.height / 2) * this.scale
    context.save();
    context.beginPath();
    // if(isImg){
    //   var a =this.radius * this.scale
    //   context.fillRect(x,y,a,a);
    // }else{
    context.arc(
      x,
      y,
      this.radius * this.scale, 0, 2 * Math.PI);
    // }
    
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
    this.img=false
    this.period=1
  }
  getBeforeKey(){
    var res=this.arr[this.index]||''
    return res
  }
  getImg(){
    return this.img
  }
  getPeriod(){
    return this.period
  }
  getNext() {
    var res
    if (this.arr.length > this.index) {
      res = this.arr[this.index].t
      this.img=this.arr[this.index].img 
      this.index++
      if(this.arr.length == this.index){
        this.period++
      }
    } else {
      res = this.arr[0].t
      this.img=this.arr[0].img
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
var textArr = new GetNextArr([ {t: '讯联',img: false}, {t: '../other1.jpeg',img: true}, {t: '../other2.jpeg',img: true}, {t: '../qiang1.jpeg',img: true}, {t: '../qiang2.jpeg',img: true} ])
// var textArr = new GetNextArr([ {t: '讯联',img: false}, {t: '大佬',img: false} ,{t: '于方浦',img: false} ,{t: '../fangpu.jpg',img: true} ])
var dots //每次文字对应的坐标
var acceleration //粒子移动加速度
var derection //判断是否执行动画
var focallength = 250;
var obj = {} //缓存点坐标
var time=new Date().getTime()
function init(text,img=false) {
  console.log('开始时间',time)
  var cTime=new Date().getTime()
  canvas = document.getElementById('c');
  var width=canvas.style.width.slice(0,-2)
  var height=canvas.style.height.slice(0,-2)
  var max =Math.max(width,height)
  canvas.width= canvas.height=max
  context = canvas.getContext('2d');
  derection=new Derection()
  acceleration = 0.25
  if(max>2000){
    alert('场景太大')
    return
  }
  if (obj[text]) { //将获得的坐标缓存下来
    dots = obj[text]
    initAnimate(img)
  } else {
    getimgData(text,img).then(e=>{
      obj[text]=dots = e
      initAnimate()
    })
  }

}
function getimgData(text,img=false) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var length=text.length
  var px = canvas.width/length
  function drawText(text) {
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
  function getPosition(img=false){
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    // context.clearRect(0, 0, canvas.width, canvas.height);
    var dots = [];
    var pixel=canvas.width/50
    function getPixel(width){
      if(width<300){
        return 4
      }else if(width<500){
        return 5
      }else if(width<1000){
        return 3
      }else{
        return 15
      }
    }
    
    var pixel=img?3:getPixel(canvas.width)
    for (var x = 0; x < imgData.width; x += pixel) {
      for (var y = 0; y < imgData.height; y += pixel) {
        var i = (y * imgData.width + x) * 4; //R红,G绿,B蓝,A透明度，0-255，
        var r=imgData.data[i]
        var g=imgData.data[i+1]
        var b=imgData.data[i+2]
        var a=imgData.data[i+3]
        var grid={ //弧度系数
          r: 0.299,
          g: 0.587,
          b: 0.114
        }
        if (imgData.data[i + 3] >= 128) { //有颜色的像素
          var dot = new Dot(x, y, 0, pixel/2.5,`rgba(${r},${g},${b},${a}`);
          dots.push(dot);
        }
      }
    }
    return dots;
  }
  if(!img){
    return drawText(text,img=false).then(e=>{
      return getPosition()
    })
  } else{
    var eleImg= document.createElement('img')
    eleImg.src=text
    return new Promise(res=>{
      eleImg.onload=function(){
        context.save()
        var imgScale=eleImg.height/eleImg.width
        var x=canvas.width / 4
        var y=canvas.height / 4
        var imgW=canvas.width / 2
        var imgH=imgScale*imgW
        context.drawImage(eleImg,x,y,imgW,imgH)
        context.restore(); 
        res(getPosition(true))
      }
    })
  }
}
function initAnimate(isImg) {
  var beforeDots=obj[textArr.getBeforeKey()]
  dots.forEach((dot,index) => {
    if(beforeDots&&beforeDots[index]){
      dot.setCurrent(beforeDots[index].x,beforeDots[index].y,beforeDots[index].z)
    }else{
      dot.x = Math.random() * canvas.width;
      dot.y = Math.random() * canvas.height;
      dot.z = Math.random() * focallength * 2 - focallength;
    }
    // dot.x = 0;
    // dot.y = 0;
    // dot.z = Math.random() * focallength * 2 - focallength;
    dot.paint(isImg);
  });
  animate(isImg);
}
function animate(isImg) {
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  derection.setLength(dots.length)
  dots.forEach(e => {
    var dot = e;
    if (Math.abs(dot.dx - dot.x) < 0.5 && Math.abs(dot.dy - dot.y) < 0.5 && Math.abs(dot.dz - dot.z) < 0.5) {
      dot.x = dot.dx;
      dot.y = dot.dy;
      dot.z = dot.dz;
      derection.addNumber()
    } else {
      dot.x = dot.x + (dot.dx - dot.x) * acceleration*1.1;
      dot.y = dot.y + (dot.dy - dot.y) * acceleration*0.5;
      dot.z = dot.z + (dot.dz - dot.z) * acceleration;
    }
    dot.paint(isImg);
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
    if(textArr.getPeriod()==1){
      // setTimeout(e => {
      //   init(textArr.getNext(),textArr.getImg())
      // }, 500)
    }
    console.log('结束时间',new Date().getTime()- time)
    setTimeout(e => {
      init(textArr.getNext(),textArr.getImg())
    }, 2500)
  }
}
init(textArr.getNext(),textArr.getImg())