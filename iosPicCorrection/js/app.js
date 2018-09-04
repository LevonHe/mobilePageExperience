$(function(){
	var mobileType = GetMobileType(); //手机类型
	var input = $("#input")[0]; //上传图片的input标签
	var Orientation; //用户上传图片自带的方向参数
	var oPic = $("#oPic")[0]; //源图片
	var cPic = $("#cPic")[0]; //矫正后的图片
	var basePicSrc = ""; //处理后图片的base64地址，初始化为空字符串
	
	if(mobileType == 'iOS'){
		$("input[type='file']").removeAttr("capture");
		$("input[type='file']").removeAttr("multiple");
	}
	
	input.onchange = function(){
		var file = this.files[0];
		var reader = new FileReader();
		var image = new Image();
		
		EXIF.getData(file, function(){
			//EXIF.getAllTags(this);
			Orientation = EXIF.getTag(this, "Orientation"); //得到方向参数
			console.log(Orientation);
		});
		
		reader.readAsDataURL(file);
		reader.onload = function(e){
			var data = e.target.result;
			oPic.src = data;
			image.src = data;
			image.onload = function(){
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				var w = image.naturalWidth;
				var h = image.naturalHeight;
				//iOS系统拍照的图片自带方向参数Orientation
				if(Orientation == 6){  //0度  竖拍时,Orientation=6,需要  顺时针旋转90度  纠正
            		canvas.width = h;
            		canvas.height = w;
            		ctx.save();
            		ctx.translate(h,0);
            		ctx.rotate(90*Math.PI/180);
           		}else if(Orientation == 8){  //180度  竖拍时,Orientation=8,需要  逆时针旋转90度  纠正
            		canvas.width = h;
            		canvas.height = w;
            		ctx.save();
            		ctx.translate(0,w);
            		ctx.rotate(270*Math.PI/180);
            	}else if(Orientation == 3){  // 顺时针  90度  横拍时,Orientation=3,需要旋转  180度  纠正
            		canvas.width = w;
            		canvas.height = h;
            		ctx.save();
            		ctx.translate(w,h);
            		ctx.rotate(180*Math.PI/180);
            	}else{  //逆时针-90度  横拍时,Orientation=1,无需纠正
            		canvas.width = w;
            		canvas.height = h;
            	}
            	ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);
            	basePicSrc = canvas.toDataURL("image/jpg");
            	cPic.src = basePicSrc;
			}
		}
	};
});

//手机端类型
function GetMobileType(){
	var u = navigator.userAgent.toLowerCase();
	var type;
	if(u.indexOf('android') != -1 || u.indexOf('linux') != -1){
		type = 'Android';
	}else if(u.indexOf('iphone') != -1 || u.indexOf('ipad') != -1){
		type = 'iOS';
	}else if(u.indexOf('windows phone') != -1){
		type = 'WP';
	}
	return type;
}

