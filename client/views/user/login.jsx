import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import {
    inject,
    observer
} from 'mobx-react'
import {withStyles} from 'material-ui/styles'
import UserWrapper from './user'
import loginStyles from './styles/login-style'
import {Redirect} from 'react-router-dom'
import queryString from 'query-string'

@inject(stores => {
    return {
        appState:stores.appState,
        user:stores.appState.user,
    }
})
@observer 
class UserLogin extends React.Component{
    static contextTypes = {
        router:PropTypes.object,
    }

    constructor(props){
        super(props)
        this.state = {
            accesstoken:'',
            helpText:'',
        }
    }


    handleInput = (e) => {
        this.setState({
            accesstoken:e.target.value.trim(),
        })
    }

    handleLogin = () => {
        if(!this.state.accesstoken){
            return this.setState({
                helpText:'必须填写',
            })
        }
        this.setState({
            helpText:''
        })
        return this.props.appState.login(this.state.accesstoken)
            .catch(err => {
                console.log(err)
            })
    }

    getFrom(location){
        location = location || this.props.location
        const query = queryString.parse(location.search)
        return query.from || '/user/info'
    }

    render(){
        const {classes} = this.props
        const from = this.getFrom()
        const isLogin = this.props.user.isLogin
        if(isLogin){
            return <Redirect to={from} />
        }
        return (
            <UserWrapper>
                <div className={classes.root}>
                    <TextField 
                        label='请输入Dnode AccessToken'
                        placeholder='请输入Dnode AccessToken'
                        required
                        helperText={this.state.helpText}
                        value={this.state.accesstoken}
                        onChange={this.handleInput}
                        className={classes.input}
                    />
                    <Button 
                        raised
                        color='accent'
                        onClick={this.handleLogin}
                        className={classes.loginButton}
                    >
                        登陆
                    </Button>
                </div>
            </UserWrapper>
        )
    }
}

UserLogin.wrappedComponent.propTypes = {
    appState:PropTypes.object.isRequired,
    user:PropTypes.object.isRequired,
}

UserLogin.propTypes = {
    classes:PropTypes.object.isRequired,
    location:PropTypes.object.isRequired,
}

export default withStyles(loginStyles)(UserLogin)