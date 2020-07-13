import React from 'react';
import { Tag, Row, Col, Collapse, Form, Button, Select, InputNumber } from 'antd';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined, SaveOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const componentSize = 'small';
import {PythonShell} from 'python-shell';
var sqlite = require('sqlite-sync');


export default class Config extends React.Component{
  constructor(props){
    super(props)

    this.state = {
        conected: this.props.conected,
        f1: '', 
        f2: '',
        changed: false
    }
    this.headers = ['geral, indicadores, MHI, lista']
    this.menus = {'lista':[]}
    this.valores = Object.keys(props.valoresConfig).length > 0 ? props.valoresConfig : {'tipoConta':'Demo', 'negociacao': '10', 'tipoValor': '%', 'qtdMartingale':'2', 'delay': '2', 'delayMartingale' : '1',
                    'stopGain':'30', 'tipoStopGain':'%', 'stopLoss':'40', 'tipoStopLoss':'%', 'minimoPayout': '75', 'SMA': false, 'EMA': false,
                    'periodoEMA':'100','periodoSMA':'100', 'lista': false, 'MHI': false, "indicadores": false}
    this.valoresIniciais = this.valores;
    this.ps = this.props.powershell;
    this.conectar = this.conectar.bind(this)
    this.genExtra = this.genExtra.bind(this)
    this.onSwitchChange = this.onSwitchChange.bind(this)
    this.somenteNumero = this.somenteNumero.bind(this)
    this.onFinish = this.onFinish.bind(this)
    this.onChange = this.onChange.bind(this)

  }

  convBol(valor){
    if(valor === 1 || valor === '1' || valor === 'true' || valor === true)
      return true
    else
      return false
  }

  conectar(){
    //console.log(this.ps)
	PythonShell.run('D:/Projetos/botConfigurator/src/python/WinTrader-SuperBot.py', null, function (err) {
	  if (err) throw err;
	});
    this.ps.addCommand('sup/WinTrader-SuperBot.exe');
    this.ps.invoke()
    .then(output => {
		this.setState({conected: true})
    })
    .catch(err => {
      console.log(err);
    });
  }

  onChange(e, campo){
    this.valores[campo] = e
    if(this.state.changed === false)
      this.setState({changed: true})
  }

  genExtra = (menu) => (
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      defaultChecked={this.convBol(this.valores[menu])}
      onChange={(e) => this.changeColapse(menu, e)}
      size="small"
    />
  );
  
  changeColapse(menu, e){
    this.valores[menu] = e
    if(e === true)
      this.menus[menu] = '1'
    else
      this.menus[menu] = ''

    this.setState({true:true, changed: true})
  }

  onSwitchChange(e, variavel){
    this.valores[variavel] = e
    this.setState({true:true})
  }

  somenteNumero(e, variavel){
    var final = e.length
    if ("1234567890.,".indexOf(e[final-1]) < 0){
        return false;
    }
    var valores = this.valores[variavel]
    if((valores.indexOf(',') || valores.indexOf('.')) &&
    (e[final-1] === ',' || e[final-1] === '.')){
      return false
    }

    this.valores[variavel] = e
    this.setState({true: true})
  }

  onFinish(){
    sqlite.connect('cn_et');
    sqlite.run("DROP TABLE IF EXISTS CONFIGS;");
    sqlite.run("CREATE TABLE CONFIGS(ID INTEGER PRIMARY KEY AUTOINCREMENT, CAMPO TEXT NOT NULL, VALOR TEXT NOT NULL);");
    var i = 0
    Object.keys(this.valores).map((prop) => {
      sqlite.insert('CONFIGS',{'ID': i, 'CAMPO': prop, 'VALOR': this.valores[prop]});
      i++;
    })
    sqlite.close()
    this.valoresIniciais = this.valores
    this.setState({changed: false})
  }

  render(){
    return ( 
        <div>
          <Row>
            <Col span={12}>
              <h2>Configuração</h2>
            </Col>

            <Col span={12}>
              <p align="right">
                {/* {this.state.conected === true ? <Tag color="success">Conectado</Tag> : <Tag onClick={this.conectar} color="error">Desconectado</Tag>}  */}
                {this.state.changed === true ? (
                <Button type="primary" onClick={() => {this.valores = this.valoresIniciais; this.setState({changed:false})}} icon={<CloseOutlined twoToneColor="#eb2f96"/>} danger>
                  Cancelar
                </Button> ) : null}
                
                <Button type="primary" onClick={this.onFinish} style={{marginLeft: '15px'}} icon={<SaveOutlined twoToneColor="#52c41a"/>} >
                  Salvar
                </Button>
              </p>
            </Col>
          </Row>

          <Row>
            <Col span={12} style={{paddingRight: '8px'}}>
              <Collapse
                activeKey = '1'       
              >
                <Panel showArrow = {false} onClick={null} header="geral" key="1">
                  <Form
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                    layout="horizontal"
                    onFinish={this.onFinish}
                    //initialValues={{ 'stopGain' : {'valor': this.valores['stopGain'], 'tipo': this.valores['tipoStopGain'] }}}
                    size={componentSize}  
                  >
                    <Form.Item name='tipoConta' label="Tipo de Conta">
                      <Select
                        defaultValue={this.valores['tipoConta']}
                        onChange={(e) => this.onChange(e, 'tipoConta')}>
                        <Select.Option value="Demo">Demo</Select.Option>
                        <Select.Option value="Real">Real</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name='negociacao' label="Valor da Negociação">
                      <span>
                        <InputNumber
                          defaultValue={parseInt(this.valores['negociacao'])}
                          onChange={(e) => this.onChange(e, 'negociacao')}
                          type="text"
                          style={{
                            width: 95,
                          }}
                        />
                        <Select
                          onChange={(e) => this.onChange(e, 'tipoValor')}
                          style={{
                            width: 50,
                            margin: '0px 0px 0px 4px',
                          }}
                          defaultValue={this.valores['tipoValor']}
                        >
                          <Select.Option value="$">$</Select.Option>
                          <Select.Option value="%">%</Select.Option>
                        </Select>
                      </span>
                    </Form.Item>
                    <Form.Item name='stopGain' label="Stop Gain">
                      <span>
                        <InputNumber
                          onChange={(e) => this.onChange(e, 'stopGain')}
                          defaultValue={parseInt(this.valores['stopGain'])}
                          //value = {valor}
                          type="text"
                          style={{
                            width: 95,
                          }}
                        />
                        <Select
                          //value = {tipo}
                          onChange={(e) => this.onChange(e, 'tipoStopGain')}
                          style={{
                            width: 50,
                            margin: '0px 0px 0px 4px',
                          }}
                          defaultValue={this.valores['tipoStopGain']}
                        >
                          <Select.Option value="$">$</Select.Option>
                          <Select.Option value="%">%</Select.Option>
                        </Select>
                      </span>
                    </Form.Item>
                    <Form.Item name='stopLoss' label="Stop Loss">
                      <span>
                        <InputNumber
                          onChange={(e) => this.onChange(e, 'stopLoss')}
                          defaultValue={parseInt(this.valores['stopLoss'])}
                          type="text"
                          style={{
                            width: 95,
                          }}
                        />
                        <Select
                          onChange={(e) => this.onChange(e, 'tipoStopLoss')}
                          style={{
                            width: 50,
                            margin: '0px 0px 0px 4px',
                          }}
                          defaultValue={this.valores['tipoStopLoss']}
                        >
                          <Select.Option value="$">$</Select.Option>
                          <Select.Option value="%">%</Select.Option>
                        </Select>
                      </span>
                    </Form.Item>                    
                    <Form.Item name='minimoPayout' label="Payout Mínimo">
                        <InputNumber
                          defaultValue={parseInt(this.valores['minimoPayout'])}
                          onChange={(e) => this.onChange(e, 'minimoPayout')}
                          max = {100}
                          min = {0}
                          style={{
                            width: 60,
                            marginRight: '5px'
                          }}
                        />
                         %
                    </Form.Item>
                  </Form>
                </Panel>
              </Collapse>
              <Collapse
                activeKey = {this.convBol(this.valores['MHI']) === true ? '1' : ''}
                style = {{marginTop: '25px'}}              
              >
                {/* <Panel showArrow = {false} onClick={null} header="MHI" key="1" extra={this.genExtra('MHI')}>
                  <div>texto exemplo</div>
                </Panel> */}
              </Collapse>
            </Col>
            <Col span={12}  style={{paddingLeft: '8px'}}>
              <Collapse
                activeKey = {this.convBol(this.valores['lista']) === true ? '1' : ''}               
              >
                
                <Panel showArrow = {false} onClick={null} header="lista" key="1" extra={this.genExtra('lista')}>
                <Form
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                    layout="horizontal"
                    initialValues={{ size: componentSize }}
                    size={componentSize}  
                  >
                    <Form.Item name='qtdMartingale' label="Qtd. Martingale">
                        <InputNumber
                          defaultValue={parseInt(this.valores['qtdMartingale'])}
                          onChange={(e) => this.onChange(e, 'qtdMartingale')}
                          max = {10}
                          min = {0}
                          style={{
                            width: 50,
                            marginRight: '5px'
                          }}
                        />
                         (Max: 10)
                    </Form.Item>
                    <Form.Item name='delay' label="Delay">
                        <InputNumber
                          defaultValue={parseInt(this.valores['delay'])}
                          onChange={(e) => this.onChange(e, 'delay')}
                          max = {20}
                          min = {0}
                          style={{
                            width: 50,
                            marginRight: '5px'
                          }}
                        />
                         Seg (Max: 20)
                    </Form.Item>
                    <Form.Item name='delayMartingale' label="Delay Martingale">
                        <InputNumber
                          defaultValue={parseInt(this.valores['delayMartingale'])}
                          onChange={(e) => this.onChange(e, 'delayMartingale')}
                          max = {20}
                          min = {0}
                          style={{
                            width: 50,
                            marginRight: '5px'
                          }}
                        />
                         Seg (Max: 20)
                    </Form.Item>
                  </Form>
                </Panel>
              </Collapse>
              <Collapse
                activeKey = {this.convBol(this.valores['indicadores']) === true ? '1' : ''}  
                style = {{marginTop: '25px'}}              
              >
                <Panel showArrow = {false} onClick={null} header="indicadores" key="1" extra={this.genExtra('indicadores')}>
                <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size={componentSize}  
                  >
                    <Form.Item name='SMA' label="SMA">
                      <span>
                        Não
                        <Switch size="small" style={{margin: '0px 10px 0px 10px'}} onChange={(e) => this.onSwitchChange(e, 'SMA')} defaultChecked={this.convBol(this.valores['SMA'])} />
                        Sim
                      </span>
                    </Form.Item>
                    {this.convBol(this.valores['SMA']) === true ? (
                      <Form.Item name='periodoSMA' label="Periodo SMA">
                      <span>
                      <InputNumber
                        onChange={(e) => this.onChange(e, 'periodoSMA')}
                        defaultValue={parseInt(this.valores['periodoSMA'])}
                        type="text"
                        max = {200}
                        min = {2}
                        style={{
                          width: '100%'
                        }}
                      />
                      </span>
                      </Form.Item>
                    ) : null}
                    
                    <Form.Item name='EMA' label="EMA">
                      <span>
                        Não
                        <Switch size="small" style={{margin: '0px 10px 0px 10px'}} onChange={(e) => this.onSwitchChange(e, 'EMA')} defaultChecked={this.convBol(this.valores['EMA'])} />
                        Sim
                      </span>
                    </Form.Item>
                    {this.convBol(this.valores['EMA']) === true ? (
                    <Form.Item name='periodoEMA' label="Periodo EMA">
                        <span>
                        <InputNumber
                          defaultValue={parseInt(this.valores['periodoEMA'])}
                          onChange={(e) => this.onChange(e, 'periodoEMA')}
                          type="text"
                          max = {200}
                          min = {2}
                          style={{
                            width: '100%'
                          }}
                        />
                        </span>
                    </Form.Item>
                    ) : null}
                  </Form>
                </Panel>
              </Collapse>
            </Col>
          </Row>

        </div>
    )
  }
 }