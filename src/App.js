import React from 'react';
import _ from 'lodash'
import logo from './logo.svg';
import './App.css';
import API from './api'

import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
// import DatePicker from 'react-datepicker'
import {Container, ProgressBar, Form, Button} from 'react-bootstrap'

const coords = {
  lat: 51.5258541,
  lng: -0.08040660000006028
};

const params = {v: '3.exp', key: 'AIzaSyDKrgZWOqV-PAI_Rin5RR_TcajiHHhqla8'};

class App extends React.Component {

  constructor(props){
        super(props)
        this.state = {data: null, isLoading: false}
        this.fetch_coords = this.fetch_coords.bind(this)
        this.onMapCreated = this.onMapCreated.bind(this)
        this.onDragEnd = this.onDragEnd.bind(this)
        this.onCloseClick = this.onCloseClick.bind(this)
        this.onClick = this.onClick.bind(this)
        
        this.starttime_input = React.createRef()
        this.endtime_input = React.createRef()
  }
  componentDidMount(){
      this.fetch_coords()
  }
  fetch_coords(){
    this.setState(state => ({data: state.data, isLoading: true}))
    const starttime = this.starttime_input.current.value.trim() || "2014-01-01"
    const endtime = this.endtime_input.current.value.trim() || "2014-01-02"
    console.log(starttime, endtime)
    API.get('fdsnws/event/1/query', {params: {
        format: 'geojson',
        starttime,
        endtime
    }})
      .then(res => { 
          this.setState(state => ({
              isLoading: false,
              data: _.map(res.data.features, e => e.geometry.coordinates)
          }))
      })
      .catch(err => {
          console.log(err)
          this.setState(state => ({data: state.data, isLoading: false}))
      })
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  onCloseClick() {
    console.log('onCloseClick');
  }

  onClick(e) {
    console.log('onClick', e);
  }

  render() {
    return (<div>
      { this.state.isLoading ? <div><ProgressBar animated now={100} /></div> : <div />}
      <Container className="pt-5"><Form><Form.Group>
        <Form.Label>Start Date</Form.Label>
        <Form.Control ref={this.starttime_input} placeholder="2014-01-01"/>
        <Form.Label>End Date</Form.Label>
       <Form.Control ref={this.endtime_input} placeholder="2014-01-02"/></Form.Group>
      <Form.Group><Button onClick={() => this.fetch_coords()}>Update</Button></Form.Group>
      <Form.Group><Gmaps
        width={'800px'}
        height={'600px'}
        lat={coords.lat}
        lng={coords.lng}
        zoom={1}
        loadingMessage={'Be happy'}
        params={params}
        onMapCreated={this.onMapCreated}>
        {
            _.map(this.state.data, e =>
                <Marker
                    lat={e[1]}
                    lng={e[0]}
                    draggable={true}
                    onDragEnd={this.onDragEnd} 
                />
            )
        }
        <InfoWindow
          lat={coords.lat}
          lng={coords.lng}
          content={'Hello, React :)'}
          onCloseClick={this.onCloseClick} />
        <Circle
          lat={coords.lat}
          lng={coords.lng}
          radius={500}
          onClick={this.onClick} />
      </Gmaps></Form.Group></Form></Container></div>
    );
  }

};

export default App;
