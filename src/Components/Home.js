import React, { Component } from 'react'
import QuickSearch from './QuickSearches'
import Wallpaper from './Wallpaper'
import axios from 'axios';


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
        sessionStorage.clear();
        axios({
            method: 'GET',
            url: 'https://fast-shelf-50258.herokuapp.com/locations',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ locations: response.data.locations })
            })
            .catch()

        axios({
            method: 'GET',
            url: 'https://fast-shelf-50258.herokuapp.com/mealtypes',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ mealtypes: response.data.mealtypes })
            })
            .catch()
    }

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <div>
                <Wallpaper locationsData={locations} />
                <QuickSearch mealtypesData={mealtypes} />
            </div>
        )
    }
}

export default Home;