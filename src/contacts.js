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

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});


export class UserList extends Component {

    state = {
        search: '',
        select: null,
        _id: '',
        query: 'users'
    }

    formatListUser(user, i) {
        return (
            <ListItem key={i}>
                {user._id}
                , Contacts:
                <span className='Comma'>
                    <DataList collection={'users/' + user._id + '/contact'} formatListItem={(item, i) => <span key={i}>{item.description}</span>} />
                </span>
                , Auctions:
                <span className='Comma'>
                    <DataList collection={'users/' + user._id + '/items'} formatListItem={(item, i) => <span key={i}>{item.description}</span>} />
                </span>
                <ListItemSecondaryAction>
                    <Button variant="raised" color="primary" size="small" onClick={() => this.handleDelete(user)}>Delete</Button>
                    <Button variant="raised" color="primary" size="small" onClick={() => this.handleSelect(user)}>Select</Button>
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
                    <h2>Users</h2>
                    <List className='DataList'>
                        <DataList collection={this.state.query} formatListItem={(user, i) => this.formatListUser(user, i)} />
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
                    {/* {
                        db.user
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleDelete(user)}>Delete</Button>
                    }
                    {
                        db.user
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleSelect(user)}>message</Button>
                    } */}


                    {/* <Button variant="raised" color="primary" size="small" component={Link} to={`/user/${user._id}`}>Message</Button> */}
                    <Button variant="raised" color="primary" size="small" component={Link} to={`/messages/${user.username}`}>View Bids/Details</Button>

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
        search: '',
        select: null,
        _id: '',
        query: 'users',
        user: [],
        rate: 0,
        content: '',
        username: '',
        feedbacks: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };


    componentWillMount() {
        db.setListener('users/' + this.props.match.params._id, this.handleUser)
    }

    componentWillUnmount() {
        db.removeListener(`users/${this.props.match.params._id}`, this.handleUser)
    }

    handleUser = user => this.setState({ user })


    formatListUser(user, i) {
        return (
            <ListItem key={i}>
                {user._id}
                , Likes:
                <span className='Comma'>
                    <DataList collection={'users/' + user._id + '/likes'} formatListItem={(item, i) => <span key={i}>{item.description}</span>} />
                </span>
                , Auctions:
                <span className='Comma'>
                    <DataList collection={'users/' + user._id + '/items'} formatListItem={(item, i) => <span key={i}>{item.description}</span>} />
                </span>
                <ListItemSecondaryAction>
                    <Button variant="raised" color="primary" size="small" onClick={() => this.handleDelete(user)}>Delete</Button>
                    <Button variant="raised" color="primary" size="small" onClick={() => this.handleSelect(user)}>Select</Button>
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

        if (db.user._id == null) {
            alert("please log in to leave a comment")
        }


        let id = db.user._id;
        let feedback = {
            username: id,
            rating: this.state.rate,
            content: this.state.content,
        }

        await db.collection('users').deleteOne(this.props.match.params._id)
        await db.collection('users').createOne({ _id: this.props.match.params._id, feedbacks: feedback })
        this.setState({ select: null, _id: '' })
    }


    render() {

        return (
            <div>
                <div style={{ padding: 10, backgroundColor: 'gold' }}>

                    <h2>{this.props.match.params._id} Profile page</h2>



                    <h1>{this.state.user._id}</h1>
                    <h1>{this.state.user.password}</h1>



                    <div style={{ padding: 10, backgroundColor: 'white' }}>


                        <FormControl >
                            <InputLabel>Rate</InputLabel>
                            <Select
                                value={this.state.rate}
                                onChange={e => this.setState({ rate: e.target.value })}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                            </Select>
                        </FormControl>


                        <br />
                        <aziz.TextField label='Message' value={this.state.content} onChange={e => this.setState({ content: e.target.value })} />
                        <br />
                        <aziz.Button style={{ margin: 3, float: 'right' }} color="primary" variant='raised' onClick={() => this.handleUpdate()}>Give a feedback</aziz.Button>
                    </div>


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


