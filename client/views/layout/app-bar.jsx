import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import ToolBar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Typography from 'material-ui/Typography'

const styles = {
    root:{
        width:'100%',
    },
    flex:{
        flex:1,
    },
}

class MainAppBar extends React.Component{

    onHomeIconClick = () => {

    }

    createButtonClick = () => {

    }

    loginButtonClick = () => {

    }

    render(){
        const {classes} = this.props
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
                            登陆
                        </Button>
                    </ToolBar>
                </AppBar>
            </div>
        )
    }
}

MainAppBar.propTypes = {
    classes:PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)