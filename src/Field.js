import {Component,createElement} from 'react';
import {FormContext} from './index';

export default class Field extends Component{
  getComponentProps=(contextValue)=>{
    const {type,name,value} = this.props;
    const newProps={};
    if (type ==='checkbox'){
      newProps.checked = contextValue.values[name] || false;
    }else if(type === 'radio'){
      newProps.checked = contextValue.values[name] === value;
    }else{
      newProps.value = contextValue.values[name]||'';
    }
    return Object.assign({},this.props,contextValue,newProps);
  }
  render(){
    return(
      <FormContext.Consumer>
        {
          contextValue =>{
            const {component} = this.props;
            const componentProps = this.getComponentProps(contextValue);
            return createElement(
              component,
              componentProps
            )
          }
        }
      </FormContext.Consumer>
    )
  }
}
