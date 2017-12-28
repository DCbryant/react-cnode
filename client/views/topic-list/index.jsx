import React from 'react'
import {inject,observer} from 'mobx-react'
import PropTypes from 'prop-types'
import {AppState} from '../../store/store'
import Helmet from 'react-helmet'

@inject('appState')
@observer
export default class TopicList extends React.Component{
    asyncBootstrap(){
        return new Promise(resolve => {
            setTimeout(() => {
                this.props.appState.count = 3
                resolve(true)
            } )
        })
    }
    render(){
        return(
            <div>
                <Helmet>
                    <title>topic list</title>
                    <meta name='description' content='description' />
                </Helmet>
                <div>{this.props.appState.msg}</div>
            </div>
        )
    }
}

TopicList.propTypes = {
    appState:PropTypes.instanceOf(AppState),
}