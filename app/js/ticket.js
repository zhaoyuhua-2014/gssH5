$(document).ready(function(){
	var pub = {};
	$.extend(pub,{
		logined : common.getIslogin(),
		method:['user_logout',"user_ticketal_msg",'firm_info_update_faceimgurl'],
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
	/*
	领券数据结构
	*/
	var moduleData = {
		nav:{
			type:0,
			list:[
				{
					name:'优惠券'
				},{
					name:'商品券'
				},{
					name:'专项类目券'
				}
			],
		},
		couponInfo:{
			name:'VIP特权红包',
			money:'80',
			time:'2018-09-07',
			money1:'899',
			form:'活动',
		}
	};
	
	
	pub.Vue = new Vue({
		el: '#appVue',
		data: {
			vipNav:moduleData.nav,
			
		},
        beforeCreate : function(){
        	
        },
        created : function(){
        	console.log("created			//创建完成")
        },
        beforeMount : function(){
        	console.log("beforeMount		//挂载之前")
        },
        updated : function(){
        	console.log("updated			//数据被更新后")
        	
        },
		methods: {
			
	    }
	});
	pub.ticket = {
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
	pub.ticket.eventHeadle = {
		init:function(){
			//点击返回按钮
			$('.header_left').on('click',function(){
				window.history.back();
			});
			$(window).load(function(){
				common.jsadd();
			});
			common.fadeIn();
		}
	}
	
	pub.init = function(){
		pub.ticket.init();
		pub.ticket.eventHeadle.init();
	}
	pub.init();
})