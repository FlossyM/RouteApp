import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./App.css"
import { Container, Row, Col, Tabs, Tab, CardDeck, Card, ListGroup } from 'react-bootstrap';


//A card component which can be re-used for several routes by mapping Bus Stop data recieved from the server
const CardArrival = (props) => {
  return (
    <Card bg="light" text="black" lg={4} >
    {Object.keys(props.data).map((keyName, i) => (
  
    <Card.Body>
      <Card.Title>Route {i+1} arriving in </Card.Title>
      <Card.Text>
        <ListGroup>
          <ListGroup.Item >{props.data[keyName][0]} minutes</ListGroup.Item>
          <ListGroup.Item>{props.data[keyName][1]} minutes</ListGroup.Item>
        </ListGroup>
      </Card.Text>
    </Card.Body>
  
))}
  </Card>
 
  )
}

//The main component
class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      stopId:1,
      Stop1:{"R1":'',"R2":'',"R3":''},
      Stop2:{"R1":'',"R2":'',"R3":''},
      endpoint: "http://localhost:8000"
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  componentDidMount() {
    //By default Stop 1 is chosen when the application loads
    this.connectSocket(1);
  }

  //Based on the user selection (tab change) invoke connection to the respective socket
  handleSelect(key) {

    this.setState({stopId:key}, () => {
      this.connectSocket();
   });
   
   }
  
   //Method that connects to the respective sockets and listens to the sever for live arrival times
  connectSocket()
  { 
    const { endpoint } = this.state;
    let stop= "Stop"+this.state.stopId;
    const socket = socketIOClient(endpoint);

    socket.emit(stop,"");
    socket.on(stop, data => this.setState({ [stop]: JSON.parse(data) }));
  }

  render() {
    const { Stop1,Stop2 } = this.state;

    return (

      <Container>
          <Row>
          <Col xs={12} md={12} lg={12}>

              <Tabs className="tab_main" activeKey={this.state.stopId} onSelect={this.handleSelect} id="uncontrolled-tab-example">
             
                <Tab className="tab" eventKey={1} title="Stop 1">
                  <CardDeck>
                  <CardArrival data={Stop1}/>
                  
                  </CardDeck>
                </Tab>
             
                <Tab eventKey={2} title="Stop 2">
                  <CardDeck>
                  <CardArrival data={Stop2}/>
                  </CardDeck>
                </Tab>

              </Tabs>

            </Col>
          </Row>
      </Container>


    );
  }
}
export default App;
