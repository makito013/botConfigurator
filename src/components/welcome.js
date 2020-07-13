import React from 'react';
import { Tag, Row, Col } from 'antd';

export default class Home extends React.Component{
  constructor(props){
    super(props)
    console.log('props',this.props)

    this.state = {
        conected: this.props.conected,
        f1: '', 
        f2: ''
    }
    this.ps = this.props.powershell;
    this.conectar = this.conectar.bind(this)
  }

  conectar(){
    console.log(this.ps)
    this.ps.addCommand('sup/WinTrader-SuperBot.exe');
    this.ps.invoke()
    .then(output => {
      console.log(output);
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  render(){
    return ( 
        <div>
          <Row>
            <Col span={20}>
            
            </Col>

            <Col style={{float:'right'}}>
              <p align="right">{this.state.conected === true ? <Tag color="success">Conectado</Tag> : <Tag onClick={this.conectar} color="error">Desconectado</Tag>} </p>
            </Col>
          </Row>
          
          <h2>Seja bem-vindo...</h2>
          <p>Pagina inicial do Bot</p>
        </div>
    )
  }
 }