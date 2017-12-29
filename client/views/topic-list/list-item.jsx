import React from 'react'
import PropTypes from 'prop-types'
import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import Avatar from 'material-ui/Avatar'
import ListItemText from '../../../node_modules/_material-ui@1.0.0-beta.25@material-ui/List/ListItemText';
import IconHome from 'material-ui-icons/Home'
import {withStyles} from 'material-ui/styles'
import {topicPrimaryStyle,topicSecondaryStyles} from './styles'

const Primary = ({classes,topic}) => (
    <div className={classes.root}>
        <span className={classes.tab}>{topic.tab}</span>
        <span className={classes.title}>{topic.title}</span>
    </div>
)

Primary.propTypes = {
    topic:PropTypes.object.isRequired,
    classes:PropTypes.object.isRequired,
}

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary)

const Secondary = ({classes,topic}) => (
    <div className={classes.root}>
        <span className={classes.userName}>{topic.username}</span>
        <span className={classes.count}>
            <span className={classes.accentColor}>{topic.reply_count}</span>
            <span>/</span>
            <span>{topic.visit_count}</span>
        </span>
        <span>创建时间：{topic.create_at}</span>
    </div>
)

Secondary.propTypes = {
    topic:PropTypes.object.isRequired,
    classes:PropTypes.object.isRequired,
}

const StyledSecondary = withStyles(topicSecondaryStyles)(Secondary)
const TopicListItem =({onClick,topic}) => (
    <ListItem button>
        <ListItemAvatar>
            {/* <Avatar src={topic.image} /> */}
            <IconHome />
        </ListItemAvatar>
        <ListItemText 
            primary={<StyledPrimary topic={topic} />}
            secondary={<StyledSecondary topic={topic} />}
        />
    </ListItem>
)

TopicListItem.propTypes = {
    onClick:PropTypes.func.isRequired,
    topic:PropTypes.object.isRequired,
}

export default TopicListItem