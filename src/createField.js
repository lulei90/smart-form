import { Component, forwardRef } from 'react';
import FormContext from './createContext';
import { getDisplayName } from './utils';

export const createField = WrapComponent => {
  class CreateField extends Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <FormContext.Consumer>
          {value => <WrapComponent _forms={value} ref={forwardedRef} {...rest} />}
        </FormContext.Consumer>
      );
    }
  }
  const refComponent = (props, ref) => <CreateField {...props} forwardedRef={ref} />;

  refComponent.displayName = `CreateField(${getDisplayName(WrapComponent)})`;
  return forwardRef(refComponent);
};

export default createField;
