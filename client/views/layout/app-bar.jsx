import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import ToolBar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Typography from 'material-ui/Typography'
import {
    observer,
    inject
} from 'mobx-react'

const styles = {
    root:{
        width:'100%',
    },
    flex:{
        flex:1,
    },
}

@inject(stores => {
    return {
        appState:stores.appState,
    }
})
@observer
class MainAppBar extends React.Component{
    static contextTypes = {
        router:PropTypes.object,
    }

    onHomeIconClick = () => {
        this.context.router.history.push('/list?tab=all')   
    }

    createButtonClick = () => {
        this.context.router.history.push('/topic/create')
    }

    loginButtonClick = () => {
        if(this.props.appState.user.isLogin){
            this.context.router.history.push('/user/info')   
        }else{
            this.context.router.history.push('/user/login')
        }
    }

    render(){
        const {classes} = this.props
        const {user} = this.props.appState
        console.log(user.info.loginname)
        return(
            <div className={classes.root}>
                <AppBar position='fixed'>
                    <ToolBar>
                        <IconButton color='contrast' onClick={this.onHomeIconClick}>
                            <HomeIcon />
                        </IconButton>
                        <Typography type='title' color='inherit' className={classes.flex}>
                            Dnode
                        </Typography>
                        <Button raised color='accent' onClick={this.createButtonClick}>
                            新建话题
                        </Button>
                        <Button color='contrast' onClick={this.loginButtonClick}>
                            {
                                user.isLogin ? user.info.loginname : '登陆'
                            }
                        </Button>
                    </ToolBar>
                </AppBar>
            </div>
        )
    }
}

MainAppBar.wrappedComponent = {
    appState:PropTypes.object.isRequired,
}

MainAppBar.propTypes = {
    classes:PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)