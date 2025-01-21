<template>
<div v-transfer-dom>
      <popup v-model="showFilterPopup" @on-hide="onHide" position="top" class="popup-filter-left">
      	<div class="container popup-filter-top">
	        <div class="content-wrap">
	        	<search
	        		 @result-click="resultClick"
              @on-change="getResult"
			      :results="search.results"
			      v-model="search.keyword"
			      auto-scroll-to-top
			      position="absolute"
			      @on-focus="onFocus"
			      @on-cancel="onCancel"
			      @on-submit="onSearch"
			      placeholder="关键字"
			      ref="search" class="inner-search">
		      </search>
	        	<group :title="conditionGroup.conditionsTitle" v-for="(conditionGroup,i) in conditionGroupsArray" :key="i" v-if="conditionGroup.conditions.length>0">
	        		<ul class="filter-items">
	        			<li v-for="(condition,j) in conditionGroup.conditions" :class="{'selected':condition.selected,'single':conditionGroup.isSingle}" :key="j" @click="changeConditions(condition,i,j)">{{condition.label}}</li>
	        		</ul>
				    </group>
			    	<group :title="sortsTitle">
			    		<ul class="filter-items">
	        			<li v-for="(sort,i) in sorts" :key="i" @click="changeSort(sort)">
	        				{{sort.label}} 
	        				<span class="iconfont" :class="{'icon-shangfan':filters.sort==sort.field&&filters.by=='ASC','icon-xiafan':filters.sort==sort.field&&filters.by=='DESC'}"></span>	        				
	        			</li>
	        		</ul>
				    </group>
				    <div class="bottom-bar">
				    		<flexbox :gutter="0">
				    				<flexbox-item class="reset">
				    					<div @click="onReset">重置</div>
				    				</flexbox-item>
				    				<flexbox-item class="complate">
				    					<div @click="onComplate">完成</div>
				    				</flexbox-item>
		    				</flexbox>
				    </div>
	        </div>
        </div>
      </popup>
    </div>	
</template>

<script>export default {
	data() {
		return {
			filters:{//过滤条件与排序
	  		keyword:'',//关键字
	  		conditions:[],//条件
	  		sort:'',//排序字段
				by:''//升降序
	  	},
			search: {
				results: this.hotKeywords,
				keyword: ''
			},
			conditionGroupsArray:this.conditionsGroups,
			showFilterPopup:this.isShow
		}
	},
	props: {
		isShow: {
			type: Boolean,
			required: true
		},
		hotKeywords:{
			type:Array,
			default:[]
		},
		conditionsGroups:{
			type:Array,
			required: true
		},
		sorts:{
			type:Array,
			required: true
		},
		sortsTitle:{
			type:String,
			default:'排序'
		}
	},
	watch:{
		isShow:function(val){
			this.showFilterPopup=val;
		},
		hotKeywords:function(val){			
			this.search.results=val;
			//console.log(val);
		}
	},
	methods: {
		onHide(){
			this.$emit("update:isShow",false);
		},
		onSubmit(){
			let that=this;
			that.$refs.search.setBlur()
			that.filters.keyword = this.search.keyword;
			that.$emit("onSearch",this.filters);
		},
		onSearch(){
			let that=this;
			that.onSubmit();
			setTimeout(that.onHide,800);
		},
		onFocus() {
			//console.log('on focus')
		},
		onCancel() {
			//console.log('on cancel')
		},
		onReset(){
			let that=this;
			that.filters={ 
	  		keyword:'', 
	  		conditions:[], 
	  		sort:'', 
				by:'' 
	  	};
	  	that.onSubmit();
	  	that.conditionGroupsArray.forEach((conditionGroup,i,a)=>{
		  		conditionGroup.conditions.forEach((e,j,b)=>{
		  			if(e.selected)
		  			{
		  				conditionGroup.conditions.splice(j,1,Object.assign(e,{selected:false}));	  				
	  				}
		  		});
		  		that.conditionGroupsArray.splice(i,1,conditionGroup);
	  	});
	  	setTimeout(that.onHide,500);
		},
		onComplate(){
			let that=this;
			that.onSubmit();
			setTimeout(that.onHide,500);
		},
		resultClick(item) {
			this.search.keyword = item.title;
			this.onSubmit();
		},
		getResult(val) {
			if(val.length > 2) {
				//this.search.results = val ? getResult(this.search.keyword) : []
				this.$emit("getHotKeywordList", val);
			}
		},
		/*
		 * idx:第一维数组的索引
		 * idx1:第二维数组的索引
		 */
		changeConditions(condition,idx,idx1) {
			let that=this,selected=!condition.selected;
			//如果条件组是单选的
			let theConditionGroup=that.conditionGroupsArray[idx];
			if(theConditionGroup.isSingle){//该条件组要求是单选的
				theConditionGroup.conditions.forEach((e,i,a)=>{
						if(e.selected){//全部取消选中
							theConditionGroup.conditions.splice(i,1,Object.assign(e,{selected:false}));
						}
				});
			} 
			theConditionGroup.conditions.splice(idx1,1,Object.assign(condition,{selected}));
			that.conditionGroupsArray.splice(idx,1,theConditionGroup);
			//获取已选择的筛选条件
			let tempConditions=[];
			that.conditionGroupsArray.forEach((group,i,a)=>{
				group.conditions.forEach((c,j,b)=>{
						if(c.selected){
							tempConditions.push(c);
						}
				});
			});
			that.filters=Object.assign(that.filters,{conditions:tempConditions});
			this.onSubmit();
		},
		changeSort(sort){
			if(this.filters.sort==sort.field){
				this.filters.by=this.filters.by=="ASC"?"DESC":"ASC";
			}
			else
				this.filters.by=sort.value;
			this.filters.sort=sort.field;
			this.onSubmit();
		}
	}
}</script>
 