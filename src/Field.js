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
    const { values } = _forms;
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
      default:
        input = { value };
    }
    return {
      input,
    };
  }
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
    } = this.props;
    let value = compose(
      this.normalize,
      this.getValue
    )(e);
    change(name, value);
  };
  render() {
    const { component = 'input' } = this.props;
    const { input } = this.state;
    const { value = '', ...rest } = input;
    if (typeof component === 'string') {
      return createElement(component, {
        ...this.props,
        ...rest,
        value: this.format(value),
        onChange: this.handleChange,
        ref: this.saveRef,
      });
    } else {
      return createElement(component, {
        input: {
          ...input,
          onChange: this.handleChange,
        },
      });
    }
  }
}
