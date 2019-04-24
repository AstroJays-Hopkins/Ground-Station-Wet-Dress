import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Button from 'react-uikit-button';
import Dropdown from 'react-dropdown';
import {N2OFile} from './N2O/N2O.js';
import base64 from 'base-64';
import ReactLoading from 'react-loading'
import Popup from 'react-popup'
import AstroJLogo from './AstroJLogo.png';
import SpeedIcon from './SpeedIcon2.png';
import AltiIcon from './AltiIcon1.png';
import test from './N2O/N2O_TDProps_USUnits.txt';
import AnguIcon from './angularIcon.png';
import gpsIcon from './gpsIcon.png'
import all from './all.png';
import ReactSpeedometer from "react-d3-speedometer";
import LineChart from 'react-linechart';
import '../node_modules/react-linechart/dist/styles.css';
import update from 'immutability-helper';

// import ProgressBar from 'react-progress-bar-plus'

// List of GLobal variables
var Columns = require ('react-columns');
const ProgressBar = require('react-progress-bar-plus');

function helpButton (helpButton) {
  alert("To make sure you are seeing the correct readings please connect your ARDUINO to your computer and expose it to PORT11")
}
///gi

class App extends Component {
  constructor(opts){
    super(opts);
    this.state = {

		testData:[
            {
				id: "PTop",
                color: "steelblue",
                points: [{x: .1, y: 200}, {x: .2, y: 500}, {x: .3, y: 200}]
            }
		],
        TempData:[
            {
				id: "Top",
                color: "steelblue",
                points: []
            },
		    {
				id: "Bottom",
                color: "springgreen",
                points: []
            },
			{
				id: "Final Threshold",
				color: "red",
				points: []
			}
        ],

		TempCaution: 21,    //70 F, 21C
		TempThreshold: 24,  //75 F, 24C
		Temp4: 0,
		Temp3: 0,
        Temp2: 0,
        Temp1: 0,
		TempGraphWidth: 100,
        TempDatapoint: 1,
		
		
		
		PTop: 0,
		PBottom: 0,
		P3: 0,
		PDatapoint: 1,
		PressureData:[
            {
				id: "PTop",
                color: "steelblue",
                points: []
            },
		    {
				id: "PBottom",
                color: "springgreen",
                points: []
            }
        ],
		MFueledDPT: 0,

		

		normalCol: '#000000',
		cautionCol: '#ffff00',
		alertCol: '#ff0000',
		currentColTemp1: '#000000',
		currentColTemp2: '#000000',
		currentColTemp3: '#000000',
		currentColTemp4: '#000000',
		
		
		Fueling: 0,
		FuelingColor: '#ffffff',
		FuelingTrueColor: '#ffff00',
		FuelingFalseColor: '#000000',
		
		ResetRelay: 0,
		ResetRelayColor: '#ffffff',
		ResetRelayTrueColor: '#ffff00',
		ResetRelayFalseColor: '#000000',
		
		Ignition: 0,
		IgnitionColor: '#ffffff',
		IgnitionTrueColor: '#ffff00',
		IgnitionFalseColor: '#000000',
		
		Disconnect: 0,
		DisconnectColor: '#ffffff',
		DisconnectTrueColor: '#ffff00',
		DisconnectFalseColor: '#000000',

		RawData: "",
		LCDatapoint: 1,
		LCData:[
            {
				id: "LCAdjusted",
                color: "steelblue",
                points: []
            }
        ],
		
		LCZero: 0,
		LCRaw: 0,
		CritCondition: 0,
		Venting: false,
		VentingColor: '#ffffff',
		VentingTrueColor: '#ffff00',
		VentingFalseColor: '#000000',
		N2OData : [],
		
		BallValve: false,
		BVColor: '#ffffff',
		BVTrueColor: '#ffff00',
		BVFalseColor: '#000000',
		
    };
	this.LCButton = this.LCButton.bind(this);
  }

  //Fetch Telemetry Data
  fetchTelem() {
    console.log('fetchTelem')
    fetch("http://192.168.0.100:5000/getTelem", {headers: new Headers({"Accept": "application/json","Content-Type":"application/json"})}).then(res => { //CHANGE IP IF NECESSARY.
                return res.json();
        }).then(data => {
			this.setState({RawData:JSON.stringify(data)})
			this.setState({Temp1:data.Temp1})
			this.setState({Temp2:data.Temp2})
			this.setState({PTop:data.PTop})
			this.setState({PBottom:data.PBottom})
			this.setState({LCRaw:data.LC1})
			this.setState({Fueling:data.Fueling > 0})
			this.setState({Venting: data.Venting > 0})
			this.setState({Disconnect: data.Disconnect > 0})
			this.setState({ResetRelay: data.ResetRelay > 0})
			this.setState({BallValve: data.BallValve > 0})
			this.setState({Ignition: data.Ignition > 0}) 
		});
	console.log("RAW DATA:" + this.state.RawData);
  }
  
    LCButton () {
   		this.state.LCZero = this.state.LCRaw;
	}


  updateTemp() {
    //console.log('UpdateTemp: ' + this.state.Temp1 + " " + this.state.Temp2)
		
	if(this.state.Temp1 < this.state.TempCaution){this.state.currentColTemp1 = this.state.normalCol};
	if(this.state.Temp1 >= this.state.TempCaution){this.state.currentColTemp1 = this.state.cautionCol;};
    if(this.state.Temp1 > this.state.TempThreshold){this.state.currentColTemp1 = this.state.alertCol;}; 
		
	if(this.state.Temp2 < this.state.TempCaution){this.state.currentColTemp2 = this.state.normalCol};
	if(this.state.Temp2 >= this.state.TempCaution){this.state.currentColTemp2 = this.state.cautionCol;};
    if(this.state.Temp2 > this.state.TempThreshold){this.state.currentColTemp2 = this.state.alertCol;}; 
	
	/*
	if(this.state.Temp3 < 70){this.state.currentColTemp3 = this.state.normalCol};
	if(this.state.Temp3 >= 70){this.state.currentColTemp3 = this.state.cautionCol;};
    if(this.state.Temp3 > 74){this.state.currentColTemp3 = this.state.alertCol;}; 
		
	if(this.state.Temp4 < 70){this.state.currentColTemp4 = this.state.normalCol};
	if(this.state.Temp4 >= 70){this.state.currentColTemp4 = this.state.cautionCol;};
    if(this.state.Temp4 > 74){this.state.currentColTemp4 = this.state.alertCol;}; 
	*/
	
    this.setState(update(this.state,{TempData:{0:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp1}]]}}}}));
    this.setState(update(this.state,{TempData:{1:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp2}]]}}}}));
    //this.setState(update(this.state,{TempData:{2:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp3}]]}}}}));
    //this.setState(update(this.state,{TempData:{3:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp4}]]}}}}));
	this.setState(update(this.state,{TempDatapoint : {$apply:function(x) {return (x+1);}}}));
	
	this.state.TempData[2].points = [{x:this.state.TempDatapoint-10,y:this.state.TempThreshold},{x:this.state.TempDatapoint,y:this.state.TempThreshold}];
	
	if(this.state.TempDatapoint > 11){
		this.state.TempData[0].points = this.state.TempData[0].points.splice(-10);
		this.state.TempData[1].points = this.state.TempData[1].points.splice(-10);
		//this.state.TempData[2].points = this.state.TempData[2].points.splice(-5);
		//this.state.TempData[3].points = this.state.TempData[3].points.splice(-5);
	}
  }
  
	updateBallValve() {
		if(this.state.BallValve){this.state.BVColor = this.state.BVTrueColor}
		else{this.state.BVColor = this.state.BVFalseColor};
	}
  
	updateFueling() {
		if(this.state.Fueling){this.state.FuelingColor = this.state.FuelingTrueColor}
		else{this.state.FuelingColor = this.state.FuelingFalseColor};
	}
  
	updateVenting(){
	  	if(this.state.Venting){this.state.VentingColor = this.state.VentingTrueColor}
		else{this.state.VentingColor = this.state.VentingFalseColor};
	}
  
    updateResetRelay(){
	  	if(this.state.ResetRelay){this.state.ResetRelayColor = this.state.ResetRelayTrueColor}
		else{this.state.ResetRelayColor = this.state.ResetRelayFalseColor};
	}
  
    updateDisconnect(){
	  	if(this.state.Disconnect){this.state.DisconnectColor = this.state.DisconnectTrueColor}
		else{this.state.DisconnectColor = this.state.DisconnectFalseColor};
	}
  
    updateIgnition(){
	  	if(this.state.Ignition){this.state.IgnitionColor = this.state.IgnitionTrueColor}
		else{this.state.IgnitionColor = this.state.IgnitionFalseColor};
	}
	
	updatePressure() {
		this.setState(update(this.state,{PressureData:{0:{points:{$splice:[[this.state.PDatapoint,1,{x:this.state.PDatapoint,y:this.state.PTop}]]}}}}));
		this.setState(update(this.state,{PressureData:{1:{points:{$splice:[[this.state.PDatapoint,1,{x:this.state.PDatapoint,y:this.state.PBottom}]]}}}}));
		//this.setState(update(this.state,{TempData:{2:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp3}]]}}}}));
		//this.setState(update(this.state,{TempData:{3:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp4}]]}}}}));
		this.setState(update(this.state,{PDatapoint : {$apply:function(x) {return (x+1);}}}));
	
		if(this.state.PDatapoint > 10){
			this.state.PressureData[0].points = this.state.PressureData[0].points.splice(-9);
			this.state.PressureData[1].points = this.state.PressureData[1].points.splice(-9);
		//this.state.TempData[2].points = this.state.TempData[2].points.splice(-5);
		//this.state.TempData[3].points = this.state.TempData[3].points.splice(-5);
	}
		/*
		var Patm = 14.6959;
		var PTop = this.state.PTop;
		var PBottom = this.state.PBottom;
		var PVapEst = this.state.PTop + Patm + 2;
		
		console.log("PTOP: " + this.state.PTop);
		var Rin = 3;
		var HTank = 42.3;
		var HTop = 3;
		var HBot = 3;
		var g = 9.81
		
		var VLiqEst = 1;
		var VVapEst = 1;
		var VTank = (Math.PI * Math.pow(Rin,2) * HTank) + ((4.0/3.0)*Math.PI * Math.pow(Rin,3));
		
		var HFill = 0;
		var PVap = 0;
		var pVap = 0;
		var pLiq = 0;
			
		var tol = 1;
		var iteration = 0;
		while(false){
			iteration = iteration + 1;


			var currentIndex = 0;
			for(var i = 1; i < this.state.N2OData.length; i++){
				//console.log("ITERATE: " + i + " " + PVapEst + " " + this.state.N2OData[i][1] + " " + this.state.N2OData[i-1][1]);
				if(this.state.N2OData[i][1] > PVapEst && this.state.N2OData[i-1][1] < PVapEst){
					currentIndex = i;
					break;
				}
			}

			if(currentIndex == 0){
				currentIndex = 1;
			}
			
			var pLiqEst = ((this.state.N2OData[currentIndex-1][2] * (this.state.N2OData[currentIndex][1] - PVapEst)) + (this.state.N2OData[currentIndex][2] * (PVapEst - this.state.N2OData[currentIndex-1][1])))/(this.state.N2OData[currentIndex][1] - this.state.N2OData[currentIndex-1][1]);
			var pVapEst = ((this.state.N2OData[currentIndex-1][3] * (this.state.N2OData[currentIndex][1] - PVapEst)) + (this.state.N2OData[currentIndex][3] * (PVapEst - this.state.N2OData[currentIndex-1][1])))/(this.state.N2OData[currentIndex][1] - this.state.N2OData[currentIndex-1][1]);
		
			var HFillEst = (((PTop - PBottom)/g) + (pVapEst * (HTank + HBot)) + (pLiqEst * HBot))/(pVapEst - pLiqEst);
			
			if(HTank - HFillEst >= Rin){
				VLiqEst = Math.PI * Math.pow(Rin,2) * ((2.0/3.0) * Rin + HFillEst);
				VVapEst = Math.PI * Math.pow(Rin,2) * (HTank - HFillEst - (1/3) * Rin);
			}
			else{
				VLiqEst = Math.PI * ((4/3) * Math.pow(Rin,3) + Math.pow(Rin,2) * (HTank - 2*Rin) - (Math.pow(HTank - HFillEst,2)/3.0) * (3* Rin + HFillEst - HTank));
				VVapEst = (Math.PI / 3.0) * Math.pow(HTank - HFillEst,2) * (3 * Rin + HFillEst - HTank)
			}
			
			var VTankEst = VLiqEst + VVapEst;
		
			console.log("VTANKEST: " + VTankEst);
			console.log((1-tol)*VTank);
			console.log((1+tol)*VTank);
			if( (1-tol)*VTank <= VTankEst && VTankEst <= (1 + tol)*VTank){
				HFill = HFillEst;
				PVap = PVapEst;
				pVap = pVapEst;
				pLiq = pLiqEst;
				this.state.MFueledDPT = (pLiq * VLiqEst) + (pVap * VVapEst);
				console.log("END: " + VTankEst + " " + PVap + " " + pVap + " " + pLiq + " " + this.state.MFueledDPT);
				break;
			}
			else if(VTankEst < (1-tol)*VTank){
				PVapEst = PVapEst * (1 - 0.5 * ((VTankEst - VTank)/VTank));
			}
			else{
				PVapEst = PVapEst * (1 + 0.5 * ((VTankEst - VTank)/VTank));
			}
		}
		*/
	}
  
  updateLC() {
	console.log('UpdateLC')
    this.setState(update(this.state,{LCData:{0:{points:{$splice:[[this.state.LCDatapoint,1,{x:this.state.LCDatapoint,y:this.state.LCRaw-this.state.LCZero}]]}}}}));
	this.setState(update(this.state,{LCDatapoint : {$apply:function(x) {return (x+1);}}}));
	this.setState(update(this.state,{TempGraphWidth : {$apply:function(x) {return (x+50);}}}));
	
	if(this.state.LCDatapoint > 10){
		this.state.LCData[0].points = this.state.LCData[0].points.splice(-10);
	}
  }

  componentDidMount(){
	this.state.N2OData = N2OFile().split("\n");
	for(var i = 0; i < this.state.N2OData.length; i++){
		this.state.N2OData[i] = this.state.N2OData[i].split(",");
	}
	//console.log(this.state.N2OData);
	
	this.interval = setInterval(() => this.updateAll(),200);
  }

  updateAll(){
	this.fetchTelem();
	this.updateTemp();
	this.updateFueling();
	this.updateLC();
	this.updateBallValve();
	this.updatePressure();
	//this.updatePressure();
	this.updateVenting();
	this.updateResetRelay();
	this.updateDisconnect();
	this.updateIgnition();
  }



//WHAT IS RENDERED FOR THE USER TO SEE.

  render() {

    return (
      <div className="App">

        <div className="App-header">
          <img src={AstroJLogo} className="AstroJLogo"/>
          <button onClick = {helpButton} className = "helpButton">
            Help
          </button>
        </div>
        <div className = "title">
          Avionics Telemetry
        </div>
        <div className = "title2">
          Tracking your telemetry readings since today.
        </div>
        <div className = "line1">____________________________________________________________________________________________________________________________</div>

        <div className="Updates">
          Telemetry:
        </div>
		
		<div className = "Updates">
			Raw Data:
		</div>
		<div style={{"text-align":"right"}}>
		{
			<input type="text" name="RawData" value={this.state.RawData} style={{"width":"1000px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold'}} readOnly/>
		}
		</div>
        <div className = "line2">______________________________________________________________________________________________________________</div>

        <div className="App-intro">
        </div>

	<table style={{"borderWidth":"0px", 'borderStyle':'solid', overflow:"auto", "borderTopWidth":"1px"}}>
	<tbody>
	<tr>
		<table width = "100%">
		<tr>
		<td width = "5%">
        	<div className = "title" style={{float:"left"}}>
          		Fueling:
        	</div>
		</td>
		<td width = "5%">
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.FuelingColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		<td width = "15%">
        	<div className = "title" style={{float:"left"}}>
				Disconnect:
        	</div>
		</td>
		<td width = "5%">
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.DisconnectColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		<td width = "15%">
        	<div className = "title" style={{float:"left"}}>
				Ball&nbsp;Valve:
        	</div>
		</td>
		<td width = "45%">
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.BVColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		</tr>
		<tr>
		<td width = "6%" >
        	<div className = "title" style={{float:"left"}}>
				Venting:
        	</div>
		</td>
		<td width = "6%" style={{paddingTop : 20}}>
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.VentingColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		<td width = "16%" style={{paddingTop : 20}}>
        	<div className = "title" style={{float:"left"}}>
				Reset&nbsp;Relay:
        	</div>
		</td>
		<td width = "6%" style={{paddingTop : 20}}>
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.ResetRelayColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		<td width = "16%" style={{paddingTop : 20}}>
        	<div className = "title" style={{float:"left"}}>
				Ignition:
        	</div>
		</td>
		<td width = "6%" style={{paddingTop : 20}}>
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.IgnitionColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		</tr>
		</table>
		<div className = "line2">____________________________________________________________________________________________________________________________</div>
	</tr>
	<tr>
	<td style={{float:"left", position:"left", width:"32%", overflow:"auto", marginRight:"0"}}>
		<table>
			<tr>
				<td>
					<div className = "title" style={{float:"left"}}>
					Temperature
					</div>
				</td>
			</tr>
			<tr>
				<td>
					{
					<LineChart
						id = "TEMP"
						width={350}
						height={400}
						yMax = {'40'}
						yMin = {'-18'}
						yLabel = "C"
						xLabel = "Time: Seconds"
						xDisplay = {((x) => parseFloat(x/10).toFixed(1))}
						xMin = {this.state.TempDatapoint-10}
						xMax = {this.state.TempDatapoint-1}
						data={this.state.TempData}
						pointRadius={1}
						showLegends = "True"
						
					/>
					}
				</td>
				<td>
				{
					<input type="text" name="Temp1" value={"TC1:" + parseFloat(this.state.Temp1).toFixed(2)} style={{"width":"80px",  "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp1}} readOnly/>
				}
				<br></br>
				{
					<input type="text" name="Temp1" value={"TC2:" + parseFloat(this.state.Temp2).toFixed(2)} style={{"width":"80px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp2}} readOnly/>
				}
				</td>
			</tr>
		</table>
	</td>
	<td style={{float:"left", position:"left", width:"32%", overflow:"auto"}}>
		<table>
			<tr>
				<td>
					<div className = "title" style={{float:"left"}}>
						Pressure
					</div>
				</td>
			</tr>
			<tr>
				<td>
					{
					<LineChart
						id = "Pressure"
						width={350}
						height={400}
						yMax = {'1400'}
						yMin = {'0'}
						yLabel = "PSI"
						xLabel = "Time: Seconds"
						xMin = {this.state.PDatapoint-10}
						xDisplay = {((x) => parseFloat(x/10).toFixed(1))}
						xMax = {this.state.PDatapoint-1}
						data={this.state.PressureData}
						showLegends = "True"
						pointRadius={1}
						margins = {{top: 50, right : 0, bottom : 50, left : 0 }}
					/>
					}
				</td>
				<td>
				{
					<input type="text" name="Temp1" value={"PTop: " + parseFloat(this.state.PTop).toFixed(2)} style={{"width": "100px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold'}} readOnly/>
				}
				{
					<input type="text" name="Temp1" value={"PBot: " + parseFloat(this.state.PBottom).toFixed(2)} style={{"width": "100px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold'}} readOnly/>
				}
				</td>
			</tr>
		</table>
	</td>
	<td style={{float:"left", position:"left", width:"30%", overflow:"visible"}}>
		<table>
			<tr>
				<td>
					<div className = "title" style={{float:"left"}}>
					Loadcell
					</div>
				</td>
			</tr>
			<tr>
				<td>
					{
					<LineChart
						id = "LC"
						width={350}
						height={400}
						yMax = {'100'}
						yMin = {'0'}
						xMin = {this.state.LCDatapoint-10}
						xMax = {this.state.LCDatapoint-1}
						xDisplay = {((x) => parseFloat(x/10).toFixed(1))}
						yLabel = "LB"
						xLabel = "Time: Seconds"
						ticks = {10}
						data={this.state.LCData}
						pointRadius={1}
						margins = {{top: 50, right : 0, bottom : 50, left : 0 }}
					/>
					}
				</td>
				<td>
					<table>
					<tr>
					<td>
					{
						<button onClick = {this.LCButton} className = "LCButton" style={{"float":"left"}}>Zero Loadcell</button>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellRaw" value={"Raw: " + parseFloat(this.state.LCRaw).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellZero" value={"Zero: " + parseFloat(this.state.LCZero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellAdjusted" value={"Adjusted: " + parseFloat(this.state.LCRaw - this.state.LCZero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="RemainingNeeded" size="30" value={"NOX To Full: " + parseFloat((35 - (this.state.LCRaw - this.state.LCZero))).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					</table>
				</td>
			</tr>
		</table>
	</td>
	<td>
	</td>
	<td>
	</td>
	</tr>
	</tbody>
	</table>

	</div>
    );
  }
}

export default App;