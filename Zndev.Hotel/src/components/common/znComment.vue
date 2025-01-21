<template>
	<popup :show-mask="false" v-model="showPopup" @on-hide="onHide" position="top" class="full-height">
		<div class="main-container top-header-padding">
			<div class="nav-header">
				<x-header :title="commentType==1?'发表评价':'发表追评'">
					<div slot="overwrite-left" @click="onHide">
			          	<span class="iconfont icon-xiangzuojiantou"></span>返回
		            </div>
					<div slot="right" @click="submit">
						提交
						<span class="iconfont icon-check"></span>
					</div>
				</x-header>
			</div>
			<div class="content-wrap">
				<div class="comment-item" v-for="(item,index) in productsOfComment" :key="index">
					<flexbox class="product">
						<flexbox-item :span="3" class="img">
							<img :src="item.image"/>
						</flexbox-item>
						<flexbox-item class="name">
							{{item.name}}
						</flexbox-item>
					</flexbox>
					<div class="comment">
						<div class="stars" v-if="commentType==1">
							评分
							<div>							
								<img :src="n>item.stars?'http://web-img.0898so.com/star-0.png':'http://web-img.0898so.com/star-1.png'" v-for="n in 5" :key="`star_${index}_${n}`" @click="item.stars=n"/>
								<span v-if="item.stars>0">{{item.stars}}分</span>
							</div>
						</div>
						<div class="comment-content">
							<x-textarea v-model="item.commentContent" :max="255" placeholder="请填写评价内容" :show-counter="true" :rows="3" :cols="30" :required="true"></x-textarea>
						</div>
						<div class="weui-uploader">
				            <div class="weui-uploader__bd">
				              <ul class="weui-uploader__files" v-if="item.commentImages.length>0">
				                <li class="weui-uploader__file" v-for="(img,idx) in item.commentImages" :key="`img_${index}_${idx}`">
				                  <div class="weui-uploader__file-content">
				                  	<span class="iconfont icon-close_light" @click="removeImage(index,idx)"></span>  	
		                    		<img :src="img.base64Data"/>
				                  </div>
				                </li>
				              </ul>
				              <div class="weui-uploader__input-box" v-if="item.commentImages.length<allowUploadCount">
				                <input class="weui-uploader__input" :ref="`commentFileUpload${index}`" type="file" @change="referenceUpload(index)" accept="image/gif,image/jpeg,image/png,image/jpg" multiple="true">
			                	<span class="iconfont icon-zhaoxiangji"></span>
			                	<b>{{item.commentImages.length}}/{{allowUploadCount}}</b>
				              </div>
				            </div>
			          	</div>
					</div>
				</div>
		    </div>
        </div>
	</popup>
</template>
<script> 
	export default{
		data(){
			return {
				loadingTips:null,  
				productsOfComment:[],
				allowUploadCount:5,
				maxSize:4,//最大允许上传几M的图片
				showPopup:this.isShow,
				isSubmiting:false
			}
		},
		props: {
			storeId:{
				type:Number,
				required: true
			},
			orderId:{
				type:Number,
				required: true
			},
			commentType:{
				type:Number,
				required: true
			},
			orderType:{
				type:Number,
				required:true
			},
			products:{
				type:Array,
				required:true
			},
			isShow: {
				type: Boolean,
				required: true
			}
		},
		methods: {
			referenceUpload(index) {
				let that=this;
				//console.log(that.$refs[`commentFileUpload${index}`]);
				let files=that.$refs[`commentFileUpload${index}`][0].files;
				if(files.length==0)
					return;
				that.genarateImg(files,index);
		    },
		    genarateImg(files,index){
		    	let that=this;
		    	let theItem=that.productsOfComment[index];
		    	if(theItem.commentImages.length>=that.allowUploadCount)
		    	{
		    		return;
		    	}
		    	if(typeof FileReader==='undefined'){
                    that.$tips.warn('您的浏览器不支持图片上传，请升级您的浏览器');
                    return false;
                }
		    	for(let i=0;i<files.length;i++){
		    		let fileType=files[i].type,
		    			fileSize=files[i].size/1024/1024;//b换成mb
		    		if(!/image\/((gif)|(jpeg)|(png)|(jpg))/.test(fileType)){  
					    that.$tips.warn(`${files[i].name}格式有误,请上传jpe|jpeg|gif|png格式的图片`,1000*8);
					    return;
					}
                    if(fileSize>that.maxSize){
                    	that.$tips.warn(`${files[i].name}过大,请选择小于4M的图片`,1000*4);
                    	return;
                    }
                } 
                for(let i=0;i<files.length;i++){
                	let imageType=files[i].type,
                		name=files[i].name,
                		size=files[i].size;
                    let reader = new FileReader();
                    reader.readAsDataURL(files[i]);
                    reader.onload =function(e){
                	  if(theItem.commentImages.length<that.allowUploadCount)
                      	theItem.commentImages.push({base64Data:e.target.result,name,imageType,size});  
                    };                 
                }  
                that.productsOfComment.splice(index,1,theItem);
                //console.log(that.productsOfComment)
		    },
		    removeImage(index,idx){
		    	let that=this;
		    	that.$tips.confirm({
					content:'要删除该图片吗？',
					onConfirm:function(){
						let theItem=that.productsOfComment[index];
				    	theItem.commentImages.splice(idx,1);
				    	that.productsOfComment.splice(index,1,theItem);
					}
				});
		    },
			onHide(){
				let that=this,
					hasChange=false;
				for(let i=0;i<that.productsOfComment.length;i++){
					let item=that.productsOfComment[i];
					if(item.commentContent||item.starts<5||item.commentImages.length>0){
						hasChange=true;
						break;
					}
				}
				if(hasChange){
					that.$tips.confirm({
						content:'编辑评价尚未提交，要放弃提交吗？',
						onConfirm:function(){
							that.$emit("update:isShow",false);
						},
						onCancel(){
							return;
						}
					});
				}
				else
					that.$emit("update:isShow",false);
			},
			init(){
				let that=this;
				that.productsOfComment=[];
				that.products.forEach((e,i,a)=>{
					let product={
						name:e.name,
						image:e.image,
						stars:0,
						commentType:that.commentType,
						commentContent:'',
						commentImages:[] 
					};
					if(that.orderType==12){//ZnProduct表的订单
						Object.assign(product,{
							id:e.id,//商品
							orderSubId:e.orderSubId//订单子项ID
						});
					}
					that.productsOfComment.push(product);
				});
				//console.log(that.productsOfComment)
			},
			_hideLoading(){
				if (this.loadingTips)
				{
					window.clearTimeout(this.loadingTips)
					this.$store.dispatch('app/updateLoadingStatus', { isLoading: false });
				}
			},
			submit(){
				if(this.isSubmiting)
					return;
				let that=this,
					commitModel={
						commentType:that.commentType,
						orderId:that.orderId,
						storeId:that.storeId,
						orderType:that.orderType,
						comments:[]
					};
				for(let i=0;i<that.productsOfComment.length;i++){
					let item=that.productsOfComment[i];
					if(item.stars==0&&item.commentType==1){
						that.$tips.warn(`请给商品${item.name}评分`);
                    	return false;
					}
					if(!item.commentContent){
						that.$tips.warn(`请给商品${item.name}填写评价`);
                    	return false;
					}
					let commitModelItem={
							stars:item.stars,
							commentContent:item.commentContent,
							commentImages:item.commentImages
					};
					if(that.orderType==12)//ZnProduct表的订单
					{
						Object.assign(commitModelItem,
							{
								orderSubId:item.orderSubId,
								productId:item.id,
							}
						);
					}
					commitModel.comments.push(commitModelItem);
				}
				//console.log(this.productsOfComment);
				//console.log(commitModel)
				let urlAction=that.orderType==11?"CommentHotel":that.orderType==12?"CommentProduct":"";
				if(urlAction=="")
				{
					that.$tips.warn('无效的orderType',1000*10);
					return;
				}
				that.isSubmiting=true;
				that.loadingTips = window.setTimeout(() => {
			       that.$store.dispatch('app/updateLoadingStatus', { isLoading: true })
			    }, 1000 * 2);
				that.$axios({
					//baseURL:'http://localhost:1477',
					url:`/Api.Web/ZnComment/${urlAction}`,
					data:commitModel
				}).then(res=>{
					//console.log(res);
					that.$tips.done('评价成功',function(){
						that.$router.push({
							name:'my',
							params:that.$storeGetter.getOrg().groupAccount
						});
						that.isSubmiting=false;
						that._hideLoading();
						that.$emit("onCommentSuccess");
					});
				}).catch(err=>{
					that.isSubmiting=false;
					that._hideLoading();
					console.log(err);
				});
			}
	  	},
	  	created(){
	  		this.init();
	  	}
	}
</script>
