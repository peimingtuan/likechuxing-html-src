import tools from './tools'
class pickerTools {
    initData(){
        let arr = []
        let max = this.getLastItem()
        for(let i = 0;i<max;i++){
            let iDate = new Date(tools.toSetDay(-i))
            let y = iDate.getFullYear()
            let m = iDate.getMonth()+1
            let d = iDate.getDate()
            let x = iDate.getDay()
            let disabled = false
            if(i>29){
                disabled = true
            }
            let item = {
                id:i,
                d,
                x,
                md:tools.toFixed2(m)+tools.toFixed2(d),
                ymd:y+tools.toFixed2(m)+tools.toFixed2(d),
                disabled
            }
            
            arr.push(item)
        }
        arr.reverse()
        let x0 = [], x1 = [], x2 = [], x3 = [], x4 = [], x5 = [], x6 = [];
        arr.map(item=>{
            switch(item.x){
                case 0:
                    x0.push(item);
                    break;
                case 1:
                    x1.push(item);
                    break;
                case 2:
                    x2.push(item);
                    break;
                case 3:
                    x3.push(item);
                    break;
                case 4:
                    x4.push(item);
                    break;
                case 5:
                    x5.push(item);
                    break;
                case 6:
                    x6.push(item);
                    break;
            }
        })
        let res = {
            x0,
            x1,
            x2,
            x3,
            x4,
            x5,
            x6,
        }
        return res
    }
    getLastItem(){
        let iDate = new Date(tools.toSetDay(-29))
        let x = iDate.getDay()
        switch(x){
            case 0:
                return 30
                break;
            case 1:
                return 31
                break;
            case 2:
                return 32
                break;
            case 3:
                return 33
                break;
            case 4:
                return 34
                break;
            case 5:
                return 35
                break;
            case 6:
                return 36
                break;
        }
    }
    initHourData(){
        let res = []
        for(let i = 0;i<24;i++){
            let item = {
                id:i,
                name:i+':00'
            }
            res.push(item)
        }
        return res
    }
}
export default new pickerTools()