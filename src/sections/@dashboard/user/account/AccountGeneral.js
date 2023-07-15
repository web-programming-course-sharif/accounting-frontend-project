import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useCallback} from 'react';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Alert, Box, Card, Grid, Stack, Typography} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import {fData} from '../../../../utils/formatNumber';
// _mock
import {countries} from '../../../../_mock';
// components
import {FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar} from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
    const {changeIsPublic} = useAuth();
    const {enqueueSnackbar} = useSnackbar();

    const {user} = useAuth();

    const UpdateUserSchema = Yup.object().shape({
        firstName: Yup.string().required('First name required'),
        lastName: Yup.string().required('Last name required'),
        phoneNumber: Yup.string().matches("\\d{9,}", "Phone number must be valid").required('Phone number is required'),
    });

    const defaultValues = {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        photoURL: user?.photoURL || '',
        phoneNumber: user?.phoneNumber || '',
        country: user?.country || '',
        address: user?.address || '',
        state: user?.state || '',
        city: user?.city || '',
        zipCode: user?.zipCode || '',
        about: user?.about || '',
        isPublic: user?.isPublic || '',
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        setError,
        setValue,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = methods;

    const onSubmit = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            enqueueSnackbar('Update success!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                setValue(
                    'photoURL',
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
            }
        },
        [setValue]
    );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{py: 10, px: 3, textAlign: 'center'}}>
                        <RHFUploadAvatar
                            name="photoURL"
                            accept="image/*"
                            maxSize={3145728}
                            onDrop={handleDrop}
                            helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 2,
                                        mx: 'auto',
                                        display: 'block',
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                    }}
                                >
                                    Allowed *.jpeg, *.jpg, *.png, *.gif
                                    <br/> max size of {fData(3145728)}
                                </Typography>
                            }
                        />

                        <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{mt: 5}}
                                   onChange={async (e) => {
                                       const newIsPublic = e.target.checked;
                                       setValue('isPublic', newIsPublic);
                                       try {
                                           await changeIsPublic(newIsPublic);
                                           enqueueSnackbar(`Public profile is ${newIsPublic ? 'ON' : 'OFF'}`)
                                       } catch (err) {
                                           console.error(err);
                                           setError('afterSubmit', {
                                               type: 'manual',
                                               message: 'Something wrong happened'
                                           })
                                           setValue('isPublic', user.isPublic)
                                       }
                                   }}/>
                        {!!errors.afterSubmit &&
                            <Alert sx={{mt: 2}} severity="error">{errors.afterSubmit.message}</Alert>}
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{p: 3}}>
                        <Box
                            sx={{
                                display: 'grid',
                                rowGap: 3,
                                columnGap: 2,
                                gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'},
                            }}
                        >
                            <RHFTextField name="firstName" label="First name"/>
                            <RHFTextField name="lastName" label="Last name"/>
                            <RHFTextField name="email" label="Email Address"/>

                            <RHFTextField name="phoneNumber" label="Phone Number"/>

                            <RHFSelect name="country" label="Country" placeholder="Country">
                                <option value=""/>
                                {countries.map((option) => (
                                    <option key={option.code} value={option.label}>
                                        {option.label}
                                    </option>
                                ))}
                            </RHFSelect>

                            <RHFTextField name="state" label="State/Region"/>
                            <RHFTextField name="city" label="City"/>

                            <RHFTextField name="zipCode" label="Zip code"/>
                        </Box>

                        <Stack spacing={3} alignItems="flex-end" sx={{mt: 3}}>
                            <RHFTextField name="address" label="Address" multiline rows={2}/>
                            <RHFTextField name="about" label="About" multiline rows={4}/>

                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save Changes
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
