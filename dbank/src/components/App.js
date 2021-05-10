import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    //check if MetaMask exists

    if(typeof window.ethereum!=='undefined'){
      await window.ethereum.enable() 
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
      }else{
       window.alert('Jelentkezz be a MetaMask-be!')
      }
      //Token
      //Bank
      //load contracts
      try{
      const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
      const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
      const dBankAddress = dBank.networks[netId].address
      this.setState({token: token, dbank: dbank, dBankAddress: dBankAddress})
      }catch(e){
        console.log('Hiba', e)
        window.alert('A szerződések nincsenek implementálva a jelenlegi hálózatban')
      }

    }else{
      window.alert('Nincs telepítve/helyesen konfigurálva a MetaMask!')
    }
  }

  async deposit(amount) {
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
      }catch(e){
        console.log('Hiba a betétnél: ',e)
      }
    }
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
  }

  async withdraw(e) {
    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
      } catch(e) {
        console.log('Hiba a kivételnél: ', e)
      }
    }
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Üdvözöllek a dBank-ban</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Betét">
                <div>
                  <br></br>
                  Mennyi a bankba betenni kívánt mennyiség?
                  <br></br>
                  (minimális mennyiség: 0.01 ETH)
                  <br></br>
                  (egyszerre csak 1 betétel lehetséges)
                  <br></br>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    amount = Web3.utils.toWei(amount.toString(), 'ether') //weibe konvertálás
                    this.deposit(amount)
                  }}>
                    <div className='form-group mr-sm-2'>
                    <br></br>
                    <input
                      id='depositAmount'
                      step="0.01"
                      type='number'
                      className="form-control form-control-md"
                      placeholder='mennyiség..'
                      required
                      ref={(input) => {this.depositAmount = input}}
                    />
                    </div>
                    <button type='submit' className='btn btn-primary'>BETÉTEL</button>
                  </form>
                </div>
                </Tab>
                <Tab eventKey="withdraw" title="Kivétel">
                  <br></br>
                  Ki akarod venni a betett értéket? (Ehhez pluszba jár a kamat)
                  <br></br>
                  <br></br>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>KIVÉTEL</button>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;