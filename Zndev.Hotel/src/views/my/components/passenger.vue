<template>
	<popup v-model="showPopup"  :show-mask="false" @on-hide="onHide" position="top" class="full-height">
		<div class="nav-header" v-if="isShowHeader">
			<x-header title="常用旅客">
				<div slot="overwrite-left" @click="onHide">
		          	<span class="iconfont icon-xiangzuojiantou"></span>返回
	            </div>
			</x-header>
		</div>
		<div class="main-container" :class="{'top-header-padding':isShowHeader,'top-header-and-tab-padding':!isShowHeader}">
			<div class="content-wrap" v-if="loaded">
				<div class="add-new m-b-m" :class="{'p-a-m':!isAddNew}">
					<div v-if="!isAddNew" @click="isAddNew=true">
						<span class="iconfont icon-add"></span>新增常用旅客
					</div>
					<x-input v-else :should-toast-error=false :min=2 :max=4 is-type="china-name" placeholder="请填写旅客姓名" :required="true" v-model="nameNew">
						<x-button type="primary" mini  slot="right" @click.native="addCheckInPopulation">新增</x-button>
						<div slot="right" class="float-right m-l-s">
			      			<x-button mini  @click.native="isAddNew=false">取消</x-button>
			      		</div>
					</x-input>
				</div>				
				<msg class="empty-tips-msg" v-if="passengers.length==0" title="还没有常用旅客" description="添加后订酒店更加便捷" icon="info"></msg>
				<swipeout class="text-left" v-else>
			      <swipeout-item :disabled="passenger.isEditing" v-for="(passenger,i) in passengers" transition-mode="follow" :key="i">
			        <div slot="right-menu">
			          <swipeout-button @click.native="onEdit(passenger,i)" type="primary">{{passenger.isEditing?'保存':'编辑'}}</swipeout-button>
			          <swipeout-button @click.native="onDelete(passenger,i)" type="warn" v-if="!passenger.isEditing">删除</swipeout-button>
			        </div>
			        <div slot="content" class="vux-1px-b" :class="{'p-a-m':!passenger.isEditing}">
			        	<template v-if="!passenger.isEditing">
			        		{{passenger.name}}
			        		<span class="iconfont icon-huadong1 float-right font20px" v-if="!passenger.isEditing"></span>
		        		</template>
				      	<x-input v-else :should-toast-error=false :min=2 :max=4 is-type="china-name" placeholder="请填写旅客姓名" :required="true" v-model="passenger.name">
				      		<x-button mini type="primary" slot="right" @click.native="onSave(passenger,i)">保存</x-button>
				      		<div slot="right" class="float-right m-l-s">
				      			<x-button mini  @click.native="onCancel(passenger,i)">取消</x-button>
				      		</div>
				      	</x-input>
			        </div>
			      </swipeout-item>
		      	</swipeout>
	      	</div>
        </div>
    </popup>
</template>

<script>
	export default{
		data(){
			return {
				showPopup:this.isShow,
				isAddNew:false,
				nameNew:'',
				loaded:false,
				passengers:[]
			}
		},
		props: {
			isShow: {
				type: Boolean,
				required: true
			},
			isShowHeader:{
				type:Boolean,
				default:true
			}
		},
		created(){
			this.loadList();
		},
		methods: {
			onHide(){
				this.$emit("update:isShow",false);
			},
		    onEdit(passenger,idx) {
		    	this.passengers.splice(idx,1,Object.assign(passenger,{isEditing:true}));
		    },
		    onSave(passenger,idx){
		    	let that=this;
		    	if(passenger.name.length<2){
		    		that.$tips.warn('请正确填写姓名');
		    		return;
		    	}
		    	that.$axios({
		    		url:'/Api.Web/ZnMember/ModifyRenter',
		    		data:passenger
		    	})
		    	.then(res=>{
		    		if(res.data){
		    			that.$tips.done('修改成功');
		    			that.passengers.splice(idx,1,Object.assign(passenger,{isEditing:false}));
		    		}
		    		else{
		    			that.$tips.warn('服务器繁忙，请稍后重试');
		    		}
		    	})
		    	.catch(err=>console.log(err));
		    },
		    onCancel(passenger,idx){
		    	this.passengers.splice(idx,1,Object.assign(passenger,{isEditing:false}));
		    },
		    loadList(){
		    	let that=this;
				that.$axios({
		    		url:'/Api.Web/ZnMember/MyRenter'
		    	})
		    	.then(res=>{
		    		//console.log(res);
		    		that.passengers=res.data;
		    		that.loaded=true;
		    	})
		    	.catch(err=>console.log(err));
		    },
		    addCheckInPopulation(){
		    	let that=this;
				that.$axios({
		    		url:'/Api.Web/ZnMember/AddRenter',
		    		params:{
		    			name:that.nameNew
		    		}
		    	})
		    	.then(res=>{
		    		//console.log(res);
		    		that.passengers.push({tid:res.data,name:that.nameNew,isEditing:false});
		    		that.isAddNew=false;
		    		that.$tips.done('新增成功');
		    	})
		    	.catch(err=>console.log(err));
		    },
		    onDelete(passenger,idx) {
		    	let that=this;
		    	that.$axios({
		    		url:'/Api.Web/ZnMember/DeleteRenter',
		    		params:{
		    			tid:passenger.tid
		    		}
		    	})
		    	.then(res=>{
		    		if(res.data){
		    			that.passengers.splice(idx,1);
		    			that.$tips.done('删除成功');		    			
		    		}
		    		else{
		    			that.$tips.warn('服务器繁忙，请稍后重试');
		    		}
		    	})
		    	.catch(err=>console.log(err));
		    } 
	  	}
	}
</script>
