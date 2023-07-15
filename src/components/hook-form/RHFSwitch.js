import PropTypes from 'prop-types';
// form
import {Controller, useFormContext} from 'react-hook-form';
// @mui
import {FormControlLabel, Switch} from '@mui/material';

// ----------------------------------------------------------------------

RHFSwitch.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func
};

export default function RHFSwitch({name, onChange, ...other}) {
    const {control} = useFormContext();

    return (
        <FormControlLabel
            control={
                <Controller name={name} control={control}
                            render={({field}) =>
                                <Switch {...field} checked={field.value} onChange={onChange}/>}/>
            }
            {...other}
        />
    );
}
