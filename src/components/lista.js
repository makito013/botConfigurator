import React from 'react';
import { Tag, Row, Col, Input, Button } from 'antd';

const { TextArea } = Input;

export default class Lista extends React.Component{
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
                <Col span={4}>
                    <Button type="dashed" size={'small'}>
                        Importar
                    </Button>
                </Col>
                <Col span={12}>

                </Col>
                <Col span={4}>
                    <Button type="primary" size={'small'} danger>
                        Cancelar
                    </Button>
                </Col>
                <Col span={4}>
                    <Button type="primary" size={'small'}>
                        Salvar
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <TextArea rows={10} />
                </Col>
            </Row>
        </div>
    )
  }
 }