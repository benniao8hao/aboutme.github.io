
//定义一个立即执行的函数
let tickt={
	milliseconds :0,
	interval:null,
	countDonw:function(callback){//开始倒计时
		let that=this;
		that.interval=setInterval(function () {
            var t = null;
            var d = null;
            var h = null;
            var m = null;
            var s = null;
　　　　　　　　 //转化成秒
            t = that.milliseconds  / 1000;
            d = Math.floor(t / (24 * 3600));
            h = Math.floor((t - 24 * 3600 * d) / 3600);
            m = Math.floor((t - 24 * 3600 * d - h * 3600) / 60);
            s = Math.floor((t - 24 * 3600 * d - h * 3600 - m * 60));
            that.milliseconds  -= 1000;
            if (that.milliseconds  < 0)//判断是否到期,到期后自动删除定时器
　　　　　　　　　{
				clearInterval(that.interval);
			}

			//return d + '天' + h + '小时' + m + '分' + s + '秒';
			let obj={
				d,
				h,
				m,
				s,
				stop:that.milliseconds  < 0
			};
			callback(obj);			
        }, 1000);
	}
};
export default tickt;
