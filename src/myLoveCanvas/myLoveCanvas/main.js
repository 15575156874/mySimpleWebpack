window.onload = function () {
  var canvas = document.getElementById('c');
  var context = canvas.getContext('2d');
  var focallength = 250;
  var animateRunning
  class Dot {
    constructor(centerX, centerY, centerZ, radius) {
      var color = 200
      this.dx = centerX; //保存原来的位置
      this.dy = centerY;
      this.dz = centerZ;
      this.tx = 0; //保存粒子聚合后又飞散开的位置
      this.ty = 0;
      this.tz = 0;
      this.z = centerZ;
      this.x = centerX;
      this.y = centerY;
      this.radius = radius;
      this.scale = focallength / (focallength + this.z);
      this.color = `rgba(${color*Math.random()},${color*Math.random()},${color*Math.random()},${this.scale})`
    }
    paint() {
      context.save();
      context.beginPath();

      context.arc(canvas.width / 2 + (this.x - canvas.width / 2) * this.scale, canvas.height / 2 + (this.y - canvas.height / 2) * this.scale, this.radius * this.scale, 0, 2 * Math.PI);
      context.fillStyle = this.color
      context.fill()
      context.restore();
    }
  }
  var dots = getimgData('小哲子')
  var pause = false;
  //计算帧速率
  var acceleration = 0.1
  var lastTime;
  var derection = true;
  initAnimate();

  function initAnimate() {
    dots.forEach(dot => {
      dot.x = Math.random() * canvas.width;
      dot.y = Math.random() * canvas.height;
      dot.z = Math.random() * focallength * 2 - focallength;
      dot.tx = Math.random() * canvas.width;
      dot.ty = Math.random() * canvas.height;
      dot.tz = Math.random() * focallength * 2 - focallength;
      dot.paint();
    });
    animate();
  }

  function getimgData(text) {
    drawText(text);
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    // context.clearRect(0, 0, canvas.width, canvas.height);
    var dots = [];
    for (var x = 0; x < imgData.width; x += 6) {
      for (var y = 0; y < imgData.height; y += 6) {
        var i = (y * imgData.width + x) * 4;
        if (imgData.data[i + 3] >= 128) { //有颜色的像素
          var dot = new Dot(x - 3, y - 3, 0, 3);
          dots.push(dot);
        }
      }
    }
    return dots;
  }

  function drawText(text) {
    context.save()
    context.font = '100px 微软雅黑 bold';
    context.fillStyle = 'rgba(168,168,168,1)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    context.restore();
  }

  function animate() {
    animateRunning = true;
    var thisTime = +new Date();
    context.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(e => {
      var dot = e;
      if (derection) {
        if (Math.abs(dot.dx - dot.x) < 0.1 && Math.abs(dot.dy - dot.y) < 0.1 && Math.abs(dot.dz - dot.z) < 0.1) {
          dot.x = dot.dx;
          dot.y = dot.dy;
          dot.z = dot.dz;
          if (thisTime - lastTime > 300) derection = false;
        } else {
          dot.x = dot.x + (dot.dx - dot.x) * acceleration;
          dot.y = dot.y + (dot.dy - dot.y) * acceleration;
          dot.z = dot.z + (dot.dz - dot.z) * acceleration;
          lastTime = +new Date()
        }

      } else {
        pause = true;
        // if (Math.abs(dot.tx - dot.x) < 0.1 && Math.abs(dot.ty - dot.y) < 0.1 && Math.abs(dot.tz - dot.z) < 0.1) {
        //   dot.x = dot.tx;
        //   dot.y = dot.ty;
        //   dot.z = dot.tz;
        //   pause = true;
        // } else {
        //   dot.x = dot.x + (dot.tx - dot.x) * 0.1;
        //   dot.y = dot.y + (dot.ty - dot.y) * 0.1;
        //   dot.z = dot.z + (dot.tz - dot.z) * 0.1;
        //   pause = false;
        // }
      }
      dot.paint();
    });
    if (!pause) {
      if ('requestAnimationFrame' in window) {
        requestAnimationFrame(animate);
      } else if ('webkitRequestAnimationFrame' in window) {
        webkitRequestAnimationFrame(animate);
      } else if ('msRequestAnimationFrame' in window) {
        msRequestAnimationFrame(animate);
      } else if ('mozRequestAnimationFrame' in window) {
        mozRequestAnimationFrame(animate);
      }
    }
  }
}