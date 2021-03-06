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
    constructor({syncing=false,topics=[],details=[],tab=null} = {}){
        this.syncing = syncing
        this.topics = topics.map(topic => new Topic(createTopic(topic)))
        this.details = details.map(topic => new Topic(createTopic(topic)))
        this.tab = tab
    }

    @observable topics
    @observable syncing
    @observable details
    @observable createdTopics = []
    @observable tab

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
            if(tab === this.tab && this.topics.length > 0){ //若两者相同就不必再继续发送请求了
                resolve()
            }else{
                this.tab = tab
                this.syncing = true
                this.topics = []
                get('/topics',{
                    mdrender:false,
                    tab,
                }).then(resp => {
                    if(resp.success){
                        this.topics = resp.data.map(topic => {
                            return new Topic(createTopic(topic))
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
            }
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

    @action createTopic(title,tab,content){
        return new Promise((resolve,reject) => {
            post('/topics',{
                needAccessToken:true,
            },{
                title,tab,content
            })
                .then(resp => {
                    if(resp.success){
                        const topic = {
                            title,
                            tab,
                            content,
                            id:resp.topic_id,
                            create_at:Date.now()
                        }
                        this.createdTopics.push(new Topic(createTopic(topic)))
                        resolve()
                    }else{
                        reject()
                    }
                }).catch(reject)
        })
    }

    // 客户端初始化的时候能拿到这些值
    toJson(){
        return{
            topics:toJS(this.topics),
            syncing:toJS(this.syncing),
            details:toJS(this.details),
            tab:this.tab,
        }
    }

}


export default TopicStore