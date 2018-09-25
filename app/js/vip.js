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
	
	var dateModule = {
		system:pub.system,
		vipGradeList:[],
		vipPrivilege:[],
		userVipInfo:{},
	}
	
	
	
	/*
	使用VUe的双向数据绑定
	实现页面的状态管理
	 * */
	pub.Vue = new Vue({
		el: '#appVue',
		data: {
			isWx:false,//是否是微信环境
			
			urlParm:null,//页面URL后面拼接的参数
			
			logined:pub.logined,
			
			isNewMsg:false,
			
			isApp:common.isApp(),
			
			ajaxState:'wait',
			
			system:pub.system,//系统参数
			
			vipGradeList:dateModule.vipGradeList,//vip等级列表
			
			vipPrivilege:dateModule.vipPrivilege,//vip特权列表
			
			userInfo:pub.logined ? common.user_data() : {},//用户信息
			
			userVipInfo:dateModule.userVipInfo,
			
		},
        beforeCreate : function(){
        	
        },
        created : function(){
        	console.log("created			//创建完成")
        	this.isWx = common.isWeiXin();
        	if(pub.issystem){
				pub.system = JSON.parse(pub.issystem);
				console.log(pub.system)
				//this.system = pub.system;
				
			}
        },
        beforeMount : function(){
        	console.log("beforeMount		//挂载之前")
        	
        },
        updated : function(){
        	console.log("updated			//数据被更新后")
        	
        },
        computed: {
		    // 计算属性width
		    getWidth: function () {
		    	if (this.userVipInfo.firmMonthExp >= this.userVipInfo.monthExp ) {
		      		return "690"
		    	}else{
		      		if (this.userVipInfo.firmMonthExp == 0) {
		      			return '0'
			      	}else{			      		
			      		var coefficient = this.userVipInfo.firmMonthExp / this.userVipInfo.monthExp
			      		return (coefficient * 690).toFixed(2); 
			      	}
		      	}
		    },
		    isActive:function(){
		    	var isTrue = false
		    	if (this.vipPrivilege) {
		    		for (var i = 0; i < this.vipPrivilege.length ; i++ ) {
		    			if (this.vipPrivilege[i].state > 1) {
		    				isTrue = true;
		    				break;
		    			}
		    		}	
		    	}
		    	return isTrue;
		    }
		},
        watch : {
        	PageStatus:function(val,oldVal){
        		console.log("val="+val+",oldVal="+oldVal);
        		if (val == 2 && oldVal == 1) {
        			
        		}
        	},
        },
		methods: {
			goBack:function(){
				if (pub.Vue.PageType == 2) {
					pub.maskView.maskMove();
					setTimeout(function(){
						pub.apiHandle.farm_main.init();
					},700)
				}else{
					window.location.href = "../html/my.html"
				}
			},
			goToNext:function(item){
				var jumpUrl = '';
				
				if (this.isApp) {
					
				}else{
					if (item.type == 1 || item.type == 2 || item.type == 3) {
						common.jump("vip_ticket_center.html?type="+item.type);
					}else if (item.type == 4){
						var code = '';
						if (item.linkUrl && item.linkUrl.split("&")[1] && item.linkUrl.split("&")[1].length == 4 ) {
							code = item.linkUrl.split("&")[1];
							common.jump("moreGoods.html?typeCode="+code)
						}else{
							common.jump("moreGoods.html")
						}
						
						
						
					}
				}
			},
			
		}
	});
	
	pub.creatDataModule = {
		init:function(){
			pub.creatDataModule.logined();
			pub.creatDataModule.userInfo();
		},
		logined:function(){
			var isBool = false;
			if (pub.logined) {
				isBool = true;
			}else{
				isBool = false;
			}
			
		},
		userInfo:function(v){
			if (pub.logined) {
				pub.Vue.userInfo = common.user_data();
			}else{
				pub.Vue.userInfo = {};
			}
		},
		system:function(v){
			if (v) {
				pub.Vue.system = v;
			}else{
				pub.Vue.system = pub.system;
			}
			
		},
		//vip等级列表
		vipGradeList:function(v){
			if(v){
				pub.Vue.vipGradeList = v;
			}
		},
		//vip特权列表
		vipPrivilege:function(v){
			if (v) {
				pub.Vue.vipPrivilege = v;
			}
		},
		userVipInfo:function(v){
			if (v) {
				pub.Vue.userVipInfo = v;
			}
		}
	}
	pub.vip = {
		init:function(){
			pub.vip.vip_privilege_list.init();
			pub.vip.vip_grade_show.init();
			pub.vip.firm_vip_info.init();
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
		vip_privilege_list:{
			init:function(){
				common.ajaxPost($.extend(pub.userBasicParam,{
					method:'vip_privilege_list'
				}),function(data){
					if (data.statusCode == "100000") {
						pub.vip.vip_privilege_list.apiData(data);
					}else{
						common.prompt(data.statusStr)
					}
				})
			},
			apiData:function(d){
				var v = d.data;
				pub.creatDataModule.vipPrivilege(v);
			}
		},
		vip_grade_show:{
			init:function(){
				common.ajaxPost($.extend(pub.userBasicParam,{
					method:'vip_grade_show'
				}),function(data){
					if (data.statusCode == "100000") {
						pub.vip.vip_grade_show.apiData(data);
					}else{
						common.prompt(data.statusStr)
					}
				})
			},
			apiData:function(d){
				var v = d.data;
				pub.creatDataModule.vipGradeList(v);
			}
		},
		firm_vip_info:{
			init:function(){
				common.ajaxPost({
					method:'firm_vip_info',
					firmId:pub.firmId
				},function(data){
					if (data.statusCode=='100000') {
						pub.vip.firm_vip_info.apiData(data)
					}else{
						common.prompt(data.statusStr)
					}
				})
			},
			apiData:function(v){
				var v = v.data;
				pub.creatDataModule.userVipInfo(v)
			}
		}
	}
	pub.vip.eventHeadle = {
		init:function(){
			//点击返回按钮
			$('.header_left').on('click',function(){
				window.history.back();
			});
			/*$(".vip_main_icon_boxs").on("click","dl",function(){
				common.jump("vip_ticket_center.html");
			})*/
			$(window).load(function(){
				common.jsadd();
			});
			common.fadeIn();
		}
	}
	
	pub.init = function(){
		if(!pub.issystem){
			common.dtd.done(function(){
				pub.system = JSON.parse(sessionStorage.getItem("system"));
				pub.creatDataModule.system(pub.system)
				pub.vip.init();
			})
			common.get_System(common.websiteNode);
		}else{
			pub.vip.init();
		}
		
		pub.vip.eventHeadle.init();
		if (common.isApp()) {
			$(".header-wrap,.empty").addClass("hidden")
		}
		
	}
	pub.init();
})