import React, { Component } from "react";
import styles from "./MapSection.module.css";
import OLMap from './map/OLMap';
import { connect } from "react-redux";
import { fromLonLat } from "ol/proj";
import Popover from "../../popover/Popover";

class MapSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      districts: [],
      cities: [],
      selectedLonLat: [92.9376, 26.2006],
      vaccineregistration: false
    };
  }

  componentDidMount () {
    this.onLoadStates()
    
    this.props.dispatch({
      type: 'busyindicator',
      busyindicator: true
    })
    fetch(process.env.REACT_APP_SERVICE_URL + '/getHospitals')
        .then(response => response.text())
        .then(data => {
          this.props.dispatch({
            type: 'busyindicator',
            busyindicator: false
          })
            this.setState({
                hospitals: JSON.parse(data).data
            })
            this.props.dispatch({
                type: 'hospitals',
                hospitals: JSON.parse(data).data
            })
            this.props.dispatch({
              type: 'busyindicator',
              busyindicator: false
            })
            
        });

  }

  onLoadStates = () => {
    fetch(process.env.REACT_APP_SERVICE_URL + '/getStates')
    .then(response => response.text())
    .then(data => {
        
        this.setState({
            states: JSON.parse(data).data,
            selectedLonLat: [JSON.parse(data).data[0].statelon, JSON.parse(data).data[0].statelat]  
        })
    });
  }

  onSelectState = () => {
    let selectedState = document.getElementById("statefilter").value
    
    let stateLon = parseFloat(this.state.states.filter(obj => (obj.statename == selectedState))[0].statelon)
    let stateLat = parseFloat(this.state.states.filter(obj => (obj.statename == selectedState))[0].statelat)
    
    this.props.map.getView().setCenter(fromLonLat([stateLon,stateLat]))
    this.props.map.getView().setZoom(8)

    let stateid = this.state.states.filter(obj => (obj.statename == selectedState))[0].stateid
    this.onLoadDistricts(stateid)
    this.onLoadHospitals("ByState", selectedState)
    this.onLoadStateWiseCovidData(selectedState)
    this.onLoadBedsDetails("state",selectedState)
  }

  onLoadDistricts = (stateid) => {
    fetch(process.env.REACT_APP_SERVICE_URL + '/getDistricts?stateid='+stateid)
    .then(response => response.text())
    .then(data => {
        this.setState({
            districts: JSON.parse(data).data
        })
    });
  }

  onLoadStateWiseCovidData = (state) => {
    fetch(process.env.REACT_APP_SERVICE_URL + '/getStateWiseCovidData?state=' + state)
    .then(response => response.text())
    .then(data => {
      
        this.props.dispatch({
            type: 'totalactivecases',
            totalactivecases: JSON.parse(data).TotalActive,
        })
        this.props.dispatch({
            type: 'totalrecoveredcases',
            totalrecoveredcases: JSON.parse(data).TotalRecovered,
        })
        this.props.dispatch({
            type: 'totaldeceasedcases',
            totaldeceasedcases: JSON.parse(data).TotalDeaths,
        })
    });
}

  onSelectDistrict = () => {
    let selectedDistrict = document.getElementById("districtfilter").value
    
    let districtLon = parseFloat(this.state.districts.filter(obj => (obj.districtname == selectedDistrict))[0].districtlon)
    let districtLat = parseFloat(this.state.districts.filter(obj => (obj.districtname == selectedDistrict))[0].districtlat)
    
    this.props.map.getView().setCenter(fromLonLat([districtLon,districtLat]))
    this.props.map.getView().setZoom(12)

    let districtid = this.state.districts.filter(obj => (obj.districtname == selectedDistrict))[0].districtid
    this.onLoadCities(districtid)
    this.onLoadHospitals("ByDistrict", selectedDistrict)

    let selectedState = document.getElementById("statefilter").value
    this.onLoadDistrictWiseCovidData(selectedState, selectedDistrict)

    this.onLoadBedsDetails("district",selectedDistrict)
  }

  onLoadCities = (districtid) => {
    fetch(process.env.REACT_APP_SERVICE_URL + '/getCities?districtid='+districtid)
    .then(response => response.text())
    .then(data => {
        this.setState({
            cities: JSON.parse(data).data
        })
    });
  }

  onLoadDistrictWiseCovidData = (selectedState, selectedDistrict) => {
    fetch(process.env.REACT_APP_SERVICE_URL + '/getDistrictWiseCovidData?state='+ selectedState + '&district=' + selectedDistrict)
    .then(response => response.text())
    .then(data => {
      
        this.props.dispatch({
            type: 'totalactivecases',
            totalactivecases: JSON.parse(data).TotalActive,
        })
        this.props.dispatch({
            type: 'totalrecoveredcases',
            totalrecoveredcases: JSON.parse(data).TotalRecovered,
        })
        this.props.dispatch({
            type: 'totaldeceasedcases',
            totaldeceasedcases: JSON.parse(data).TotalDeaths,
        })
    });
}

onLoadBedsDetails = (filterby, value) => {
  fetch(process.env.REACT_APP_SERVICE_URL + '/getBedsDetails?filterby=' + filterby + '&value=' + value)
        .then(response => response.text())
        .then(data => {
          
            this.props.dispatch({
                type: 'totalbedsoccupied',
                totalbedsoccupied: JSON.parse(data).BedsOccupied,
            })
            this.props.dispatch({
                type: 'totalbedsvacant',
                totalbedsvacant: JSON.parse(data).BedsVacant,
            })
            
        });
}

  onSelectCity = () => {
    let selectedCity = document.getElementById("cityfilter").value
    
    let cityLon = parseFloat(this.state.cities.filter(obj => (obj.cityname == selectedCity))[0].citylon)
    let cityLat = parseFloat(this.state.cities.filter(obj => (obj.cityname == selectedCity))[0].citylat)
    
    this.props.map.getView().setCenter(fromLonLat([cityLon,cityLat]))
    this.props.map.getView().setZoom(14)

    this.onLoadHospitals("ByCity", selectedCity)

    this.onLoadBedsDetails("city",selectedCity)
  }

  onLoadHospitals = (endPoint, filterValue) => {

    this.props.dispatch({
      type: 'busyindicator',
      busyindicator: true
    })

    let endPointFilterParam = "hospital" + (endPoint.substr(2)).toLowerCase()
    fetch(process.env.REACT_APP_SERVICE_URL + '/getHospital' + endPoint + "?" + endPointFilterParam + "=" + filterValue)
        .then(response => response.text())
        .then(data => {
          this.props.dispatch({
            type: 'busyindicator',
            busyindicator: false
          })
            this.setState({
                hospitals: JSON.parse(data).data
            })
            this.props.dispatch({
                type: 'hospitals',
                hospitals: JSON.parse(data).data
            })
            
        });
  }

  onRegisterForVaccine = () => {
    this.setState({
        vaccineregistration: !this.state.vaccineregistration
    })
  }

  render() {
    return (
      <div className={styles.mapsection}>
        <div className={styles.filtersection}>
          <select id="statefilter" className={styles.filter} onChange={this.onSelectState} >
            {this.state.states.map((obj) => {
              return <option>{obj.statename}</option>;
            })}
          </select>
          <select id="districtfilter" className={styles.filter} onChange={this.onSelectDistrict}>
            {this.state.districts.map((obj) => {
              return <option>{obj.districtname}</option>;
            })}
          </select>
          <select id="cityfilter" className={styles.filter} onChange={this.onSelectCity}>
            {this.state.cities.map((obj) => {
              return <option>{obj.cityname}</option>;
            })}
          </select>
        </div>
        <OLMap selectedLonLat={this.state.selectedLonLat}/>
        <div className={styles.registerbutton} onClick={this.onRegisterForVaccine}>Register For Vaccine</div>
        {this.state.vaccineregistration && <Popover/>}
      </div>
    );
  }
}

const mapStateToPros = (state) => {
    return { ...state.map }
  }
  
export default connect(mapStateToPros)(MapSection)