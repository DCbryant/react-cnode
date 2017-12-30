import {
    observable,
    toJS,
    computed,
    action,
    extendObservable
} from 'mobx'
import {topicSchema,replySchema} from '../util/vairable-define'
import {get,post} from '../util/http'

const createTopic = (topic) => {
    return Object.assign({},topicSchema,topic)
}

const createReply = (reply) => {
    return Object.assign({},replySchema,reply)
}

class Topic{
    constructor(data){
        extendObservable(this,data)
    }
    @observable syncing=false
    @observable createdReplies = []

    @action doReply(content){
        return new Promise((resolve,reject) => {
            post(`/topic/${this.id}/replies`,{
                needAccessToken:true,
            },{content})
            .then(resp => {
                if(resp.success){
                    this.createdReplies.push(createReply({
                        id:resp.reply_id,
                        content,
                        create_at:Date.now(),
                    }))
                    resolve()
                }else{
                    reject(resp)
                }
            }).catch(reject)
        })
    }
}

class TopicStore{
    constructor({syncing=false,topics=[],details=[]} = {}){
        this.syncing = syncing
        this.topics = topics.map(topic => new Topic(createTopic(topic)))
        this.details = details.map(topic => new Topic(createTopic(topic)))
    }

    @observable topics
    @observable syncing
    @observable details

    @computed get detailMap(){
        return this.details.reduce((result,detail) => {
            result[detail.id] = detail
            return result
        },{})
    }

    addTopic = (topic) => {
        this.topics.push(new Topic(createTopic(topic)))
    }

    @action fetchTopics(tab){
        return new Promise((resolve,reject) => {
            this.syncing = true
            this.topics = []
            get('/topics',{
                mdrender:false,
                tab,
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

    @action getTopicDetail(id){
        return new Promise((resolve,reject) => {
            if(this.detailMap[id]){
                resolve(this.detailMap[id])
            }else{
                get(`/topic/${id}`,{
                    mdrender:false
                }).then(resp => {
                    if(resp.success){
                        const topic = new Topic(createTopic(resp.data))
                        this.details.push(topic)
                        resolve(topic)
                    }else{
                        reject()
                    }
                }).catch(reject)
            }
        })
    }

}


export default TopicStore