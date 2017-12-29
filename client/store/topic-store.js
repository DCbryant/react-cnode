import {
    observable,
    toJS,
    computed,
    action,
    extendObservable
} from 'mobx'
import {topicSchema} from '../util/vairable-define'
import {get,post} from '../util/http'

const createTopic = (topic) => {
    return Object.assign({},topicSchema,topic)
}

class Topic{
    constructor(data){
        extendObservable(this,data)
    }
    @observable syncing=false
}

class TopicStore{
    constructor({syncing,topics} = {syncing:false,topics:[]}){
        this.syncing = syncing
        this.topics = topics.map(topic => new Topic(createTopic(topic)))
    }

    @observable topics
    @observable syncing

    addTopic = (topic) => {
        this.topics.push(new Topic(createTopic(topic)))
    }

    @action fetchTopics(){
        return new Promise((resolve,reject) => {
            this.syncing = true
            this.topics = []
            get('/topics',{
                mdrender:false,
            }).then(resp => {
                if(resp.success){
                    resp.data.forEach(topic => {
                        this.addTopic(topic)
                    })
                    resolve()
                }else{
                    reject()
                }
                this.syncing = false
            }).catch(err => {
                reject(err)
                this.syncing = false
            })
        })
    }
}


export default TopicStore