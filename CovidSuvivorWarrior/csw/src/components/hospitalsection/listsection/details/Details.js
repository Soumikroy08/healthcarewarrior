import React, { Component } from "react";
import styles from "./Details.module.css";
import hospitalicon from "../../../../images/hospitalicon.png";
import { connect } from "react-redux";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitalname: "NA",
      hospitaladd: "NA",
      hospitalcapacity: "NA",
      covidpatients: "NA",
      otherpatients: "NA",
      bedsavailable: "NA",
      contactpersonname: "NA",
      contactpersonnumber: "NA",
    };
  }

  componentDidMount() {
    fetch(
      "http://localhost:5000/getHospitalById?hospitalid=" +
        this.props.hospitalidselected
    )
      .then((response) => response.text())
      .then((data) => {
        let hospital = JSON.parse(data).data;

        this.setState({
          hospitalname: hospital[0].hospitalname,
          hospitaladd: hospital[0].hospitaladd,
          hospitalcapacity: hospital[0]["hospitalcapacity"],
          covidpatients: hospital[0].covidpatients,
          otherpatients: hospital[0].otherpatients,
          bedsavailable: hospital[0].bedsavailable,
          contactpersonname: hospital[0].contactpersonname,
          contactpersonnumber: hospital[0].contactpersonnumber,
        });
      });
  }

  onGoBack = () => {
    this.props.dispatch ({
        type: 'hospitaldetails',
        hospitaldetails: false
    })
  }

  render() {
    return (
      <div className={styles.hospitaldetails}>
        <div className={styles.headersection}>
          <img src={hospitalicon} />
          <div className={styles.headers}>
            <div className={styles.title}>{this.state.hospitalname}</div>
            <div className={styles.area}>{this.state.hospitaladd}</div>
          </div>
        </div>
        <div className={styles.information}>
          <div className={styles.labelsection}>
            <div className={styles.labels}>Total Capacity</div>
            <div className={styles.labels}>Covid Patients</div>
            <div className={styles.labels}>Other Patients</div>
            <div className={styles.labels}>Beds Available</div>
            <div className={styles.labels}>Contact Person</div>
          </div>
          <div className={styles.valuessection}>
            <div className={styles.values}>{this.state.hospitalcapacity}</div>
            <div className={styles.values}>{this.state.covidpatients}</div>
            <div className={styles.values}>{this.state.otherpatients}</div>
            <div className={styles.values}>{this.state.bedsavailable}</div>
            <div className={styles.values}>{this.state.contactpersonname}</div>
            <div className={styles.values}>
              {this.state.contactpersonnumber}
            </div>
          </div>
        </div>
        <div className={styles.buttonsection}>
          <div className={styles.bluebutton} onClick={this.onBookBed}>
            Book a Bed
          </div>
          <div className={styles.whitebutton} onClick={this.onGoBack}>
            Go Back
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToPros = (state) => {
  return { ...state.map, ...state.dashboard };
};

export default connect(mapStateToPros)(Details);
