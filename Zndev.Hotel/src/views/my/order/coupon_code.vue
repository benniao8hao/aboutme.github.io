<template>
	<popup v-model="showPopup" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container bg-white top-header-padding">
			<div class="nav-header">
				<x-header title="订单凭证">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
				</x-header>
			</div>
			<div class="content-wrap form-group p-a-l">
				 <div class="bold font20px">消费券码</div>
				 <div class="font16px">
				 	{{model.storeName}}
				 </div>
				 <div>
				 	{{model.name}}
				 	<span class="m-l-m">{{model.totalNum}}{{model.unit}}</span>
				 </div>
		    </div>
		    <div class="content-wrap border-top">
		    	<div class="coupon-code">
		    		<div class="code">
		    			{{formatCode(model.couponCode)}}
		    		</div>
		    		<qrcode :size="180" :value="model.scanUrl"></qrcode>
		    		<div class="desc">
		    			请购买后到店消费时出示此券码
		    		</div>
		    	</div>
		    </div>
		   	<div class="content-wrap border-top p-a-l">
		   		<div>
		   			消费券码作为消费凭证，须妥善保管，请勿泄露。
		   		</div>
		   	</div>
		    <copyright class="fixed-bottom"></copyright>
        </div>
	</popup>
</template>
<script> 
	export default{
		data(){
			return {
				showPopup:this.isShow,
				model:{
					storeName:'',
					name:'',
					totalNum:0,
					unit:'',
					couponCode:''
				}
			}
		},
		props: {
			tid:{
				type:Number,
				required: true
			}, 
			isShow: {
				type: Boolean,
				required: true
			}
		},
		methods: {
			formatCode(code){
				let charArr=code.split(''),
					str="";
				for(let i=0;i<charArr.length;i++){
					if(i%4==0)
						str+=" ";
					str+=charArr[i];
				}
				//console.log(str);
				return str;
			},
			onHide(){
				this.$emit("update:isShow",false);
			},
			getItem(){
				let that=this;
				that.$axios({
					url: '/Api.Web/ZnSpecialPriceOrder/CouponCode',
					params:{
						id:that.tid
					}
				}).then(res => {
					that.model=res.data;
					let scanUrl=`${process.env.BASE_API}/ZnAdmin/#/shop/special_price/order/${res.data.couponCode}`;
					Object.assign(that.model,{scanUrl});
					if(that.model.paymentState!=1)
					{
						that.$tips.warn('该订单未付款，请先付款！');
						that.onHide();
					}
				}).catch(err => {
					console.log(err);
				});
			} 
	  	},
	  	created(){
	  		this.getItem();
	  	}
	}
</script>
