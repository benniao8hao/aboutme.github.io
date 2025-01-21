<template>
	<div>
		<div class="filter-bar" v-bind:class="{'on-filter':isShowFilters}" @click.stop="stop">
			<div>
				<div class="items scroller-bar">
					<ul :style="{width:conditionUlWidth+'px'}">
						<li :class="{'selected':condition.selected}" v-for="(condition,index) in conditions" :key="index" @click="onFilterItem(condition)">
							{{condition.text}}
						</li> 
					</ul>
				</div>
				<div class="ft" @click="onFilters">
					筛选
					<badge v-if="showBadge"></badge>
					<span class="iconfont" v-bind:class="{'icon-unfold':!isShowFilters,'icon-fold1':isShowFilters}"></span>
				</div>
			</div>
		</div>
		<div class="conditions" v-if="isShowFilters" @click="hide">
			<div @click.stop="stop">
				<div class="tt">床型</div>
				<ul>
					<li @click="onFilterItem(bed)" :class="{'selected':bed.selected}" v-for="(bed,index) in bedTypes" :key="index">{{bed.text}}</li>
				</ul>
				<div class="tt">早餐</div>
				<ul>
					<li @click="onFilterItem(breakfast)" :class="{'selected':breakfast.selected}" v-for="(breakfast,index) in breakfasts" :key="index">{{breakfast.text}}</li>
				</ul>
				<div class="tt">支付方式</div>
				<ul> 
					<li @click="onFilterItem(payType)" :class="{'selected':payType.selected}" v-for="(payType,index) in payTypes" :key="index">{{payType.text}}</li>
				</ul>
				<div class="tt">服务</div>
				<ul>
					<li @click="onFilterItem(serviceType)" :class="{'selected':serviceType.selected}" v-for="(serviceType,index) in serviceTypes" :key="index">{{serviceType.text}}</li>
				</ul>
				<div class="button_sp_area">
					<a href="javascript:;" @click="cleanFilters" class="weui-btn weui-btn_mini weui-btn_default">清空选择</a>
					<a href="javascript:;" @click="filterOk" class="weui-btn weui-btn_mini weui-btn_primary">确定</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			conditions: {
				type: Array,
				required: true
			},
			beds: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				isShowFilters: false,
				conditionsSetting:[],
				bedTypes:[],
				breakfasts:[
					{
						text: '无早',
						field: 'containBreakfast',
						fieldColumn: 'ContainBreakfast',
						val: 0,
						selected: false
					},
					{
						text: '单早',
						field: 'containBreakfast',
						fieldColumn: 'ContainBreakfast',
						val: 1,
						selected: false
					},
					{
						text: '双早',
						field: 'containBreakfast',
						fieldColumn: 'ContainBreakfast',
						val: 2,
						selected: false
					},
					{
						text: '多早',
						field: 'containBreakfast',
						fieldColumn: 'ContainBreakfast',
						val: 3,
						selected: false
					}
				],
				payTypes:[
					{
						text: '现金',
						field: 'payType',
						fieldColumn: 'CanCashPay',
						val: 1,
						selected: false
					},
					{
						text: '微信',
						field: 'payType',
						fieldColumn: 'CanWeiXinPay',
						val: 2,
						selected: false
					},
					{
						text: '奖金',
						field: 'payType',
						fieldColumn: 'CanBonusPay',
						val: 4,
						selected: false
					},
					{
						text: '充值',
						field: 'payType',
						fieldColumn: 'CanPrestorePay',
						val: 5,
						selected: false
					}
				],
				serviceTypes:[
					{
						text: '促销',
						field: 'serviceType',
						fieldColumn: 'isPromotion',
						val: 1,
						selected: false
					},
					{
						text: '返现',
						field: 'serviceType',
						fieldColumn: 'FlagReturn',
						val: 1,
						selected: false
					},
					{
						text: '新人独享',
						field: 'serviceType',
						fieldColumn: 'onlyNewMember',
						val: 1,
						selected: false
					},
					{
						text: '免费取消',
						field: 'serviceType',
						fieldColumn: 'PoundageRate',
						val: 0,
						selected: false
					},
					{
						text: '有窗',
						field: 'serviceType',
						fieldColumn: 'hasWindow',
						val: 1,
						onlyForRoomCondition:true,//是否仅仅用于房型过滤
						selected: false
					} 
				]
			}
		},
		computed: {
			showBadge(){
				this.conditions.sort((c1,c2)=>{
					if(c1.selected&&!c2.selected)
						return -1;
					if(c2.selected&&!c1.selected)
						return 1;
					return 0;
				});
				return this.conditions.find(f=>f.selected);
			},
			conditionUlWidth(){
				return (this.conditionsSetting.length+1)*50;
			}
		},
		created(){
			this.conditionsSetting=this.conditions;
			this.bedTypes=this.beds;
		},
		methods: {
			stop(event) { //阻止事件冒泡
				event.preventDefault();
				event.stopPropagation();
				return false;
			},
			hide() {
				this.isShowFilters = false;
			},
			callBack() {
				let conditions = this.conditionsSetting;
				this.$emit("update:conditions",conditions);
				this.$emit('onFilterCallback');
			},
			onFilters() {
				this.isShowFilters = !this.isShowFilters;
			},
			onFilterItem(condition) {
				let field=condition.field,val=condition.val,selected=!condition.selected,fieldColumn=condition.fieldColumn;
				let index=-1,arrayTemp=[];
				this.conditionsSetting.forEach((e,i,a)=>{
					if(e.field==field&&e.fieldColumn==fieldColumn&&index==-1){
						index=i; 
					}
				});
				
				//console.log(index)
				if(index>-1)
					{
						condition.selected=selected;
						this.conditionsSetting.splice(index,1,condition);
					}
				else
					{
						condition['selected']=true;
						this.conditionsSetting.push(condition);
					}
					
				index=-1;
				if(field=='containBreakfast'){
					this.breakfasts.forEach((e,i,a)=>{
						arrayTemp.push(Object.assign(e,{selected:false}));
						if(index==-1&&e.val==val){
							index=i;
						}
					});
					arrayTemp[index].selected=selected;
					this.breakfasts=arrayTemp;
				}
				else if(field=='payType'){
					this.payTypes.forEach((e,i,a)=>{
						arrayTemp.push(e);
						if(index==-1&&e.val==val){
							index=i;
						}
					});
					arrayTemp[index].selected=selected;
					this.payTypes=arrayTemp;
				} else if(field=='serviceType'){
					this.serviceTypes.forEach((e,i,a)=>{
						arrayTemp.push(e);
						if(e.fieldColumn==fieldColumn&&index==-1&&e.val==val){
							index=i;
						}
					});
					arrayTemp[index].selected=selected;
					this.serviceTypes=arrayTemp;
				}else if(field=='bedType'){
					this.bedTypes.forEach((e,i,a)=>{
						arrayTemp.push(Object.assign(e,{selected:false}));
						if(index==-1&&e.val==val){
							index=i;
						}
					});
					arrayTemp[index].selected=selected;
					this.bedTypes=arrayTemp;
				}
				this.callBack();
			},
			cleanFilters() {
				let that=this;
				that.conditionsSetting.forEach((e,i,a)=>{
					that.conditionsSetting.splice(i,1,Object.assign(e,{selected:false}));
				});
				that.breakfasts.forEach((e,i,a)=>{
					that.breakfasts.splice(i,1,Object.assign(e,{selected:false}));
				});
				that.payTypes.forEach((e,i,a)=>{
					that.payTypes.splice(i,1,Object.assign(e,{selected:false}));
				});
				that.serviceTypes.forEach((e,i,a)=>{
					that.serviceTypes.splice(i,1,Object.assign(e,{selected:false}));
				});
				that.callBack();
				that.hide();
			},
			filterOk() {
				this.hide();
			},
		}
	}
</script>