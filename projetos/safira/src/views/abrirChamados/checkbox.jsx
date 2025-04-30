import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Checkboxes = ({ type = 'checkbox', name, checked = false, onChange }) => (
  <>
        <FormControlLabel
          value="end"
          control={<Checkbox color="primary" checked={checked} onChange={onChange} />}
          label={name}
          name={name}
          labelPlacement="end"
        />
</>
);

Checkboxes.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkboxes;