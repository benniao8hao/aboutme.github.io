<template>
	<popup :is-transparent="true" :show-mask="false" v-model="showPopup" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container">
			<div class="full-width full-height bg-transparent">
				<div class="password-input-box" @click="setFocus">
					<div class="hd">请输入支付密码<span class="iconfont icon-close float-right" @click="onHide"></span></div>
					<div class="p-a-l">
						<div>
							<span class="iconfont icon-rmb">{{money}}</span>
						</div>
						<div class="m-t-s font14px">
							{{title}}
						</div>
					</div>
					<div class="input-box">
						<input type="password" @keyup.delete="onDelete(0)" v-model="password[0]" v-focus maxlength="1" class="password-box-input"/>
						<input type="password" @keyup.delete="onDelete(1)" v-model="password[1]" maxlength="1" class="password-box-input"/>
						<input type="password" @keyup.delete="onDelete(2)" v-model="password[2]" maxlength="1" class="password-box-input"/>
						<input type="password" @keyup.delete="onDelete(3)" v-model="password[3]" maxlength="1" class="password-box-input"/>
						<input type="password" @keyup.delete="onDelete(4)" v-model="password[4]" maxlength="1" class="password-box-input"/>
						<input type="password" @keyup.delete="onDelete(5)" v-model="password[5]" maxlength="1" class="password-box-input" @keyup="submit"/>
					</div>
				</div>
		    </div>
        </div>
        <div v-transfer-dom>
	      <loading :show="isSubmiting" text=""></loading>
	    </div>
	</popup>
</template>
<script> 
	export default{
		data(){
			return {
				showPopup:this.isShow,
				isSubmiting:false,
				password:['','','','','','']
			}
		},
		directives: {
		    // 注册一个局部的自定义指令 v-focus
		    focus: {
		      inserted: function (el) {
		        // 聚焦元素
		        el.focus()
		      }
		    }
		  },
		props: {
			money:{
				type:Number,
				required:true
			},
			title:{
				type:String,
				required: true
			},
			isShow: {
				type: Boolean,
				required: true
			}
		},
		methods: {
			onHide(){
				this.$emit("update:isShow",false);
				this.$emit("onCancelPay")
			},
			setFocus(){
				let inputs = document.getElementsByClassName('password-box-input');
		        for (let i = 0; i < inputs.length; i++){
		        	if (inputs[i].value == ''||i==inputs.length-1)
		        	{ 
	        			inputs[i].focus();
	        			break;
		        	}
		        }
			},
			onDelete(index){
				if(index>0)
					index-=1;
				this.password.splice(index,1,'');
				let inputs = document.getElementsByClassName('password-box-input');
				inputs[index].focus();
			},
			submit(){
				let that=this;
				if(that.isSubmiting)
					return;
				if(that.password[5]!=''){
					let pwd=this.password.join('');
					that.isSubmiting=true;
					//console.log(`提交验证密码${pwd}`);
					that.$axios({
			    		url:'/Api.Web/ZnMember/CheckPassword',
			    		params:{
			    			password:pwd,
			    			type:2
			    		}
			    	})
			    	.then(res=>{
			    		//console.log(res);
			    		that.isSubmiting=false;
			    		if(res.data){
			    			//验证原密码通过后
							that.onHide();
							that.$emit("onValidedPassowrd");
			    		}
			    		else{
			    			that.password=['','','','','',''];
			    			that.$tips.alert('密码错误');
			    		}
			    	})
			    	.catch(err=>console.log(err)); 					
				}
			}
	  	},
	  	mounted(){
	  		let inputs = document.getElementsByClassName('password-box-input');
			this.$nextTick(() => {
	          for (let i = 0; i < inputs.length; i++) {
	            (() => {
	              inputs[i].oninput = () => {
	                if (inputs[i].value !== '') {
	                  if (inputs[i + 1]) {
	                      inputs[i + 1].focus();
	                    }
	                }else{
	                	if (inputs[i - 1]) {
	                      inputs[i - 1].focus();
	                    }
	                }
	              };
	            })(i);
	          };
	        });
	  	}
	}
</script>
