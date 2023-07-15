import {useState} from "react";
import {Link as RouterLink, useLocation} from 'react-router-dom';
import Countdown from 'react-countdown';
// @mui
import {styled} from '@mui/material/styles';
import {Box, Button, Container, Link, Typography} from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import {PATH_AUTH} from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
import {VerifyCodeForm} from '../../sections/auth/verify-code';
import useAuth from "../../hooks/useAuth";
import useIsMountedRef from "../../hooks/useIsMountedRef";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
    const {resendCode} = useAuth();
    const {state} = useLocation();
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [isError, setIsError] = useState(false);
    const isMountedRef = useIsMountedRef();

    function getResendCodeTypography() {
        return (
            <Typography variant="body2" align="center">
                {
                    isError ?
                        'Something went wrong, please try again. '
                        :
                        'Don’t have a code? '
                }
                <Link variant="subtitle2" underline="none" sx={{cursor: 'pointer'}}
                      onClick={async () => {
                          try {
                              await resendCode(state.phoneNumber);
                              setIsCountingDown(true);
                              setIsError(false);
                          } catch (error) {
                              console.error(error);
                              if (isMountedRef.current) {
                                  setIsCountingDown(false);
                                  setIsError(true);
                              }
                          }
                      }}>
                    Resend code
                </Link>
            </Typography>
        )
    }

    return (
        <Page title="Verify" sx={{height: 1}}>
            <RootStyle>
                <LogoOnlyLayout/>

                <Container>
                    <Box sx={{maxWidth: 480, mx: 'auto'}}>
                        <Button
                            size="small"
                            component={RouterLink}
                            to={PATH_AUTH.register}
                            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20}/>}
                            sx={{mb: 3}}
                        >
                            Back
                        </Button>

                        <Typography variant="h3" paragraph>
                            Please check your phone!
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            We have sent a 6-digit confirmation code to {state.phoneNumber}, please enter the code in
                            below box to verify
                            your phone number.
                        </Typography>

                        <Box sx={{mt: 2, mb: 3}}>
                            <VerifyCodeForm/>
                        </Box>


                        {
                            isCountingDown ?
                                <Countdown date={Date.now() + 60 * 1000} renderer={({minutes, seconds}) => (
                                    <Typography variant="body2" align="center">
                                        Resend code in {minutes}:{seconds.toFixed(0).padStart(2, '0')}
                                    </Typography>
                                )}
                                           onStart={() => setIsCountingDown(true)}
                                           onComplete={() => setIsCountingDown(false)}
                                />
                                :
                                getResendCodeTypography()
                        }
                    </Box>
                </Container>
            </RootStyle>
        </Page>
    );
}
