import React, { Component } from 'react'
import DataList from './DataList'
import LikedList from './LikedList'
import UserItemList from './UserItemList'
import db from './db'
import Button from 'material-ui/Button';
import List, { ListItem, ListItemSecondaryAction } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import { Link } from "react-router-dom";
import * as aziz from 'material-ui'

///
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';



export class all extends Component {

    state = {
        search: '',
        select: null,
        _id: '',
        query: 'users'
    }

    formatListUser(user, i) {
        return (
            <ListItem key={i}>

                {user.username}

                <ListItemSecondaryAction>
                    {
                        db.user
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleDelete(user)}>Delete</Button>
                    }
                    {
                        db.user
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleSelect(user)}>message</Button>
                    }

                    <Button variant="raised" color="primary" size="small" component={Link} to={`/user/${user._id}`}>View profile page</Button>
                </ListItemSecondaryAction>

            </ListItem>
        )
    }

    handleSearchUsers() {
        this.setState({ _id: '', query: 'users/username/' + this.state.search })
    }

    async handleDelete(user) {
        await db.collection('users').deleteOne(user._id)
        this.setState({ select: null, _id: '' })
    }

    handleSelect(user) {
        this.setState({ select: user, _id: user._id })
    }

    async handleCreate() {
        await db.collection('users').createOne({ _id: this.state._id, likes: [] })
        this.setState({ _id: '' })
    }

    async handleUpdate() {
        await db.collection('users').deleteOne(this.state.select._id)
        await db.collection('users').createOne({ _id: this.state._id })
        this.setState({ select: null, _id: '' })
    }

    render() {
        return (
            <div>
                <div style={{ padding: 10, backgroundColor: 'lightgreen' }}>
                    <h2>My contacts List</h2>
                    <List className='DataList'>
                        <DataList collection={'users/' + db.user._id + '/contacts'} formatListItem={(user, i) => this.formatListUser(user, i)} />
                    </List>

                    <p>Queries:</p>
                    <TextField label='Username' value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
                    <Button variant="raised" color="primary" size="small" style={{ float: 'right' }} onClick={() => this.handleSearchUsers()}>Search Users</Button>
                    <p>Operations:</p>
                    <TextField label='Username' value={this.state._id} onChange={e => this.setState({ _id: e.target.value })} />
                    <Button size='small' variant="raised" color="primary" style={{ margin: 3, float: 'right' }} onClick={() => this.handleUpdate()}>Update</Button>
                    <Button size='small' variant="raised" color="primary" style={{ margin: 3, float: 'right' }} onClick={() => this.handleCreate()}>Create</Button>
                </div>
                {
                    this.state.select
                        ?
                        <div>
                            <UserItemList user={this.state.select} />
                            <LikedList user={this.state.select} />
                        </div>
                        :
                        <div></div>
                }
            </div>
        )
    }

}


export class details extends Component {

    state = {
        amount: '',
        user: null,
        content: '',
        from: '',
        to: '',
        date: ''
    }

    componentWillMount() {
        db.setListener('users/' + this.props.match.params._id, this.handleItem)
    }

    componentWillUnmount() {
        db.removeListener(`users/${this.props.match.params._id}`, this.handleItem)
    }

    handleItem = user => this.setState({ user })

    formatListItem(message, i) {
        return (
            <ListItem key={i}>
                from: {message.from}, to: {message.to}, Message: {message.content}
            </ListItem>
        )
    }

    async handleSend() {


        let id = db.user._id;
        let tempDate = new Date()

        await db.collection('users/' + this.state.user._id + '/messages').createOne({ from: db.user._id , to:this.state.user._id , content: this.state.content, date: tempDate })
        await db.collection('users/' +  db.user._id + '/messages').createOne({ from: db.user._id , to:this.state.user._id , content: this.state.content, date: tempDate })
        this.props.history.push('/')

    }

    render() {
        return (
            this.state.user
            &&
            <div style={{ padding: 10, backgroundColor: 'lightblue' }}>
                <List className='DataList'>
                    {/* <DataList collection={'items/' + this.state.item._id + '/messages'} formatListItem={(message, i) => this.formatListItem(message, i)} /> */}
                    <DataList collection={'users/' + db.user._id + '/messages'} formatListItem={(message, i) => this.formatListItem(message, i)} />
                </List>

                <div style={{ padding: 10, backgroundColor: 'white' }}>

                    <aziz.TextField label='Message' value={this.state.content} onChange={e => this.setState({ content: e.target.value })} />
                    <br />
                    <aziz.Button style={{ margin: 3, float: 'right' }} color="primary" variant='raised' onClick={() => this.handleSend()}>Send a message</aziz.Button>

                </div>
            </div>
        )
    }
}