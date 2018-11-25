import React, { Component } from 'react';
import Logo from './img/Team20Logo.png';
import styled from 'styled-components';
import SplitPane from 'react-flex-split-pane';
import SearchInput from 'react-search-input'
import 'react-awesome-button/dist/styles.css';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import {
  Toggler
} from "@smooth-ui/core-sc";


const TeamLogo = styled.img`
  height: 150px;
  weight: 150px;
`;


const Button = styled.button`
  margin: 0rem 0.2rem 0rem 0rem;
  border-radius: 3px;
  border: 1px solid green;
  font-size: 1rem;
  color: white;
  background-color:rgb(0, 166, 0);
  height: 2.2rem;
  :hover{
    background-color:rgb(0, 131, 0);
  }
`;

const Body = styled.div`
  display: flex;
`;

const LeftSide = styled.div`
  flex: 0.3;
  background-color: rgb(238, 243, 249);
`;

const ButtonsGroup = styled.div`
  margin: 0rem 0rem 0rem 1rem;
  float: left;
`;

const ButtonsGroup2 = styled.div`
  margin: 0rem 0.2rem 0rem 0rem;
  float: right;
`;

const SummaryGroup = styled.div`
  margin: 0rem 0rem 0rem 1rem;
`;

const Template = styled.div`
  font-family:'Overpass', sans-serif;
  margin-top: 15px;
`;

const Title = styled.h3``;
const Description = styled.h4``;
const TemplateCode = styled.h6`
  display: inline;
`;
const Variables = styled.span`
  color: blue;
`;


const RightSide = styled.div`
  flex: 0.7;
  background-color: grey;
`;

const Name = styled.input.attrs({
  type: 'text',
  size: props => (props.small ? 5 : undefined),
})`

  background-color: rgb(131, 133, 132);
  border-radius: 3px;
  border: 1px solid black;
  overflow: auto;
  position: relative;
  width: 75%;
  height: 2rem;
  font-size: 1rem;
  padding: ${props => props.padding};

  ::placeholder {
    color: black;
    font-style:italic;
  }
`;

const Result = styled.div`
  background-color: white;
`;

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  // Resizable Grid
  state = { size: 150, isResizing: false, editorTextValue: "", result: ""};
  onResizeStart = () => this.setState({ isResizing: true })
  onResizeEnd = () => this.setState({ isResizing: false })
  onChange = size => this.setState({ size })

  onEditorChange = (value) => {
    this.setState({editorTextValue: value});
  }

  executeQuery = () => {
    var data = {
      "service": "english",
      "measure": "clients",
    }
    axios.post('http://localhost:8080/query/test', data)
    .then((response) => {
      console.log("Result of Query:",response);
      this.setState({result: response["data"]});
    })
    .catch(function (error) {
      console.log("Error:", error);
    });
  }

  render() {
    return (
      <div className="App">
      <TeamLogo src={Logo} />
        <header className="App-header">
        </header>
        <Body>
          <LeftSide>
          <SearchInput className="search-input" onChange={this.searchUpdated} style={{margin: "10px", width:"95%"}}/>
          <hr />
          <ButtonsGroup>
          <Toggler>
            {({ toggled, onToggle }) => (
              <div className="block-list">
                <div>{toggled ? 'Saved' : 'Templates'}</div>
                <div>
                  <Button size="sm" onClick={() => onToggle(false)}>
                  Templates
                  </Button>{' '}
                  <Button size="sm" onClick={() => onToggle(true)}>
                  Saved
                  </Button>
                </div>
              </div>
            )}
          </Toggler>
          </ButtonsGroup>
            <SummaryGroup>
           <br/>
           <br/>
           <br/>
            <Template onClick={() => this.setState({editorTextValue: 'How many times was {X} used on day {Y}'})}>
            <hr style={{margin:"0rem 0rem 0rem -1rem"}}/>
                <Title>Service Summary</Title>
                <Description style={{fontWeight:"normal"}}>Finds how many times a service was used on a specific day.</Description>
                <TemplateCode>How many times was <Variables>X (Service)</Variables> used on day <Variables>Y (Date)</Variables></TemplateCode>
             <hr style={{margin:"0rem 0rem 0rem -1rem"}}/>
            </Template>
            </SummaryGroup>
            <SummaryGroup>
            <Template onClick={() => this.setState({editorTextValue: "db.find({'Service': 'Language'}).limit(5);"})}>

                <Title>Service Summary</Title>
                <Description style={{fontWeight:"normal"}}>Finds how many times a service was used on a specific day.</Description>
                <TemplateCode>db.find({"{'Service': 'Language'}"}).limit(5);</TemplateCode>
              <hr style={{margin:"0rem 0rem 0rem -1rem"}}/>
            </Template>
            </SummaryGroup>
          </LeftSide>
          <RightSide>
            <Name placeholder=" Untitiled"/>
            <ButtonsGroup2>
              <Button onClick={this.executeQuery}>Run Code</Button>
              <Button>Save</Button>
            </ButtonsGroup2>
          <div style={{display:"flex" }}>
            <SplitPane
              type="horizontal"
              size={this.state.size}
              isResizing={this.state.isResizing}
              onResizeStart={this.onResizeStart}
              onResizeEnd={this.onResizeEnd}
              onChange={this.onChange}
              paneStyle={{ border: '1px solid silver' }}
              pane1Style={{ borderRight: '1px solid silver' }}
            >
            <AceEditor
              mode="javascript"
              theme="monokai"
              value={this.state.editorTextValue}
              name="query-editor"
              onChange={this.onEditorChange}
              style={{display:"flex", width: "100%" }}
            />
              <Result style={{ height: 300, overflow: "scroll"}}>
                {this.state.result}
              </Result>
            </SplitPane>
            </div>
          </RightSide>
        </Body>
      </div>
    );
  }
}
