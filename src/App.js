import React, { Fragment } from 'react'
import Divider from '@material-ui/core/Divider';
import './App.css';
import { Card, TextField, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import ApiCall from './Api.js'
import moment from 'moment'

const regex = /^([0-9]){0,3}$/
class App extends React.Component {

  constructor(props){
    super(props)
    this.state={
      customers : [],
      products : {},
      api_customer : false,
      orderDetails : [],
    }
  }

  customerList=()=>{
    return(
      <Fragment>
        <div className="ml-3" style={{color: "#bd6f6f"}}>
          Customers
        </div>
        <List>
          {this.state.customers.map((key , index)=>{
            return (
            <ListItem button key={key._id} style={this.state.selected_cutomer_id==key._id ? {color: "white", backgroundColor : '#757472'}: {}}  onClick={()=>{this.customerOrders(key._id, key.name)}}>
              <ListItemText primary={key.name} />
            </ListItem>
            )
        })}
        </List>
      </Fragment>
    )
  }

  productList=()=>{
    return(
      <div className="row my-3">
        <div className="col-md-12 my-2">
        Product List {this.state.selected_cutomer_name} have ordered
        </div>
        {
          Object.values(this.state.products).map((key , index)=>{
            return(
              <div className="col-md-4" >
              <Card className='p-3' style={{marginBottom : '10px'}}  >
              <div>
              <Tooltip title={key.name}> 
                <div className="ellip" > Name : {key.name} </div>
              </Tooltip>
                <div> Quantity : {key.quantity} </div>     
              </div>
              </Card>
              </div>
            )
          })
        }
      </div>
    )
  }

  orderList=()=>{
    return(
      this.state.orderDetails.map((key , index)=>{
        return(
          <Fragment>
          <div className='d-flex justify-content-between'  style={{marginTop : '10px'}}>
            <div>
              Order Details ( {key._id} )
            </div>
            <div className='align-items-center mr-2'>
              {moment(key.date_modified).format('MMM DD, YYYY')}
            </div>
          </div>
          
          <div className ="row" style={{marginTop : '10px'}}>
            {key.products.map((key2)=>{
              return(
                <div className="col-md-6">
                  <Card className='p-3' style={{marginBottom : '10px'}}  >
                    <div>
                      <div className='d-flex justify-content-between'>
                        <div className='name-list'> {key2.name} </div>
                        <div className=' align-items-center justify-content-end mr-2'>
                          {this.state.editing_product_id == key2.product_id && this.state.editing_order_id == key._id ?
                            <Fragment>
                              <Tooltip title='Cancel'> 
                              <IconButton aria-label="close" onClick={()=>{this.clear()}}>
                                <ClearIcon fontSize="small" />
                              </IconButton>
                              </Tooltip>
                              <Tooltip title='Save'> 
                              <IconButton aria-label="done" onClick={()=>{this.editProduct()}}>
                                <DoneIcon fontSize="small" />
                              </IconButton>
                              </Tooltip>
                            </Fragment> :
                            <Tooltip title='Edit'> 
                              <IconButton aria-label="edit" onClick={() => { this.editOrder(key2.product_id, key._id, key2.status, key2.quantity) }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                              </Tooltip>
                          }                          
                        </div>
                      </div>
                    </div>
                    {this.state.editing_product_id == key2.product_id && this.state.editing_order_id == key._id ?  
                    <div className='d-flex justify-content-between mt-3'>
                      {<FormControl variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={this.state.order_status}
                          onChange={(e)=>{this.handleChange(e)}}
                          label="Status"
                        >
                          <MenuItem value={1}>Done</MenuItem>
                          <MenuItem value={2}>Processing</MenuItem>
                        </Select>
                      </FormControl>}
                      <div className='d-flex align-items-center justify-content-end mr-2'>
                          Quantity : 
                          <div className="mx-1" style={{width : '30px'}}> 
                            <TextField id="standard-basic" value ={this.state.quantity_value} onChange={(e)=>{ this.handleQuantity(e) }} /> 
                          </div> 
                      </div>
                    </div> :
                    <div className='d-flex justify-content-between' style={{marginTop:'43px'}}>
                      { key2.status == 1 && <div className='status-enabled'> Done </div> }
                      { key2.status == 2 && <div className='status-disabled'> Processing </div> }
                      <div className=' align-items-center justify-content-end mr-2'>
                          Quantity : {key2.quantity}
                      </div>
                    </div>  
                    }
                  </Card>
                </div>
              )
            })}
          </div>
          <Divider className ="my-3" />
          </Fragment>
        )
      })
    )
  }

  editProduct=()=>{
    ApiCall.editProduct( this.state.editing_order_id ,this.state.editing_product_id,this.state.quantity_value ,this.state.order_status, this.state.selected_cutomer_id )
      .then(values => {
        if (values.success) {
          this.clear()
          this.setState({loading: true})
          this.customerOrders(this.state.selected_cutomer_id, this.state.selected_cutomer_name)
        } else {
          this.setState({ error: "failed_fetch_orders", api_orders: false })
        }
      })
  }
  clear =()=>{
    this.setState({editing_product_id : '' , editing_order_id : '', order_status:'', quantity_value:''})
  }

  handleQuantity =(event)=>{
    if(!regex.test(event.target.value)){return}
    this.setState({quantity_value : event.target.value})
  }

  handleChange = (event) => {
    this.setState({order_status : event.target.value});
  };

  editOrder=(editing_product_id , editing_order_id, order_status, quantity_value)=>{
    this.setState({editing_product_id ,editing_order_id, order_status, quantity_value })
  }

  customerOrders =(id, name)=>{
    this.setState({selected_cutomer_id : id,editing_product_id : '' , editing_order_id : '', order_status:'', quantity_value:'', selected_cutomer_name :name,api_orders : true},()=>{
      ApiCall.getOrders(id)
        .then(values => {
          if(values.success){
            let products ={}
            if(values.result.length){
              values.result.forEach(element => {
                element.products.forEach(element2 =>{
                  if(products[element2._id]){
                    products[element2._id].quantity += element2.quantity
                  }else{
                    products[element2._id] = {
                      name : element2.name,
                      quantity : element2.quantity,
                      status : element2.status
                    }
                  }
                })
              })
            }
            this.setState({ orderDetails : values.result, api_orders: false , products} )
          }else{
            this.setState({error : "failed_fetch_orders", api_orders : false })
          }
        })
    })
  }

  getCustomers=()=>{
    this.setState({api_customer : true},()=>{
      ApiCall.getCustomers()
        .then(values => {
          if(values.success){
            this.setState({ customers : values.result, api_customer: false })
          }else{
            this.setState({error : "failed_fetch_customers", api_customer : false })
          }
        })
    })    
  }

  componentDidMount=()=>{
    this.getCustomers();
  }

  render(){
    return (
      <div>
        <div className="row m-0">
          {
            !this.state.api_customer ? 
            this.state.error == 'failed_fetch_customers' ? 'Failed to fetch customers' : 
            <div className="col-md-3 pt-3 pl-0 pr-0" style={{backgroundColor: "#ede8e8",overflow: 'auto', height: '100vh'}}>
              {this.customerList()}
            </div>
            :'Loading....'
          }
          <div className = "col-md-9" style={{backgroundColor: "white" , overflow : 'auto', height : '100vh'}}>
            {
              this.state.selected_cutomer_id && Object.keys(this.state.products).length ?
                <Fragment>
                  {this.productList()}
                  <Divider className="mt-2 mb-3" />
                  {this.orderList()}
                </Fragment>
                :
                <h5 className="m-5 text-center">
                  {this.state.selected_cutomer_id ? `${this.state.selected_cutomer_name}  has not ordered yet` : 'Select customers to show their orders'}
                </h5>
            }
          </div>
        </div>
      </div>      
    )
  }
}

export default App;
