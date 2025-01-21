import requester from '@/utils/axios.js'
import StoreGetter from '@/utils/store_getter.js'

let storage = window.localStorage;

function getCarKey() {
  let org = StoreGetter.getOrg();
  let car_key = `shopping_car${org.groupId}`;
  return car_key;
}

/*
 * 购物车商品模型：
 * {
 * 	id,
 *  num
 * }
 */
function saveCar(products) {
  let car_key = getCarKey();
  if (storage.getItem(car_key)) {
    storage.removeItem(car_key);
  }
  let js = JSON.stringify(products);
  return storage.setItem(car_key, js);
}

function getCar() {
  let car_key = getCarKey();
  let products = storage.getItem(car_key);
  if (products) {
    products = JSON.parse(products);
    return products;
  }
  return [];
}

let shoppingCar = {
  add: function (id) {
    let existsIndex = -1;
    let products = getCar();
    products.forEach((e, i, a) => {
      if (e.id == id) {
        products.splice(i, 1, Object.assign({
          id
        }, {
          num: e.num + 1
        }));
        existsIndex = i;
      }
    });
    if (existsIndex == -1) {
      products.push({
        id,
        num: 1
      });
    }
    saveCar(products);
  },
  remove: function (id) {
    let products = getCar();
    products.forEach((e, i, a) => {
      if (e.id == id) {
        products.splice(i, 1);
      }
    });
    saveCar(products)
  },
  refresh(products) {
    saveCar(products)
  },
  clean: function () {
    saveCar([])
  },
  getProducts: function () {
    let products = getCar();
    return products;
  },
  getCarInfo: function (ids) {
    return requester({
      url: '/Api.Web/ZnProduct/ShoppingCarProducts',
      params: {
        ids
      }
    })
  }
};

export default shoppingCar;
