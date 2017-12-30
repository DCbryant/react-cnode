import React from 'react'
import PropTypes from 'prop-types'
import {
    inject,
    observer,
} from 'mobx-react'
import Avatar from 'material-ui/Avatar'
import {withStyles} from 'material-ui/styles'
import UserIcon from 'material-ui-icons/AccountCircle'
import Container from '../layout/container'
import userStyles from './styles/user-style'


class User extends React.Component{
    componentDidMount(){

    }

    render(){
        const {classes} = this.props
        const user = {}
        return(
            <Container>
                <div className={classes.avatar}>
                    <div className={classes.bg} />
                    {
                        user.avatar_url ? 
                        <Avatar className={classes.avatarImg} src={user.avatar_url} /> :
                        <Avatar className={classes.avatarImg}>
                            <UserIcon />
                        </Avatar>
                    }
                    <span className={classes.userName}>{user.loginname || '未登录'}</span>
                </div>
                {this.props.children}
            </Container>
        )
    }
}


User.propTypes = {
    classes:PropTypes.object.isRequired,
}

export default withStyles(userStyles)(User)