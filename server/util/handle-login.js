const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

// 代理登陆接口

router.post('/login',(req,res,next) => {
    axios.post(`${baseUrl}/accesstoken`,{
        accesstoken:req.body.accessToken
    })
        .then(resp => {
            if(resp.status === 200 && resp.data.success){
                // 将登录信息都放到user里面
                req.session.user = {
                    accessToken:req.body.accessToken,
                    loginName:resp.data.loginname,
                    id:resp.data.id,
                    avatarUrl:resp.data.avatar_url
                }
                res.json({
                    success:true,
                    data:resp.data
                })
            }
        })
        .catch((err) => {
            if(err.response){
                res.json({
                    success:false,
                    data:err.response.data
                })
            }else{
                next(err)
            }
        })
})

module.exports = router