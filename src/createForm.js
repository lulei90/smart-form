import { Component } from 'react';
import FormContext from './createContext';
import { getDisplayName, getValid, compose, isFun } from './utils';
const createForm = (options = {}) => WrapComponent => {
  class FormContainer extends Component {
    constructor(props) {
      super(props);
      const { initialValues = {}, trigger = 'change' } = options;
      this.state = {
        values: initialValues,
        trigger,
        isValid: true,
        errors: {},
        _error: '',
      };
    }
    _judgeError = errors => {
      const { _error, ...rest } = errors;
      const isValid = !(Object.values(errors).length > 0);
      return {
        isValid,
        _error,
        errors: rest,
      };
    };

    _check = values => {
      const { validate } = options;
      if (isFun(validate)) {
        return compose(
          this._judgeError,
          validate
        )(values);
      }
      return {
        isValid: true,
        errors: {},
        _error: '',
      };
    };
    reset = () => {
      //重置数据为初始数据
      const { initialValues = {} } = options;
      this.setState({
        values: initialValues,
      });
    };
    _editValues = key => (name, value) => {
      const { [key]: _ } = this.state;
      const obj = Object.assign({}, _, {
        [name]: value,
      });
      return {
        [key]: getValid(obj),
      };
    };
    blur = () => {
      const { trigger, values } = this.state;
      if (trigger === 'blur') {
        this.setState(this._check(values));
      }
    };
    _change = (name, value) => {
      const { onChange } = options;
      const { trigger } = this.state;
      const data = this._editValues('values')(name, value);
      onChange && onChange(data['values'], this.props);
      if (trigger === 'change') {
        return {
          ...data,
          ...this._check(data['values']),
        };
      }
      return {
        ...data,
      };
    };
    render() {
      const { values, errors } = this.state;
      const setState = this.setState.bind(this);
      const formControl = {
        reset: this.reset,
        change: compose(
          setState,
          this._change
        ),
        setError: compose(
          setState,
          this._judgeError,
          ({ errors }) => errors,
          this._editValues('errors')
        ),
        blur: this.blur,
      };
      return (
        <FormContext.Provider
          value={{
            values,
            errors,
            ...formControl,
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
