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


export class details extends Component {

    state = {
        search: '',
        select: null,
        user: [],
        _id: '',
        query: 'users',
        rate: 0,
        content: '',
        username: '',
        feedbacks: []
    }

    componentWillMount() {
        db.setListener('users/' + this.props.match.params._id, this.handleUser)
    }

    componentWillUnmount() {
        db.removeListener(`users/${this.props.match.params._id}`, this.handleUser)
    }

    handleUser = user => this.setState({ user })


    formatListItem(item, i) {
        return (
            <ListItem key={i}>


  
                Name : {item.username} , rating:  {item.rating}, Message: {item.content}
               
  
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

    async handleFeedback() {

        if (db.user._id == null) {
            alert("please log in to leave a comment")
        }
        let id = db.user._id;
        let feedback = {
            username: id,
            rating: this.state.rate,
            content: this.state.content,
        }
        await db.collection('users/' + this.state.user._id + '/feedbacks').createOne({ username: db.user._id, content: this.state.content, rating: this.state.rate })
        this.props.history.push('/')
    }


    async handleAddContacts() {

        console.log("Heck yeah baby")


        if (db.user._id == null) {
            alert("please log in ")
        }
        let id = db.user._id;


        await db.collection('users/' + this.state.user._id + '/contacts').createOne({ username: db.user._id})
        await db.collection('users/' +  db.user._id + '/contacts').createOne({ username: this.state.user._id})
        this.props.history.push('/users')

    }

    async handleCreate() {

        if (!this.state.item.highbid || (1 * this.state.amount >= this.state.item.highbid)) {
            let item = this.state.item
            item.highbid = this.state.amount
            await db.collection('items').replaceOne(item._id, item)
            await db.collection('items/' + this.state.item._id + '/bids').createOne({ username: db.user._id, amount: this.state.amount })
        }
        this.setState({ amount: '' })
    }


    render() {

        return (
            <div>
                <div style={{ padding: 10, backgroundColor: 'gold' }}>
                    <aziz.Button style={{ margin: 3, float: 'right' }} color="primary" variant='raised' onClick={() => this.handleAddContacts()}>Add the user</aziz.Button>





                    <h2>{this.props.match.params._id} Profile page</h2>



                    <h1>{this.state.user._id}</h1>
                    <h1>{this.state.user.password}</h1>

                    {/* <List className='DataList'>
                        <DataList collection={"users/maria@test.com/feedbacks"} formatListItem={(user, i) => this.formatListUser(user, i)} />
                    </List> */}

                    {/* <DataList collection={'users/' + user._id + '/feedbacks'} formatListItem={(item, i) => <span key={i}>{feedbacks}</span>} /> */}

                    <List className='DataList'>
                        <DataList collection={'users/' + this.props.match.params._id+ '/messages'} formatListItem={(item, i) => this.formatListItem(item, i)} />
                    </List>




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
                        <aziz.Button style={{ margin: 3, float: 'right' }} color="primary" variant='raised' onClick={() => this.handleFeedback()}>Send</aziz.Button>
                    </div>


                </div>
                
            </div>
        )
    }
}