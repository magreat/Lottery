const app = getApp();
Page({
  data: {
    canvasWidth:622,//转盘宽度
    canvasHeight:622,//转盘高度
    turnBtnWidth:244,//点击抽奖按钮宽度
    turnBtnHeight:244,//点击抽奖按钮高度
    centerX:0,//canvas圆心位置
    centerY: 0,//canvas圆心位置
    spacing:150,//转盘文字距离圆心的距离
    clickFlag:1,//禁止连续点击开关
    color1: '#FFFFFF',//转盘扇叶背景色1
    color2: '#FFEAB0',////转盘扇叶背景色2
    colorChecked: '#FFBE04',//转动扇叶背景色色3
    prize: 0,//奖品
    speed: 500,//速度
    result:1,//中奖位置
    dataJson: ['刘德华', '张学友', '黎明', '郭富城', '黎明', '郭富城'],//转盘根据dataJson的值自动画扇叶，最好是偶数，单数不美观
  },
  onReady: function (e) {
    var that = this;
    var centerX = this.data.canvasWidth - 80;
    var centerY = this.data.canvasHeight - 80;
    var spacing = this.data.spacing; 
    var turnBtnWidth = this.data.turnBtnWidth;
    var turnBtnHeight = this.data.turnBtnHeight;
    wx.getSystemInfo({
      success:function(res){
        centerX = centerX * res.windowWidth / 750;
        centerY = centerY * res.windowWidth/750;
        spacing = spacing * res.windowWidth / 750;
        turnBtnWidth = turnBtnWidth * res.windowWidth / 750;
        turnBtnHeight = turnBtnHeight * res.windowWidth / 750;
        that.setData({
          centerX: centerX,//适配 让圆心根据不同大小屏幕永远定在正中间
          centerY: centerY,//适配 让圆心根据不同大小屏幕永远定在正中间
          spacing: spacing,//适配 让文字根据不同大小屏幕距离圆心的距离始终固定
          turnBtnWidth: turnBtnWidth,//适配 让按钮大小根据不同大小屏幕呈现不同宽度
          turnBtnHeight: turnBtnHeight//适配 让按钮大小根据不同大小屏幕呈现不同高度
        })
      }
    })
    var dataJson = this.data.dataJson;
    // 抽奖canvas
    var turnBtnWidth = this.data.turnBtnWidth;
    var turnBtnWHeight = this.data.turnBtnWHeight;
    var turnCanvas = wx.createContext();
    turnCanvas.stroke();
    turnCanvas.drawImage('/images/turntableBtn.png', 0, 0, turnBtnWidth, turnBtnWidth)
    wx.drawCanvas({
      canvasId: 'turnBtn',
      actions: turnCanvas.getActions() //获取绘图动作数组
    });
        that.setData({
          dataJson: dataJson
        })
        //使用wx.createContext获取绘图上下文context
        var ctx = wx.createContext();
        var num = dataJson.length;
        for (var i = 0; i < num; i++) {
          // 保存当前状态
          ctx.save();
          // 开始一条新路径
          ctx.beginPath();
          // 位移到圆心，下面需要围绕圆心旋转
          ctx.translate(centerX / 2, centerY / 2);
          // 从(0, 0)坐标开始定义一条新的子路径
          ctx.moveTo(0, 0);
          // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
          ctx.rotate(((360 / num) * i) * Math.PI / 180);
          // 绘制圆弧
          ctx.arc(0, 0, centerX / 2, 0, 2 * Math.PI / num, false);
          if (i % 2 == 0) {
            ctx.setFillStyle(that.data.color1);
          } else {
            ctx.setFillStyle(that.data.color2);
          }
          // 填充扇形
          ctx.fill();
          // 文字
          ctx.setFillStyle('#7D191D');
          ctx.setFontSize(13);
          // ctx.setTextBaseline("middle");
          ctx.rotate(Math.PI / num);
          ctx.fillText(dataJson[i], spacing, 0);
          // 恢复前一个状态
          ctx.restore();
        }
        //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
        wx.drawCanvas({
          canvasId: 'downCanvas',
          actions: ctx.getActions() //获取绘图动作数组
        });
  },
  roll() {
    var that = this;
    var flag = true;
    var centerX = that.data.centerX;
    var centerY = that.data.centerY;
    var spacing = that.data.spacing;
    //防止连续点击
    var clickFlag = that.data.clickFlag;
    //使用wx.createContext获取绘图上下文context
    var ctx = wx.createContext();
    var num = that.data.dataJson.length;
    var dataJson = that.data.dataJson;
    var color1 = that.data.color1;
    var color2 = that.data.color2;
    var colorChecked = that.data.colorChecked;
    var prize = that.data.prize;
    var speed = that.data.speed;
    var times = 0;
    var result;
    var starname;
    function rollDetail() {
      if (prize == 0) {
          times++;
      }
      if (times > 7) {
          speed += 80;
          if (speed >= 180) {
            speed = 180
           }
      } else {
          speed -= 50;
          if (speed <= 50) {
            speed = 50
          }
      }
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(centerX / 2, centerY / 2);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate(((360 / num) * prize) * Math.PI / 180);
      // 绘制圆弧
      ctx.arc(0, 0, centerX / 2, 0, 2 * Math.PI / num, false);
      ctx.setFillStyle(colorChecked);
      // 填充扇形
      ctx.fill();
      // 文字
      ctx.setFillStyle('#7D191D');
      ctx.setFontSize(13);
      // ctx.setTextBaseline("middle");
      ctx.rotate(Math.PI / num);
      ctx.fillText(dataJson[prize], spacing, 0);
      // 恢复前一个状态
      ctx.restore();
      //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
      wx.drawCanvas({
        canvasId: 'upCanvas',
        actions: ctx.getActions() //获取绘图动作数组
      });
      if (flag) {
        setTimeout(rollDetail, speed);
        that.setData({
          prize: prize + 1,
          speed: 500,
        });
      }
      prize++
      if (prize > num - 1) {
        prize = 0
      }
    }
    if (clickFlag) {
      setTimeout(rollDetail, speed);
      that.setData({
        clickFlag: 0
      })
    }
    var result = this.data.result;
    function _times() {
      if (times >= 9) {
        if (prize == result) {
          flag = false;
          clearInterval(stopTimer, 1);
          that.setData({
            clickFlag: 1
          })
          times = 0;
          setTimeout(function () {
            wx.showModal({
              title: '提示',
              content: '恭喜您中了' + result+'等奖',
            })
          }, 700)
         }
      }
    }
    var stopTimer = setInterval(_times, 1)
  },
})