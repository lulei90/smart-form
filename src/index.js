import {createContext,Component} from 'react';

const FormContext = createContext(null);

const createForm =(options)=> (WrapComponent)=>{
  class FormContainer extends Component{
    constructor(props){
      super(props);
      const {initialValues={}} = options;
      this.state={
        values:initialValues,
        errors:{},
      }
    }
    reset=()=>{
      //重置数据为初始数据
      const {initialValues={}} = options;
      this.setState({
        values:initialValues
      })
    }
    change=(name,value)=>{
      const {values} = this.state;
      const nextValue = Object.assign({},values,{
        [name]:value
      });
      this.setState({
        values:nextValue
      })
    }
    onChange=(e)=>{
      const {target}=e;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.change(name,value)
    }
    render(){
      const {values}= this.state;
      const contextValues={
        values,
        onChange:this.onChange,
      }
      const formControl = {
        reset:this.reset,
        change:this.change
      }
      return(<FormContext.Provider value={contextValues}>
        <WrapComponent {...formControl} {...this.props}/>
      </FormContext.Provider>)
    }
  }
  FormContainer.displayName = 'FormContainer';
  return FormContainer;
}

export default createForm;
export {FormContext};
