export class Branch {

    private id:number = 1;

    constructor(){
    }

    public log (){
        console.log(++this.id)
    }
}