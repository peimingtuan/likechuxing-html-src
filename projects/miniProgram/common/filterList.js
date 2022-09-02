import api from './api';
let obj = {};
let list = [
    api.apiLoginGetCode(),
    api.apiLogin(),
    api.apiLogout(),
    api.apiConvertCoupon(),
    api.apiOrder(),
    api.apiFindCar(),
    api.apiCancelOrder(),
    api.apiUpdateReturnAddr(),
    api.apiOpenDoor(),
    api.apiCloseDoor(),
    api.apiFinish(),
    api.apiConfirmOrder(),
    api.apiComment(),
    api.apiGetZhiMa(),
    api.apiGetChargeDesc()
]
obj.list = list;

export default obj;