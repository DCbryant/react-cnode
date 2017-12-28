import React from 'react'
import {inject,observer} from 'mobx-react'
import PropTypes from 'prop-types'
import {AppState} from '../../store/store'

@inject('appState')
@observer
export default class TopicList extends React.Component{
    render(){
        return(
            <div>{this.props.appState.msg}</div>
        )
    }
}

TopicList.propTypes = {
    appState:PropTypes.instanceOf(AppState),
}