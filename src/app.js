import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import DialogContentText from '@material-ui/core/DialogContentText';
var sqlite = require('sqlite-sync');
import Welcome from './components/welcome';
import Configuration from './components/config';
import { Layout, Menu, Row, Col, Button, Space  } from 'antd';
import {
    AppstoreOutlined,
    MinusOutlined,
    CloseOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
  } from '@ant-design/icons';

const Shell = require('node-powershell');
const ps = new Shell({
  verbose: true,
  executionPolicy: 'Bypass',
  noProfile: true
});
console.log(ps)
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

// Captura janela principal do Electron
const { remote } = require('electron')
var window = remote.getCurrentWindow()

const appBarStyle = {
    
    maxHeight: 30,
    padding: '1px 8px',
    color: "#ff25",
}

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pageRouted: 'configuration',
            collapsed: true,
        };
        this.valoresConfig = {}
        const fs = require('fs');
        if (!fs.existsSync('cn_et')) {
          sqlite.connect('cn_et');
          sqlite.run("CREATE TABLE CONFIGS(ID INTEGER PRIMARY KEY AUTOINCREMENT, CAMPO TEXT NOT NULL, VALOR TEXT NOT NULL);");
          sqlite.insert('CONFIGS',{'ID': 1, 'CAMPO': 'tipoConta', 'VALOR':'Demo'});
          sqlite.insert('CONFIGS',{'ID': 2, 'CAMPO': 'negociacao', 'VALOR':'10'});
          sqlite.insert('CONFIGS',{'ID': 3, 'CAMPO': 'tipoValor', 'VALOR':'%'});
          sqlite.insert('CONFIGS',{'ID': 4, 'CAMPO': 'qtdMartingale', 'VALOR':'2'});
          sqlite.insert('CONFIGS',{'ID': 5, 'CAMPO': 'delay', 'VALOR':'2'});
          sqlite.insert('CONFIGS',{'ID': 6, 'CAMPO': 'stopGain', 'VALOR':'30'});
          sqlite.insert('CONFIGS',{'ID': 7, 'CAMPO': 'tipoStopGain', 'VALOR':'%'});
          sqlite.insert('CONFIGS',{'ID': 8, 'CAMPO': 'stopLoss', 'VALOR':'40'});
          sqlite.insert('CONFIGS',{'ID': 9, 'CAMPO': 'tipoStopLoss', 'VALOR':'%'});
          sqlite.insert('CONFIGS',{'ID': 10, 'CAMPO': 'minimoPayout', 'VALOR':'75'});
          sqlite.insert('CONFIGS',{'ID': 11, 'CAMPO': 'EMA', 'VALOR':'false'});
          sqlite.insert('CONFIGS',{'ID': 12, 'CAMPO': 'SMA', 'VALOR':'false'});
          sqlite.insert('CONFIGS',{'ID': 13, 'CAMPO': 'periodoEMA', 'VALOR':'100'});
          sqlite.insert('CONFIGS',{'ID': 14, 'CAMPO': 'periodoSMA', 'VALOR':'100'});
          sqlite.insert('CONFIGS',{'ID': 15, 'CAMPO': 'lista', 'VALOR':'false'});
          sqlite.insert('CONFIGS',{'ID': 16, 'CAMPO': 'MHI', 'VALOR':'false'});
          sqlite.insert('CONFIGS',{'ID': 17, 'CAMPO': 'indicadores', 'VALOR':'false'});
          sqlite.insert('CONFIGS',{'ID': 18, 'CAMPO': 'oposicaoVela', 'VALOR':'false'});
          sqlite.insert('CONFIGS',{'ID': 19, 'CAMPO': 'tendencia', 'VALOR':'false'});
          sqlite.close()
        }
        else{
          sqlite.connect('cn_et');
          var rows = sqlite.run("SELECT * FROM CONFIGS");
          rows.map(prop => {
            //var valor = prop.VALOR === 'false' ? false : prop.VALOR === 'true' ? true : prop.VALOR 
            var valor = prop.VALOR
            this.valoresConfig[prop.CAMPO] = valor
          })
          sqlite.close()
        }

    }

    routePage = (page) => {
        this.setState({pageRouted: page})
    }

    route(){
      switch (this.state.pageRouted){
        case 'welcome':
          return <Route render={props => <Welcome conected={false} powershell={ps}></Welcome>}/>
        case 'configuration':
          return <Route render={props => <Configuration conected={false} valoresConfig={this.valoresConfig} powershell={ps}></Configuration>}/>
      }
        

      
    }

    render() {
        return (
    <Layout>
      <Header style={appBarStyle} >   
          <Row>
            <Col span={2} style={{WebkitAppRegion: "drag", height: '20px'}}>
            </Col>
            <Col span={20} align='center' style={{marginTop:"-18px", WebkitAppRegion: "drag"}}>
                <h3>SuperBot</h3>
            </Col>
            <Col span={2} align='right'>
                <Button type="link" danger style={{float: "right"}} 
                shape="circle" icon={<CloseOutlined />} size="small" 
                onClick={() => { console.log('close'); window.close() } }
                />
                <Button type="link" style={{float: "right", marginRight:'10px'}} 
                shape="circle" icon={<MinusOutlined />} size="small" 
                onClick={() => { window.minimize() } }
                />
            </Col>
          </Row>     
      </Header>
    <Layout>

    <Row className="site-layout-background">
        <Col>
      <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
          style={{height:'550px', marginTop:'-4px'}}
          defaultSelectedKeys={['2']}
        >
          {/* <Menu.Item key="1" onClick={() => this.routePage('welcome')} icon={<PieChartOutlined />}>
            Dashboard
          </Menu.Item> */}
          <Menu.Item key="2" onClick={() => this.routePage('configuration')} icon={<DesktopOutlined />}>
            Configuração
          </Menu.Item>
          {/* <Menu.Item key="3" icon={<ContainerOutlined />}>
            Lista
          </Menu.Item>
          <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu> */}
        </Menu>
        </Col>
        <Col flex="auto">
        <Content
           className="site-layout-background"
            style={{
            paddingRight: 5,
            paddingLeft: 15,
            paddingTop: 15,
            margin: 0,
          }}
        >
          <Router>
            {this.route()}
          </Router> 
        </Content>
        </Col>
      </Row>
    </Layout>
  </Layout>
        );
    }
}
