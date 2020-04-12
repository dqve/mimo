import React, {Component} from 'react';
import {DateTime} from 'luxon';
import Modal from 'react-modal';
import Popover from 'react-awesome-popover';
import { Motion, spring } from 'react-motion';
import FadeIn from 'react-fade-in';
import './App.css';
import './quest-and-load.css';

const NAME_LS = 'NAME_LS';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    opacity: '20',
    overlay: {
      background: 'black',
      zIndex: 1000,
      opacity: '8'
    }
  }
};

class Elijah extends Component {
  constructor() {
    super();

    var time = this.getTime();

    this.state = {
      time,
      name: '',
      isNameRequired: false,
      salutation: this.determineSalutation(time.hour),
      isLoading: false,
      quote: null,
      verse: null,
      version: null,
      geolocation: {
        latitude: null,
        longitude: null
      },
      location: null,
      temperature: null,
      weatherAPIKey: '594d083c4f45203a1d8cf6c1f7dd0a0b',
      weatherIcon: null,
      modalIsOpen: false,
      inputValue: ''
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({name: this.state.inputValue});
    localStorage.setItem(NAME_LS, this.state.inputValue);
  }

  handleChange(e) {
    this.setState({inputValue: e.target.value});
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      position =>
        this.setState(
          {
            geolocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          },
          () => this.updateWeather()
        ),
      () => {
        throw 'Error occured!';
      }
    );
    Modal.setAppElement('body');
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    const name = localStorage.getItem(NAME_LS);
    if (name) {
      this.setState({name});
    } else {
      this.setState({modalIsOpen: true});
    }

    fetch('https://beta.ourmanna.com/api/v1/get/?format=json&order=random')
      .then(resp => resp.json())
      .then(resp => this.setState({quote: resp.verse.details.text, verse: resp.verse.details.reference, version: resp.verse.details.version, isLoading: false}));

    /*fetch('https://beta.ourmanna.com/api/v1/get/?format=json&order=random')
      .then(resp => resp.json())
      .then(data => this.setState({verse: data.verse.details.reference}));*/

    setInterval(() => {
      var time = DateTime.local();
      this.setState({
        time,
        salutation: this.determineSalutation(time.hour)
      });
    }, 1000 * 1);
  }

  determineSalutation(hour) {
    if (hour > 11 && hour < 19) {
      return 'afternoon';
    } else if (hour > 18) {
      return 'evening';
    } else {
      return 'morning';
    }
  }

  determineWeatherCondition(str) {
    switch (str) {
      case 'Rain':
        return 'wi-day-rain';
      case 'Thunderstorm':
        return 'wi-day-thunderstorm';
      case 'Drizzle':
        return 'wi-day-showers';
      case 'Extreme':
        return 'wi-day-snow-thunderstorm';
      case 'Snow':
        return 'wi-day-snow';
      case 'Clouds':
        return 'wi-day-cloudy';
      case 'Clear':
        return 'wi-day-sunny';
      case 'Haze':
        return 'wi-day-haze';
      case 'Atmosphere':
        return 'wi-dust';
      default:
        return null;
    }
  }

  updateWeather() {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?APPID=${
        this.state.weatherAPIKey
      }&lat=${this.state.geolocation.latitude}&lon=${
        this.state.geolocation.longitude
      }`
    )
      .then(resp => resp.json())
      .then(resp =>
        this.setState({
          location: resp.name,
          temperature: Math.round(resp.main.temp - 273.15),
          weatherIcon: this.determineWeatherCondition(resp.weather[0].main),
          weatherType: resp.weather[0].main
        })
      );
  }

  getTime() {
    return DateTime.local();
  }

  getBGStyle(category = 'black%20and%20white%20christian%20worship') {
    return {
      backgroundImage: `url(https://source.unsplash.com/2560x1600/daily?${category})`,
      backgroundSize: 'cover',
      height: '100vh'
    }
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return <div class="body"><div class="lds-ripple"><div></div><div></div></div></div>;
    }

    return (
      
      <div style={this.getBGStyle(this.state.category)}>
      
        <div className="bg-wrapper">
        <FadeIn delay={25}>
        <div className="text-right top-right weather">
        <Popover className="top-right" action="hover" placement="bottom-center" overlayColor="none" arrowProps={{ style: { opacity: "0" } }}>
          <div className="text-right top-right weather">
            <div>
              <i className={`wi ${this.state.weatherIcon}`} />&nbsp;<span id="weather" />
              {this.state.temperature}&#730;
            </div>
            <h5 id="location">{this.state.location}</h5>
          </div>
         <p className="cont bla">{this.state.weatherType}</p>
    </Popover>
    </div>
          <div className="text-left top-left">
          <div id="vc-text">
           <Popover placement="bottom-center" overlayColor="rgba(0,0,0,0.1)" overlayOpacity="0.3" arrowProps={{ style: { color: "darkGrey", opacity: "0.4" } }}>
    <a role="button">
    <Popover action="hover" placement="bottom-center" overlayColor="none" arrowProps={{ style: { opacity: "0" } }}>
      <h6><i class="fa fa-bookmark-o"></i> Verse control{" "}</h6>
    <p className="cont bla">Settings available on pro</p>
    </Popover>
    </a>
   <Motion defaultStyle={{ opacity: 5 }} style={{ opacity: spring(1) }}>
      {style => {  
        return (
         <div className="verse-content black">
         <a href="#" className="link"><Popover action="hover" placement="bottom-center" overlayColor="none" arrowProps={{ style: { opacity: "0" } }}>
      <b><i class="fa fa-book"></i>  Version</b>
      <p className="cont bla">Settings available on pro</p>
    </Popover></a>
                <br/>
                <a href="#" className="link"><b><i class="fa fa-calendar-check-o"></i>  Reading plans</b></a>
                <br/><br/>
                <a href="#" className="link"><b><td><i class="fa fa-cubes"></i></td><td>Category</td></b></a>
                <br/><br/>
                <a href="#" className="link"><b><td><i class="fa fa-bookmark"></i></td>  <td>   Favorites</td></b></a>
                <br/>
              </div>
               );
      }}
      </Motion>
      </Popover>
            </div>
          </div>
          <div className="text-center centered">
            <div className="block-text">
              <h1 id="time">{this.state.time.toFormat("h':'mm")}</h1>
              <h2 id="ampm">{this.state.time.toFormat('a')}</h2>
            </div>
            <h3 id="greetings">
              Good {this.state.salutation}, {this.state.name}
            </h3>
            <Modal
              isOpen={this.state.modalIsOpen}
              style={customStyles}
              contentLabel="name-modal"
              transparent={true}
              backgroundOpacity = "8"
            >
             <input type="text" name="name" class="question" id="nme" required autocomplete="off" 
             onChange={this.handleChange} 
             />
  <label for="nme"><span class="first">What's your name?</span><i class="fa fa-arrow-right go" onClick={this.closeModal}></i></label>&nbsp;
            </Modal>
          </div>
          <div className="text-center bottom-third quote">
            <div id="quote-text">"{this.state.quote}" - {this.state.verse}<span class="version">    &copy;{this.state.version}</span> 
             </div>
          </div>
          
        <div className="text-right bottom-right">
          <div id="settings-text">
           <Popover placement="top-center" overlayColor="rgba(0,0,0,0.1)" overlayOpacity="0.3" arrowProps={{ style: { color: "darkGrey", opacity: "0.4" } }}>
    <a role="button">
    <Popover action="hover" placement="auto" overlayColor="none" arrowProps={{ style: { opacity: "0" } }}>
      <h6><i class="fa fa-cog"></i>Settings{" "}</h6>
      <p className="cont bla">Settings coming soon</p>
      </Popover>
    </a>
   <Motion defaultStyle={{ opacity: 5 }} style={{ opacity: spring(1) }}>
      {style => {  
        return (
         <div className="content black">
         <a href="#" className="link"><Popover action="hover" placement="auto" overlayColor="none" arrowProps={{ style: { opacity: "0" } }}>
      <b><i class="fa fa-wrench"></i> General</b>
      <p className="cont bla">Settings coming soon</p>
    </Popover></a>
                <br/>
                <a href="#" className="link"><b><i class="fa fa-file-photo-o"></i> Photos</b></a>
                <br/><br/>
                <a href="#" className="link"><b><i class="fa fa-cloud"></i> Weather</b></a>
                <br/><br/>
                <span className="pro"><a href="#" class="pro"><b><i class="fa fa-arrow-circle-up"></i> Go pro</b></a></span>
                <br/>
              </div>
               );
      }}
      </Motion>
      </Popover>
            </div>
          </div>
          </FadeIn>
        </div>
        
      </div>
      
    );
  }
}

export default Elijah;