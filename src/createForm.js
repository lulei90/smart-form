import { Component } from 'react';
import FormContext from './createContext';
import { getDisplayName } from './utils';
const createForm = (options = {}) => WrapComponent => {
  class FormContainer extends Component {
    constructor(props) {
      super(props);
      const { initialValues = {} } = options;
      this.state = {
        values: initialValues,
        ...this._validate(initialValues),
      };
    }
    _validate = values => {
      const { validate } = options;
      const { _error = false, ...errors } = (validate && validate(values)) || {};
      return {
        errors,
        _error,
      };
    };
    reset = () => {
      //重置数据为初始数据
      const { initialValues = {} } = options;
      this._setValues(initialValues);
    };
    change = (name, value) => {
      const { values } = this.state;
      const { [name]: _, ...other } = values;
      let nextValue;
      // 判断value值是否为除boolean值之外的任何false值
      if (value !== false && !value) {
        nextValue = other;
      } else {
        nextValue = Object.assign({}, other, {
          [name]: value,
        });
      }
      this._setValues(nextValue);
    };
    _setValues = values => {
      const { onChange } = options;
      this.setState({
        values,
        ...this._validate(values),
      });
      onChange && onChange(values, this.props);
    };
    render() {
      const { values } = this.state;
      const formControl = {
        reset: this.reset,
        change: this.change,
      };
      return (
        <FormContext.Provider
          value={{
            values,
            change: this.change,
          }}
        >
          <WrapComponent {...this.props} {...formControl} />
        </FormContext.Provider>
      );
    }
  }
  FormContainer.displayName = `FormContainer(${getDisplayName(WrapComponent)})`;
  return FormContainer;
};

export default createForm;
