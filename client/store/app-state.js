import {
    observable,
    computed,
    autorun,
    action
} from 'mobx'

export class AppState{
    @observable count=0
    @observable name='dc'
    @computed get msg(){
        return `${this.name} + ${this.count} `
    }
    @action add(){
        this.count += 1
    }
}

const appState = new AppState()

// autorun(() => {
//     console.log(appState.count)
// })

// setInterval(() => {
//     appState.add()
// },1000)

export default appState