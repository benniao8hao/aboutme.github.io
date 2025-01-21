<template>
	<div>
		<loading v-model="isLoading"  text="loading"></loading>
		<div class="main-container" ref="scrollBox">
			<div class="content-wrap top-padding-filter-bar">
				<div class="nav-header">
					<x-header>
						<div slot="overwrite-left" @click="loadTagsForConditions">
				          	<span class="iconfont icon-filter"></span>筛选
				          	<badge v-if="isFilter"></badge>
				          </div>
					 	组队拼团
					</x-header>
				</div>
				<msg class="empty-tips-msg" v-if="products.length==0" title="暂无相应的团购活动" description="我们将为您推出更为优惠的活动，敬请期待！" icon="info"></msg>
				<template v-else>
				<product-list v-if="!isLoading" class="full-layout">
					<div slot="header" class="title">
						{{!isFilter?'全部':'筛选结果'}}
					</div>
					<!--<div slot="footer">加载更多</div>-->
					<div class="product" v-for="p in products">
						<div class="img-bd">
							<img @click.prevent="viewDetail(p.tid)" v-lazy="p.snapShot"  :key="p.snapShot" :alt="p.Name">
							<div :class="'type '+'type-'+p.category">
								{{p.categoryLabel}}
							</div>
							<div class="time">
								<span class="iconfont icon-naozhong"></span>
								<strong>{{p.beginTime}}	至	{{p.endTime}}</strong>
							</div>
						</div>
						<div class="tags">
							<span class="iconfont icon-roundcheck" v-for="(tag,x) in p.tags" :key="x">{{tag}}</span>
							<!--<span class="iconfont icon-hot3">热销</span>
							<span class="iconfont icon-jingxuan">精品</span>
							<span class="iconfont icon-zan1">推荐</span>-->
							<span class="iconfont icon-roundcheck" v-if="p.flagReturn">返现</span>
						</div>
						<div>{{p.name}}</div>
						<div class="price">
							<div class="p">
								¥<strong>{{p.priceNow}}</strong> 
							</div>
							<div class="tuan">
								{{p.grouponNum}}人起拼，已拼{{p.bookedNum}}人
							</div>
							<div class="go" @click="viewDetail(p.tid)">
								去拼团<span class="iconfont icon-xiangyoujiantou"></span>
							</div>
						</div>
					</div>				
				</product-list> 
				</template>
			</div>
			<copyright v-if="!isLoading" :class="{'bottom-bar-padding':1==1,'fixed-bottom':products.length<2}"></copyright>
		</div>
		<popup-filter 
		      	@getHotKeywordList="getHotKeywordList"
		      	:hotKeywords="hotKeywords"
		      	:isShow.sync="showFilterPopup"
		      	@onSearch="onSearch"
		      	:conditionsGroups="conditionsGroups"
		      	:sorts="sorts"
      	></popup-filter>	
		<navbar></navbar>
	</div>
</template>

<script>
	import VueSticky from 'vue-sticky' 
	import {categories} from '@/utils/const.js'
	
	export default {
		directives: {
			'sticky': VueSticky,
		},
		components: {
			productList:()=>import(/* webpackChunkName: "discounts" */'@/components/common/productList.vue'),
			popupFilter:()=>import(/* webpackChunkName: "productCommon" */"@/components/common/popupFilterTop.vue")
		},
		watch:{
			filters:{// 深度 watcher
				handler:function(val,oldVal){
					//console.log(val);
					//console.log(oldVal);
					this.loadProducts();
				},
				deep: true
			}
		},
		data() {
			return {
				showFilterPopup:false,
				curTabType: 1,
				isNoData:false,//是否是未上数据
				isLoading:true,//是否正在加载
				products: [],
				currentVisitStoreId:this.storeId,
				//搜索相关 开始
		      	isFilter:false,//是否已经过滤-决定是否显示小圆点图标
		      	filters:{//过滤条件与排序
		      		keyword:'',//关键字
		      		conditions:[],//条件
		      		sort:'',//排序字段
					by:''//升降序
		      	},
				hotKeywords:[],//搜索推荐关键字
				conditionsGroups:[//过滤条件
					{
						conditionsTitle:'分类',
						isSingle:true,//该条件是单选的
						conditions:[
							{
								label:'客房',
								field:'Category',
								symbol:'=',
								value:1
							},
							{
								label:'餐饮',
								field:'Category',
								symbol:'=',
								value:2
							},
							{
								label:'商品',
								field:'Category',
								symbol:'=',
								value:3
							},
							{
								label:'门票',
								field:'Category',
								symbol:'=',
								value:4
							},
							{
								label:'特产',
								field:'Category',
								symbol:'=',
								value:5
							}
						]
					}
				],
				sorts:[//排序字段
					{
						label:'价格',
						field:'PriceNow',
						value:'ASC'
					},
					{
						label:'上架时间',
						field:'InsertTime',
						value:'ASC'
					},
					{
						label:'开始时间',
						field:'BeginTime',
						value:'ASC'
					},
					{
						label:'过期时间',
						field:'OverTime',
						value:'ASC'
					} 
				]
				//搜索相关 结束
			}
		},
		props:{
			groupAccount:{
				type:String,
				required:true
			},
			storeId:{
				//type:Number,
				default:0
			}
		},
		computed:{
			emptyTips:function(){
				if(this.isFilter){
					return '没有符合筛选条件的团购';
				}
				if(this.isNoData){
					return '暂无团购，敬请期待';
				}
				return '';
			}
		},
		methods: {
			viewDetail(id){
		    	let that=this;
		    	that.$router.push({
		    		name:'groupbuy_detail',
		    		params:{
		    			groupAccount:that.groupAccount,
		    			storeId:that.currentVisitStoreId,
		    			id:id
		    		}
		    	})
		   },
		   loadTagsForConditions(){
				let that=this;
				if(that.conditionsGroups.length>1){
					that.showFilterPopup = true;
					return;
				}
				that.$axios({
					url: '/Api.Web/ZnTags/HotTags',
					params: {
						storeId: that.currentVisitStoreId,
						count: 6,
						isGroupon:0
					}
				}).then(res => {
					let tags = res.data;
					let conditionsGroup={
						conditionsTitle:'标签',
						conditions:[]						
					};
					tags.forEach((tag,i,a)=>{
						conditionsGroup.conditions.push(
							{
								label:tag.tagName,
								field:'Tags',
								symbol:'like',
								value:tag.tagName
							}
						);
					});
					that.conditionsGroups.push(conditionsGroup);
					that.showFilterPopup = true;
				}).catch(err => {
					console.log(err);
				})
			},
			onSearch(filters){
		   		//console.log(filters);
		   		if(filters.conditions.length>0||filters.keyword!=''||filters.sort!=''){
		   			this.isFilter=true;
		   		}
		   		else{
		   			this.isFilter=false;
		   		}
		   		this.filters=filters;
		    },
			getHotKeywordList(keyword){
	  	 		let rs = []
				  for (let i = 0; i < 20; i++) {
				    rs.push({
				      title: ` ${keyword}${i + 1} `,
				      other: i
				    })
				  }
				  this.hotKeywords=rs;
		  	},
		  	formatCategory(category){
		    	let ct= categories.find(c=>c.value==category);
		    	if(ct)
		    		return ct.label;
	    		return '未知';
		    },
		    loadProducts(){
		    	let that=this;
				let conditions=that.filters.conditions.concat([]);
				that.isFilter=conditions.length>0||that.filters.keyword!='';
				if(that.filters.keyword!=''){
					conditions.push({
						field:'Name',
						symbol:'like',
						value:that.filters.keyword
					});
				}
				conditions.push({
					field:'isGroupon',
					symbol:'=',
					value:1
				});
				let orderBy=that.filters.sort==''?"BeginTime ASC,Tid Desc":that.filters.sort+' '+that.filters.by;
				that.isLoading=true;
				that.$axios({
					url:'/Api.Web/ZnSpecialPriceProduct/ProductsList',
					data:{
						timeType:1,
						storeId:that.currentVisitStoreId,
						conditions,
						orderBy
					}
				})
				.then(res=>{
					that.products=[];						
					let products=res.data;
					that.isNoData=products.length==0;
					if(products.length>0){
						products.forEach((e,i,a)=>{
							that.products.push(Object.assign(e,{
								categoryLabel:that.formatCategory(e.category),
								tags:e.tags.split(',')
							})
							);
						});
					}
					setTimeout(function(){that.isLoading=false;},500)
					//that.isLoading=false;
				})
				.catch(err=>console.log(err));
		    }
		},
		created() {
			let that=this;
			that.$storeGetter.getStores(that.groupAccount,that.currentVisitStoreId,false).then(defaultStore=>{
				//console.log(defaultStore);
				if(that.currentVisitStoreId==0){
					that.currentVisitStoreId=defaultStore.storeId;
				}
				that.loadProducts();
			})
			.catch(err=>{
				console.log(err);
			});
		},
		mounted() {
			document.title='组队拼团';
		}
	}
	 
</script>