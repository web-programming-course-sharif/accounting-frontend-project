import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
// @mui
import {Alert, Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import {FormProvider, RHFTextField} from '../../../components/hook-form';
import useAuth from "../../../hooks/useAuth";

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
    onSent: PropTypes.func,
    onGetPhoneNumber: PropTypes.func,
};

export default function ResetPasswordForm({onSent, onGetPhoneNumber}) {
    const isMountedRef = useIsMountedRef();
    const {resetPassword} = useAuth();

    const ResetPasswordSchema = Yup.object().shape({
        phoneNumber: Yup.string().matches("\\d{9,}","Phone number must be valid").required('Phone number is required')
    });

    const methods = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: { phoneNumber: '' },
    });

    const {
        setError,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = methods;

    const onSubmit = async (data) => {
        try {
            await resetPassword(data.phoneNumber);
            if (isMountedRef.current) {
                onSent();
                onGetPhoneNumber(data.phoneNumber);
            }
        } catch (error) {
            console.error(error);
            if (isMountedRef.current) {
                setError('afterSubmit', error);
            }
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                <RHFTextField name="phoneNumber" label="Phone number"/>

                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Reset Password
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}
