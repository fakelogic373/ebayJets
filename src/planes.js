import React, { Component } from 'react'
import DataList from './DataList'
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
        _id: '',
        description: '',
        buyer: '',
        expiry: '',
        highbid: '',
        users: [],
        category: '',
        query: 'items'
    }

    formatListItem(item, i) {
        return (
            <ListItem key={i}>

                {(item.imageUrl)
                    ?
                    <img src={item.imageUrl} width="80" height="80" />
                    :
                    "No image"
                }

                {item.name}, {item.description},{item.category},  ({item.seller}, {item.expiry})
                , Bids:
                <span className='Comma'>
                    {(item.bids && item.bids.length !== 0) ? item.bids.map((bid, i) => <span key={i}>{bid.amount} ({bid.username})</span>) : <span>None</span>}
                </span>
                <ListItemSecondaryAction>
                    {
                        db.user
                        &&
                        db.user._id === item.seller
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleDelete(item)}>Delete</Button>
                    }
                    {
                        db.user
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleSelect(item)}>Select</Button>
                    }
                    <Button variant="raised" color="primary" size="small" component={Link} to={`/plane_details/${item._id}`}>View Bids/Details</Button>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    handleSearchItems() {
        this.setState({ _id: '', name: '', email: '', query: 'items/description/' + this.state.search })
    }

    handleSearchByCategory(event) {

        if (event.target.value == "") {
            this.setState({ _id: '', name: '', email: '', query: 'items/' })
        } else {
            this.setState({ _id: '', name: '', email: '', query: 'items/category/' + event.target.value })

        }

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
            <div style={{ padding: 10, backgroundColor: 'pink' }}>
                <h2>Items</h2>
                {
                    db.user
                    &&
                    <Button variant="raised" color="primary" size="small" component={Link} to={`/plane_create`}>Create a new bid </Button>

                }

                <List className='DataList'>
                    <DataList collection={this.props.my ? 'users/' + db.user._id + '/items' : this.state.query} formatListItem={(item, i) => this.formatListItem(item, i)} />
                </List>


                <p>Queries:</p>
                <TextField label='Description' value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
                <br />
                <FormControl >
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={this.state.search}
                        // onChange={e => this.setState({ search: e.target.value })}
                        onChange={e => this.handleSearchByCategory(e)}
                    >
                        <MenuItem value={""}>All</MenuItem>
                        <MenuItem value={"Jet"}>Jets</MenuItem>
                        <MenuItem value={"Helicopter"}>Helicopters</MenuItem>
                        <MenuItem value={"War Planes"}>War Planes</MenuItem>
                        <MenuItem value={"Commercial Planes"}>Commercial Planes</MenuItem>
                        <MenuItem value={"Amphibian Planes"}>Amphibian Planes</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="raised" color="primary" size="small" style={{ float: 'right' }} onClick={() => this.handleSearchItems()}>Search Items</Button>
                <Button variant="raised" color="primary" size="small" style={{ float: 'right' }} onClick={() => this.handleSearchByCategory()}>Search by category</Button>
            </div>
        )
    }
}


export class details extends Component {

    state = {
        amount: '',
        item: null
    }

    componentWillMount() {
        db.setListener('items/' + this.props.match.params._id, this.handleItem)
    }

    componentWillUnmount() {
        db.removeListener(`items/${this.props.match.params._id}`, this.handleItem)
    }

    handleItem = item => this.setState({ item })

    formatListItem(bid, i) {
        return (
            <ListItem key={i}>
                Username: {bid.username}, Amount: {bid.amount}
            </ListItem>
        )
    }

    async handleBid() {
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
            this.state.item
            &&
            <div style={{ padding: 10, backgroundColor: 'lightblue' }}>
                <h2>{this.state.item.description}'s Bids</h2>
                <List className='DataList'>
                    <DataList collection={'items/' + this.state.item._id + '/bids'} formatListItem={(bid, i) => this.formatListItem(bid, i)} />
                </List>
                <p>Operations:</p>
                {
                    db.user
                        ?
                        <TextField type='number' placeholder='Your Bid' value={this.state.amount} onChange={e => this.setState({ amount: e.target.value })} />
                        :
                        <p></p>
                }



                {
                    db.user
                    &&
                    <Button variant="raised" color="primary" size="small" style={{ margin: 3, float: 'right' }} onClick={() => this.handleBid()}>Create a bid</Button>
                }

            </div>
        )
    }
}


export class create extends Component {

    state = {
        search: '',
        _id: '',
        description: '',
        buyer: '',
        expiry: '',
        highbid: '',
        users: [],
        query: 'items',
        name: '',
        imageUrl: '',
        category: ''
    }

    formatListItem(item, i) {
        return (
            <ListItem key={i}>
                {item.description} ({item.seller}, {item.expiry})
                , Bids:
                <span className='Comma'>
                    {(item.bids && item.bids.length !== 0) ? item.bids.map((bid, i) => <span key={i}>{bid.amount} ({bid.username})</span>) : <span>None</span>}
                </span>
                <ListItemSecondaryAction>
                    {
                        db.user
                        &&
                        db.user._id === item.seller
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleDelete(item)}>Delete</Button>
                    }
                    {
                        db.user
                        &&
                        <Button variant="raised" color="primary" size="small" onClick={() => this.handleSelect(item)}>Select</Button>
                    }
                    <Button variant="raised" color="primary" size="small" component={Link} to={`/items/${item._id}`}>Details</Button>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }



    async handleCreate() {
        await db.collection('items').createOne({ name: this.state.name, description: this.state.description, category: this.state.category, imageUrl: this.state.imageUrl, seller: db.user._id, expiry: this.state.expiry, bids: [] })
        this.setState({ _id: '', description: '', seller: '', expiry: '' })
    }



    render() {
        return (
            <div style={{ padding: 10, backgroundColor: 'pink' }}>
                {
                    db.user
                    &&
                    <div>
                        <p>Add a new bid:</p>
                        <TextField label='Name' value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                        <br />
                        <TextField label='Description' value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
                        <br />
                        <TextField type='date' label='Expiry' value={this.state.expiry} onChange={e => this.setState({ expiry: e.target.value })} />
                        <br />
                        <FormControl >
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={this.state.category}
                                onChange={e => this.setState({ category: e.target.value })}
                            >
                                <MenuItem value={"Jet"}>Jet</MenuItem>
                                <MenuItem value={"Helicopter"}>Helicopter</MenuItem>
                                <MenuItem value={"War Planes"}>War Planes</MenuItem>
                                <MenuItem value={"Commercial Planes"}>Commercial Planes</MenuItem>
                                <MenuItem value={"Amphibian Planes"}>Amphibian Planes</MenuItem>
                            </Select>
                        </FormControl>

                        <br />


                        <TextField label='ImageUrl' value={this.state.imageUrl} onChange={e => this.setState({ imageUrl: e.target.value })} />
                        <br />
                        <Button variant="raised" color="primary" size="small" style={{ margin: 3, float: 'right' }} onClick={() => this.handleCreate()} component={Link} to='/planes'>Create</Button>
                    </div>
                }
            </div>
        )
    }
}