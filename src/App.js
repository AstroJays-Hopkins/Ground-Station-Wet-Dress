import React, {Component} from 'react';
import './App.css';
import {N2OFile} from './N2O/N2O.js';
import AstroJLogo from './AstroJLogo.png';
//import test from './N2O/N2O_TDProps_USUnits.txt';
import LineChart from 'react-linechart';
import '../node_modules/react-linechart/dist/styles.css';
import update from 'immutability-helper';

// import ProgressBar from 'react-progress-bar-plus'

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
				id: "P1",
                color: "steelblue",
                points: [{x: .1, y: 200}, {x: .2, y: 500}, {x: .3, y: 200}]
            }
		],
        TempData:[
            {
				id: "TC-C1",
                color: "steelblue",
                points: []
            },
		    {
				id: "TC-C2",
                color: "springgreen",
                points: []
            },
            {
				id: "TC-C3",
                color: "wheat",
                points: []
            },
		    {
				id: "TC-R2",
                color: "violet",
                points: []
            },
            {
				id: "TC-R1",
                color: "forestgreen",
                points: []
            },
		    {
				id: "TC-R3",
                color: "gold",
                points: []
            }
        ],

		TempCaution: 21,    //70 F, 21C
		TempThreshold: 24,  //75 F, 24C
		Temp6: 0,
		Temp5: 0,
		Temp4: 0,
		Temp3: 0,
        Temp2: 0,
        Temp1: 0,
		TempGraphWidth: 100,
        TempDatapoint: 1,
		
		
		PressureThreshold: 800,
		P1: 0,
		P2: 0,
		P3: 0,
		PDatapoint: 1,
		PressureData:[
            {
				id: "PT-C1",
                color: "steelblue",
                points: []
            },
		    {
				id: "PT-R1",
                color: "springgreen",
                points: []
            },
			{
				id: "PT-R2",
                color: "wheat",
                points: []
            },
			{
				id: "Final Threshold",
				color: "red",
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
		currentColTemp5: '#000000',
		currentColTemp6: '#000000',
			
		currentColP1: '#000000',
		currentColP2: '#000000',
		currentColP3: '#000000',			
		
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
		LCMassDatapoint: 1,
		LCMassData:[
            {
				id: "LCMassAdjusted",
                color: "steelblue",
                points: []
            }
        ],
		
		LCMassZero: 0,
		LCMassRaw: 0,
		
		LCThrustDatapoint: 1,
		LCThrustData:[
            {
				id: "LC-C1",
                color: "steelblue",
                points: []
            },           
			{
				id: "LC-C2",
                color: "springgreen",
                points: []
            },
        ],
		
		LCThrust1Zero: 0,
		LCThrust1Raw: 0,
		LCThrust2Zero: 0,
		LCThrust2Raw: 0,
		CritCondition: 0,
		Venting: false,
		VentingColor: '#ffffff',
		VentingTrueColor: '#ffff00',
		VentingFalseColor: '#000000',
		N2OData : [],
		
		BallValveMoving: false,
		BallValve: false,
		BVColor: '#ffffff',
		BVMovingColor: '#ffffff',
		BVTrueColor: '#ffff00',
		BVFalseColor: '#000000',
		
    };
	this.LCMassButton = this.LCMassButton.bind(this);
	this.LCThrust1Button = this.LCThrust1Button.bind(this);
	this.LCThrust2Button = this.LCThrust2Button.bind(this);
  }

  //Fetch Telemetry Data
  fetchTelem() {
    //console.log('fetchTelem')
    fetch("http://192.168.1.101:5000/getTelem", {headers: new Headers({"Accept": "application/json","Content-Type":"application/json"})}).then(res => { //CHANGE IP IF NECESSARY.
                return res.json();
        }).then(data => {
			this.setState({RawData:JSON.stringify(data)})
			this.setState({Temp1:data.Temp1})
			this.setState({Temp2:data.Temp2})
			this.setState({Temp3:data.Temp3})
			this.setState({Temp4:data.Temp4})
			this.setState({Temp5:data.Temp5})
			this.setState({Temp6:data.Temp6})
			this.setState({P1:data.P1})
			this.setState({P2:data.P2})
			this.setState({P3:data.P3})
			this.setState({LCMassRaw:data.LC1})
			this.setState({LCThrust1Raw:data.LC2})
			this.setState({LCThrust2Raw:data.LC3})
			this.setState({Fueling:data.Fueling > 0})
			this.setState({Venting: data.Venting > 0})
			//this.setState({Disconnect: data.Disconnect > 0})
			this.setState({BallValveMoving: data.BallValveMoving > 0})
			//this.setState({ResetRelay: data.ResetRelay > 0})
			this.setState({BallValve: data.BallValve > 0})
			//this.setState({Ignition: data.Ignition > 0}) 
		});
	console.log("RAW DATA:" + this.state.RawData);
  }
  
    LCMassButton () {
   		this.state.LCMassZero = this.state.LCMassRaw;
	}
	
	LCThrust1Button () {
   		this.state.LCThrust1Zero = this.state.LCThrust1Raw;
	}
	
	LCThrust2Button () {
   		this.state.LCThrust2Zero = this.state.LCThrust2Raw;
	}


  updateTemp() {
    //console.log('UpdateTemp: ' + this.state.Temp1 + " " + this.state.Temp2)
	
	/*
	if(this.state.Temp1 < this.state.TempCaution){this.state.currentColTemp1 = this.state.normalCol};
	if(this.state.Temp1 >= this.state.TempCaution){this.state.currentColTemp1 = this.state.cautionCol;};
    if(this.state.Temp1 > this.state.TempThreshold){this.state.currentColTemp1 = this.state.alertCol;}; 
		
	if(this.state.Temp2 < this.state.TempCaution){this.state.currentColTemp2 = this.state.normalCol};
	if(this.state.Temp2 >= this.state.TempCaution){this.state.currentColTemp2 = this.state.cautionCol;};
    if(this.state.Temp2 > this.state.TempThreshold){this.state.currentColTemp2 = this.state.alertCol;}; 
	
	if(this.state.Temp3 < this.state.TempCaution){this.state.currentColTemp3 = this.state.normalCol};
	if(this.state.Temp3 >= this.state.TempCaution){this.state.currentColTemp3 = this.state.cautionCol;};
    if(this.state.Temp3 > this.state.TempThreshold){this.state.currentColTemp3 = this.state.alertCol;}; 
		
	if(this.state.Temp4 < this.state.TempCaution){this.state.currentColTemp4 = this.state.normalCol};
	if(this.state.Temp4 >= this.state.TempCaution){this.state.currentColTemp4 = this.state.cautionCol;};
    if(this.state.Temp4 > this.state.TempThreshold){this.state.currentColTemp4 = this.state.alertCol;}; 
	
	if(this.state.Temp5 < this.state.TempCaution){this.state.currentColTemp5 = this.state.normalCol};
	if(this.state.Temp5 >= this.state.TempCaution){this.state.currentColTemp5 = this.state.cautionCol;};
    if(this.state.Temp5 > this.state.TempThreshold){this.state.currentColTemp5 = this.state.alertCol;}; 
		
	if(this.state.Temp6 < this.state.TempCaution){this.state.currentColTemp6 = this.state.normalCol};
	if(this.state.Temp6 >= this.state.TempCaution){this.state.currentColTemp6 = this.state.cautionCol;};
    if(this.state.Temp6 > this.state.TempThreshold){this.state.currentColTemp6 = this.state.alertCol;}; 
	*/
	
    this.setState(update(this.state,{TempData:{0:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp1}]]}}}}));
    this.setState(update(this.state,{TempData:{1:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp2}]]}}}}));
    this.setState(update(this.state,{TempData:{2:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp3}]]}}}}));
    this.setState(update(this.state,{TempData:{3:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp4}]]}}}}));
    this.setState(update(this.state,{TempData:{4:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp5}]]}}}}));
    this.setState(update(this.state,{TempData:{5:{points:{$splice:[[this.state.TempDatapoint,1,{x:this.state.TempDatapoint,y:this.state.Temp6}]]}}}}));
	
	this.setState(update(this.state,{TempDatapoint : {$apply:function(x) {return (x+1);}}}));
	
	//this.state.TempData[6].points = [{x:this.state.TempDatapoint-10,y:this.state.TempThreshold},{x:this.state.TempDatapoint,y:this.state.TempThreshold}];
	
	if(this.state.TempDatapoint > 11){
		this.state.TempData[0].points = this.state.TempData[0].points.splice(-10);
		this.state.TempData[1].points = this.state.TempData[1].points.splice(-10);
		this.state.TempData[2].points = this.state.TempData[2].points.splice(-10);
		this.state.TempData[3].points = this.state.TempData[3].points.splice(-10);
		this.state.TempData[4].points = this.state.TempData[4].points.splice(-10);
		this.state.TempData[5].points = this.state.TempData[5].points.splice(-10);
	}
  }
  
	updateBallValve() {
		if(this.state.BallValve){this.state.BVColor = this.state.BVTrueColor}
		else{this.state.BVColor = this.state.BVFalseColor};
		
		if(this.state.BallValveMoving){this.state.BVMovingColor = this.state.BVTrueColor}
		else{this.state.BVMovingColor = this.state.BVFalseColor};
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
		this.setState(update(this.state,{PressureData:{0:{points:{$splice:[[this.state.PDatapoint,1,{x:this.state.PDatapoint,y:this.state.P1}]]}}}}));
		this.setState(update(this.state,{PressureData:{1:{points:{$splice:[[this.state.PDatapoint,1,{x:this.state.PDatapoint,y:this.state.P2}]]}}}}));
		this.setState(update(this.state,{PressureData:{2:{points:{$splice:[[this.state.PDatapoint,1,{x:this.state.PDatapoint,y:this.state.P3}]]}}}}));
		this.setState(update(this.state,{PressureData:{3:{points:{$splice:[[this.state.PDatapoint,1,{x:this.state.PDatapoint,y:this.state.PressureThreshold}]]}}}}));
		this.setState(update(this.state,{PDatapoint : {$apply:function(x) {return (x+1);}}}));
	
		if(this.state.P1 < this.state.PressureThreshold){
			this.state.currentColP1 = this.state.normalCol;
		} else{
			this.state.currentColP1 = this.state.alertCol;
		}
		
		if(this.state.P2 < this.state.PressureThreshold){
			this.state.currentColP2 = this.state.normalCol;
		} else{
			this.state.currentColP2 = this.state.alertCol;
		}
		
		if(this.state.P3 < this.state.PressureThreshold){
			this.state.currentColP3 = this.state.normalCol;
		} else{
			this.state.currentColP3 = this.state.alertCol;
		}
		
		
		
		
		if(this.state.PDatapoint > 10){
			this.state.PressureData[0].points = this.state.PressureData[0].points.splice(-9);
			this.state.PressureData[1].points = this.state.PressureData[1].points.splice(-9);
			this.state.PressureData[2].points = this.state.PressureData[2].points.splice(-9);
			this.state.PressureData[3].points = this.state.PressureData[3].points.splice(-9);
		//this.state.TempData[2].points = this.state.TempData[2].points.splice(-5);
		//this.state.TempData[3].points = this.state.TempData[3].points.splice(-5);
		}
	}
  
  updateLC() {
	//console.log('UpdateLC')
    this.setState(update(this.state,{LCMassData:{0:{points:{$splice:[[this.state.LCMassDatapoint,1,{x:this.state.LCMassDatapoint,y:this.state.LCMassRaw-this.state.LCMassZero}]]}}}}));
	this.setState(update(this.state,{LCMassDatapoint : {$apply:function(x) {return (x+1);}}}));
	this.setState(update(this.state,{TempGraphWidth : {$apply:function(x) {return (x+50);}}}));
	
	if(this.state.LCMassDatapoint > 10){
		this.state.LCMassData[0].points = this.state.LCMassData[0].points.splice(-10);
	}

	this.setState(update(this.state,{LCThrustData:{0:{points:{$splice:[[this.state.LCThrustDatapoint,1,{x:this.state.LCThrustDatapoint,y:this.state.LCThrust1Raw-this.state.LCThrust1Zero}]]}}}}));
	this.setState(update(this.state,{LCThrustData:{1:{points:{$splice:[[this.state.LCThrustDatapoint,1,{x:this.state.LCThrustDatapoint,y:this.state.LCThrust2Raw-this.state.LCThrust2Zero}]]}}}}));
	this.setState(update(this.state,{LCThrustDatapoint : {$apply:function(x) {return (x+1);}}}));
	
	if(this.state.LCThrustDatapoint > 10){
		this.state.LCThrustData[0].points = this.state.LCThrustData[0].points.splice(-10);
		this.state.LCThrustData[1].points = this.state.LCThrustData[1].points.splice(-10);
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
	this.updateLC();
	this.updatePressure();
	
	this.updateFueling();
	this.updateBallValve();
	this.updateVenting();
	//this.updateResetRelay();
	//this.updateDisconnect();
	//this.updateIgnition();
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
				Ball&nbsp;Valve&nbsp;Moving:
        	</div>
		</td>
		<td width = "5%">
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.BVMovingColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		<td width = "15%">
        	<div className = "title" style={{float:"left"}}>
				Ball&nbsp;Valve&nbsp;Open:
        	</div>
		</td>
		<td width = "5%">
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.BVColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		<td width = "10%">
        	<div className = "title" style={{float:"left"}}>
				Venting:
        	</div>
		</td>
		<td width = "40%">
        	<div style={{float:"left", "marginLeft": 10}}>
				{
					<span style={{  "height":46, "width": 46, "backgroundColor": this.state.VentingColor, "borderRadius": "50%", "display": "inline-block", "marginBottom":-30}}></span>
				}
        	</div>
		</td>
		</tr>
		</table>
		<div className = "line2">____________________________________________________________________________________________________________________________</div>
	</tr>
	<tr>
	<td style={{float:"left", position:"left", width:"24%", overflow:"auto", marginRight:"0"}}>
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
						xDisplay = {((x) => parseFloat(x/5).toFixed(1))}
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
					<input type="text" name="Temp1" value={"TC-C1:" + parseFloat(this.state.Temp1).toFixed(2)} style={{"width":"80px",  "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp1}} readOnly/>
				}
				<br></br>
				{
					<input type="text" name="Temp2" value={"TC-C2:" + parseFloat(this.state.Temp2).toFixed(2)} style={{"width":"80px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp2}} readOnly/>
				}
				<br></br>			
				{
				<input type="text" name="Temp3" value={"TC-C3:" + parseFloat(this.state.Temp3).toFixed(2)} style={{"width":"80px",  "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp3}} readOnly/>
				}
				<br></br>
				{
					<input type="text" name="Temp4" value={"TC-R2:" + parseFloat(this.state.Temp4).toFixed(2)} style={{"width":"80px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp4}} readOnly/>
				}
				<br></br>
				{
					<input type="text" name="Temp5" value={"TC-R1:" + parseFloat(this.state.Temp5).toFixed(2)} style={{"width":"80px",  "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp5}} readOnly/>
				}
				<br></br>
				{
					<input type="text" name="Temp6" value={"TC-R3:" + parseFloat(this.state.Temp6).toFixed(2)} style={{"width":"80px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColTemp6}} readOnly/>
				}
				</td>
			</tr>
		</table>
	</td>
	<td style={{float:"left", position:"left", width:"24%", overflow:"auto"}}>
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
						width={325}
						height={400}
						yMax = {'1000'}
						yMin = {'0'}
						yLabel = "PSI"
						xLabel = "Time: Seconds"
						xMin = {this.state.PDatapoint-10}
						xDisplay = {((x) => parseFloat(x/5).toFixed(1))}
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
					<input type="text" name="P1" value={"PT-C1: " + parseFloat(this.state.P1).toFixed(2)} style={{"width": "90px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColP1}} readOnly/>
				}
				{
					<input type="text" name="P2" value={"PT-R1: " + parseFloat(this.state.P2).toFixed(2)} style={{"width": "90px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColP2}} readOnly/>
				}
				{
					<input type="text" name="P3" value={"PT-R2: " + parseFloat(this.state.P3).toFixed(2)} style={{"width": "90px", "borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', 'color': this.state.currentColP3}} readOnly/>
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
					Loadcell - Mass
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
						xMin = {this.state.LCMassDatapoint-10}
						xMax = {this.state.LCMassDatapoint-1}
						xDisplay = {((x) => parseFloat(x/5).toFixed(1))}
						yLabel = "LB"
						xLabel = "Time: Seconds"
						ticks = {10}
						data={this.state.LCMassData}
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
						<button onClick = {this.LCMassButton} className = "LCMassButton" style={{"float":"left"}}>Zero Loadcell</button>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellRaw" value={"Raw: " + parseFloat(this.state.LCMassRaw).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellZero" value={"Zero: " + parseFloat(this.state.LCMassZero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellAdjusted" value={"Adjusted: " + parseFloat(this.state.LCMassRaw - this.state.LCMassZero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="RemainingNeeded" size="30" value={"NOX To Full: " + parseFloat((35 - (this.state.LCMassRaw - this.state.LCMassZero))).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					</table>
				</td>
			</tr>
		</table>
	</td>
	<td style={{float:"left", position:"left", width:"24%", overflow:"visible"}}>
			<table>
			<tr>
				<td>
					<div className = "title" style={{float:"left"}}>
					Loadcell - Thrust
					</div>
				</td>
			</tr>
			<tr>
				<td>
					{
					<LineChart
						id = "LCThrust"
						width={350}
						height={400}
						yMax = {'800'}
						yMin = {'0'}
						xMin = {this.state.LCThrustDatapoint-10}
						xMax = {this.state.LCThrustDatapoint-1}
						xDisplay = {((x) => parseFloat(x/5).toFixed(1))}
						yLabel = "LBF"
						xLabel = "Time: Seconds"
						ticks = {10}
						data={this.state.LCThrustData}
						pointRadius={1}
						margins = {{top: 50, right : 0, bottom : 50, left : 0 }}
						showLegends = "True"
					/>
					}
				</td>
				<td>
					<table>
					<tr>
					<td>
					{
						<button onClick = {this.LCThrust1Button} className = "LCThrust1Button" style={{"float":"left"}}>Zero Thrust LC1</button>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellRaw" value={"Raw 1: " + parseFloat(this.state.LCThrust1Raw).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellZero" value={"Zero 1: " + parseFloat(this.state.LCThrust1Zero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellAdjusted" value={"Adjusted 1: " + parseFloat(this.state.LCThrust1Raw - this.state.LCThrust1Zero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<button onClick = {this.LCThrust2Button} className = "LCThrust2Button" style={{"float":"left"}}>Zero Thrust LC2</button>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellRaw" value={"Raw 2: " + parseFloat(this.state.LCThrust2Raw).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellZero" value={"Zero 2: " + parseFloat(this.state.LCThrust2Zero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
					}
					</td>
					</tr>
					<tr>
					<td>
					{
						<input type="text" name="LoadCellAdjusted" value={"Adjusted 2: " + parseFloat(this.state.LCThrust2Raw - this.state.LCThrust2Zero).toFixed(2)} style={{"borderWidth":"0px", 'borderStyle':'solid', 'fontWeight': 'bold', "float":"left"}} readOnly/>
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
	</tr>
	</tbody>
	</table>

	</div>
    );
  }
}

export default App;