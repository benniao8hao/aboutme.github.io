const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/
const urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
const floatRegex=/^[-]?\d*(\.\d{1,2})?$/
const integerRegex=/^-?[0-9]*$/
const numericRegex=/^[0-9]*$/
const quantityRegex=/^[1-9]\d*$/
const priceRegex=/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
const chineseRegex=/^[\u4e00-\u9fa5]{1,}$/
const accountRegex=/^[a-zA-z0-9_-]{6,20}$/
const mobileRegex=/^[1][3-9][0-9]{9}$/	
const passwordRegex=/^[a-zA-z0-9_-`,.+-=~!@#$%^&*?()]{6,20}$/

let validator={
	isMobile:function(str){
		return mobileRegex.test(str);
	},	
	isChinese:function(str){
		return chineseRegex.test(str);
	},
	isAccount:function(str){
		return accountRegex.test(str);
	},
	isPassword:function(str){
		return passwordRegex.test(str);
	},
	isEmail:function(str){
		return emailRegex.test(str);
	},
	isUrl:function(str){
		return urlRegex.test(str);
	},
	isFloat:function(str){
		return floatRegex.test(str);
	},
	isInteger:function(str){
		return integerRegex.test(str);
	},
	isNubmer:function(str){
		return numericRegex.test(str);
	},
	isQty:function(str){
		return quantityRegex.test(str);
	},
	isPrice:function(str){
		return priceRegex.test(str);
	} 	
}

export default validator;