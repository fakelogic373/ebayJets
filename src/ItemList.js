import React, { Component } from 'react'
import DataList from './DataList'
import db from './db'
import Button from 'material-ui/Button';
import List, { ListItem, ListItemSecondaryAction } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import { Link } from "react-router-dom";
import * as aziz from 'material-ui'
// import Delete from 'material-ui-icons/Delete'
// import FileUpload from 'material-ui-icons/FileUpload'
// import Save from 'material-ui-icons/Save';

export default class ItemList extends Component {

    state = {
        search: '',
        _id: '',
        description: '',
        buyer: '',
        expiry: '',
        highbid: '',
        users: [],
        query: 'items'
    }

    formatListItem(item, i) {
        return (
            <aziz.ListItem key={i}>
                {item.description} ({item.seller}, {item.expiry})
                , Bids:
                <span className='Comma'>
                    {(item.bids && item.bids.length !== 0) ? item.bids.map((bid, i) => <span key={i}>{bid.amount} ({bid.username})</span>) : <span>None</span>}
                </span>
                <aziz.ListItemSecondaryAction>
                    {
                        db.user
                        &&
                        db.user._id === item.seller
                        &&
                        <aziz.Button style={{ margin: 3 }} variant='raised' size="small" onClick={() => this.handleDelete(item)}>Delete</aziz.Button>
                    }
                    {
                        db.user
                        &&
                        <aziz.Button style={{ margin: 3 }} variant='raised' size="small" onClick={() => this.handleSelect(item)}>Select</aziz.Button>
                    }
                    <Button style={{ margin: 3 }} variant="raised" color="primary" size="small" component={Link} to={`/items/${item._id}`}>Details</Button>
                </aziz.ListItemSecondaryAction>
            </aziz.ListItem>
        )
    }

    handleSearchItems() {
        this.setState({ _id: '', name: '', email: '', query: 'items/description/' + this.state.search })
    }

    async handleDelete(item) {
        await db.collection('items').deleteOne(item._id)
        this.setState({ _id: '', name: '', email: '' })
    }

    async handleCreate() {
        await db.collection('items').createOne({ description: this.state.description, seller: db.user._id, expiry: this.state.expiry, bids: [] })
        this.setState({ _id: '', description: '', seller: '', expiry: '' })
    }

    async handleUpdate() {
        await db.collection('items').replaceOne(this.state.select._id, { _id: this.state.select._id, description: this.state.description, seller: db.user._id, expiry: this.state.expiry, bids: this.state.bids })
        this.setState({ _id: '', description: '', seller: '', expiry: '' })
    }

    handleSelect(item) {
        this.setState({ select: item, _id: item._id, description: item.description, seller: item.seller, expiry: item.expiry, bids: item.bids })
    }

    render() {
        return (
            <div style={{ padding: 10, backgroundColor: 'linear-gradient(40deg, #e5adff 50%, #4492ff 90%)' }}>
                <h2>Items</h2>
                <aziz.List className='DataList'>
                    {/* <DataList collection={this.props.my ? 'users/' + db.user._id + '/items' : this.state.query} formatListItem={(item, i) => this.formatListItem(item, i)} /> */}
                </aziz.List>
                <p>Queries:</p>
                <aziz.TextField label='Item Name' error aria-describedby="name-error-text" value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
                <aziz.Button style={{ float: 'right' }} color="secondary" variant='raised' onClick={() => this.handleSearchItems()}>Search Items</aziz.Button>
                {
                    db.user
                    &&
                    <div>
                        <p>Operations:</p>
                        <aziz.TextField label='Description' value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
                        <aziz.TextField type='date' label='Expiry' value={this.state.expiry} onChange={e => this.setState({ expiry: e.target.value })} />
                        <aziz.Button style={{ margin: 3, float: 'right' }} color="primary" variant='raised' onClick={() => this.handleUpdate()}>Update</aziz.Button>
                        <aziz.Button style={{ margin: 3, float: 'right' }} color="primary" variant='raised' onClick={() => this.handleCreate()}>Create</aziz.Button>
                    </div>
                }
            </div>
        )
    }
}