import { createElement, createRef, Component } from 'react';
import createField from './createField';
import { isFun, compose } from './utils';

@createField
export default class Field extends Component {
  constructor(props) {
    super(props);
    if (!props._forms) {
      throw new Error('Field must be inside a component decorated with createForm()');
    }
    this.state = {
      input: {
        value: '',
      },
    };
    this.saveRef = createRef();
  }
  static getDerivedStateFromProps(props, state) {
    const { _forms, name, type, value: _value } = props;
    const { values, errors } = _forms;
    let value = values[name],
      input;
    switch (type) {
      case 'checkbox':
        input = { checked: !!value };
        break;
      case 'radio':
        input = {
          checked: value === _value,
          value: _value,
        };
        break;
      case 'file':
        input = {
          value: value || void 0,
        };
        break;
      default:
        input = { value };
    }
    return {
      input,
      error: errors[name],
    };
  }
  validate = value => {
    const {
      _forms: { values },
      validate,
      name,
    } = this.props;
    let error = '';
    if (isFun(validate)) {
      error = validate(value, values, name);
    }
    return error;
  };
  format = value => {
    const { format } = this.props;
    if (isFun(format)) {
      value = format(value);
    }
    return value;
  };
  normalize = value => {
    const { normalize } = this.props;
    if (isFun(normalize)) {
      return normalize(value);
    }
    return value;
  };
  getValue = e => {
    const {
      target: { type, value, checked, files },
    } = e;
    if (type === 'checkbox') {
      return !!checked;
    }
    if (type === 'file') {
      return files;
    }
    return value;
  };
  handleChange = e => {
    const {
      _forms: { change },
      name,
      onChange,
    } = this.props;
    let value = compose(
      this.normalize,
      this.getValue
    )(e);
    if (isFun(onChange)) {
      onChange(e);
    }
    change(name, value);
    this.value = value;
  };
  handleBlur = e => {
    const {
      _forms: { blur },
      onBlur,
    } = this.props;
    if (isFun(onBlur)) {
      onBlur(e);
    }
    blur();
  };
  render() {
    const { component = 'input', format, normalize, _forms, ...props } = this.props;
    const { input, error } = this.state;
    let { value = '', ...rest } = input;

    if (typeof component === 'string') {
      return createElement(component, {
        ...props,
        ...rest,
        error,
        value: this.format(value),
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        ref: this.saveRef,
      });
    } else {
      return createElement(component, {
        ...props,
        input: {
          ...input,
          onChange: this.handleChange,
        },
        ref: this.saveRef,
      });
    }
  }
}
