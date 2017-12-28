import {
    observable,
    computed,
    autorun,
    action
} from 'mobx'

export default class AppState{
    constructor({count,name} = {count:0,name:'dcbryant'}){
        this.count = count
        this.name = name
    }

    @observable count
    @observable name
    @computed get msg(){
        return `${this.name} + ${this.count} `
    }
    @action add(){
        this.count += 1
    }

    toJson(){
        return{
            count:this.count,
            name:this.name
        }
    }
}




