import React, {useEffect} from 'react';
import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import {SignUp} from "./components/SignUp";
import {getToken} from "./global/Storages";

function App() {
    const navigate = useNavigate()

    useEffect(() => {
        if (getToken() === null)
            navigate('sign-up')
        else
            navigate('home')
    }, [])

    return (
        <div>
            <Routes>
                <Route path="/sign-up" element={<SignUp/>}/>
                {/*    <Route path="/sign-up-confirm" element={<SignUpConfirm/>}/>*/}
                {/*    <Route path="/sign-in" element={<SignInForm/>}/>*/}


                {/*    <Route path={`/home/${homeTabsEndingUrl.myTeam}/${subTabsEndingUrl.schematic}`} element={*/}
                {/*        <Home mainTab={<MyTeam subTab={'schematic'}/>}/>*/}
                {/*    }/>*/}
                {/*    <Route path={`/home/${homeTabsEndingUrl.myTeam}/${subTabsEndingUrl.list}`} element={*/}
                {/*        <Home mainTab={<MyTeam subTab={'list'}/>}/>*/}
                {/*    }/>*/}
                {/*    <Route path={`/home/${homeTabsEndingUrl.transfers}/${subTabsEndingUrl.schematic}`} element={*/}
                {/*        <Home mainTab={<Transfers subTab={'schematic'}/>}/>*/}
                {/*    }/>*/}
                {/*    <Route path={`/home/${homeTabsEndingUrl.transfers}/${subTabsEndingUrl.list}`} element={*/}
                {/*        <Home mainTab={<Transfers subTab={'list'}/>}/>*/}
                {/*    }/>*/}
                {/*    <Route path={`/home/${homeTabsEndingUrl.events}`} element={*/}
                {/*        <Home mainTab={<LatestEvents/>}/>*/}
                {/*    }/>*/}
                {/*    <Route path={`/home/${homeTabsEndingUrl.profile}`} element={*/}
                {/*        <Home mainTab={<Profile/>}/>*/}
                {/*    }/>*/}
                {/*    <Route path={`/home/${homeTabsEndingUrl.prizes}`} element={*/}
                {/*        <Home mainTab={<Prizes/>}/>*/}
                {/*    }/>*/}
            </Routes>

            {/*<div id={'modals-div'} style={{display: removePlayerModalDisplay}}>*/}
            {/*    <RemovePlayerModal/>*/}
            {/*</div>*/}
            {/*<div id={'modals-div'} style={{display: profileModalDisplay}}>*/}
            {/*    <ProfileModal/>*/}
            {/*</div>*/}
            {/*<div id={'modals-div'} style={{display: substitutionModalDisplay}}>*/}
            {/*    <SubstitutionModal/>*/}
            {/*</div>*/}
        </div>
    );
}

export default App;
