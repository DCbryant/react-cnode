import {
    observable,
    computed,
    autorun,
    action,
    toJS,
} from 'mobx'
import {get,post} from '../util/http'
import axios from 'axios'

export default class AppState{
    @observable user = {
        isLogin:false,
        info:{},
        detail:{
            recentTopics:[],
            recentReplies:[],
            syncing:false
        },
        collections:{
            syncing:false,
            list:[],
        }
    }

    init({user}){
        if(user){
            this.user = user
        }
    }

    // 一刷新user就没了
    @action login(accessToken) {
        return new Promise((resolve, reject) => {
            axios.post('/api/user/login', {
                accessToken,
            }).then(resp => {
                if (resp.status === 200 && resp.data.success){
                    this.user.info = resp.data.data
                    this.user.isLogin = true
                    resolve()
                } else {
                    reject(resp.data.msg)
                }
            }).catch(reject)
        })
      }

    @action getUserDetail() {
        this.user.detail.syncing = true
        return new Promise((resolve, reject) => {
            axios.get(`/api/user/${this.user.info.loginname}`)
                .then(resp => {
                    if (resp.status === 200 && resp.data.success) {
                        this.user.detail.recentReplies = resp.data.data.recent_replies
                        this.user.detail.recentTopics = resp.data.data.recent_topics
                        resolve()
                    } else {
                        reject(resp.data.msg)
                        this.notify({ message: resp.data.msg })
                    }
                    this.user.detail.syncing = false
                }).catch(err => {
                    this.user.detail.syncing = false
                    console.log(err)
                })
        })
    }

    @action getUserCollection(){
        this.user.collections.syncing = true
        return new Promise((resolve, reject) => {
            axios.get(`/api/topic_collect/${this.user.info.loginname}`)
                .then(resp => {
                    if(resp.status === 200 && resp.data.success){
                        this.user.collections.list = resp.data.data
                        resolve()
                    }else{
                        reject(resp.data.msg)
                    }
                    this.user.collections.syncing = false
                }).catch(err => {
                    console.log(err)
                    this.user.collections.syncing = false
                })
            })
    }
    // 客户端初始化的时候能拿到这些值
    toJson(){
        return{
            user:toJS(this.user)
        }
    }
}




