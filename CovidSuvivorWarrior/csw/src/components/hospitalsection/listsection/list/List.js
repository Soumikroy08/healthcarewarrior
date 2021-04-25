import { fromLonLat } from 'ol/proj'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './List.module.css'

class List extends Component {
    constructor(props) {
        super(props)
        
    }

    onSelectHospital = (event) => {
        this.props.map.getView().setCenter(fromLonLat([this.props.hospitallon,this.props.hospitallat]))
        this.props.map.getView().setZoom(18)
        this.props.dispatch ({
            type: 'hospitaldetails',
            hospitaldetails: true
        })
        
        this.props.dispatch ({
            type: 'hospitalidselected',
            hospitalidselected: event.currentTarget.id
        })
    }

    render() {
        return (
            <div id={this.props.hospitalid} className={styles.list} onClick={this.onSelectHospital}>
                <div className={styles.listno}>{this.props.hospitalid}</div>
                <div className={styles.hostpital}>
                    <div className={styles.name}>
                        {this.props.hospitalname}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToPros = (state) => {
    return { ...state.map, ...state.hospitaldetails };
  };
  
  export default connect(mapStateToPros)(List)
