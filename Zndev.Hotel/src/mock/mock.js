import Mock from 'mockjs';
let baseURL = process.env.BASE_API;
//获取同一集团店铺
Mock.mock(`${baseURL}/Api.Web/Common/StoreServiceInfo`, 'post', function(res) {
  console.log(res);

  return {
    "status": 200,
    "message": "Success",
    "data": {
      // "groupAccount": "zndevcn",
      // "groupId": 26,
      // "useType": 3,
      // "groupName": "志能系统",
      // "groupNameAcronym": "测试集团",
      // "stores": [{
      //   "id": 25,
      //   "name": "儋州城市花园精品酒店市中心店",
      //   "isDefault": 0,
      //   "isSelf": true
      // }, {
      //   "id": 27,
      //   "name": "儋州兰洋地质温泉酒店",
      //   "isDefault": 1,
      //   "isSelf": true
      // }, {
      //   "id": 32,
      //   "name": "儋州洋浦迎宾馆",
      //   "isDefault": 0,
      //   "isSelf": true
      // }, {
      //   "id": 33,
      //   "name": "天涯时尚酒店",
      //   "isDefault": 0,
      //   "isSelf": true
      // }]
    }
  }

})
