$(document).ready(function(){
	var pub = {};
	$.extend(pub,{
		logined : common.getIslogin(),
		method:['user_logout',"user_vipal_msg",'firm_info_update_faceimgurl'],
		issystem:sessionStorage.getItem('system'),
		
	});
	if( pub.logined ){
		pub.firmId = common.user_data().firmInfoid,
		pub.source = "firmId" + pub.firmId;
		pub.sign = md5( pub.source + "key" + common.secretKey() ).toUpperCase();
		pub.tokenId = common.tokenId();
		pub.userBasicParam = {
			source : pub.source,
			sign : pub.sign,
			tokenId : pub.tokenId
		};
		pub.data = common.user_data();
	};
	if(pub.issystem){
		pub.system = JSON.parse(pub.issystem)
	}
	pub.vip = {
		init:function(){
			
		},
		api:function(){
			common.ajaxPost($.extend(pub.userBasicParam,{
				method:pub.method[1],
				firmId:pub.firmId
			}),function(data){
				if (data.statusCode == "100000") {
					
				}else{
					common.prompt(data.statusStr)
				}
			})
		},
		
	}
	pub.vip.eventHeadle = {
		init:function(){
			//点击返回按钮
			$('.header_left').on('click',function(){
				window.history.back();
			});
			$(".vip_main_icon_boxs").on("click","dl",function(){
				common.jump("vip_ticket_center.html");
			})
			$(window).load(function(){
				common.jsadd();
			});
			common.fadeIn();
		}
	}
	
	pub.init = function(){
		pub.vip.init();
		pub.vip.eventHeadle.init();
	}
	pub.init();
})