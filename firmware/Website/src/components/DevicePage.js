import React, { Component } from 'react';
import Device from './DeviceForm';
import HeaderDashboard from './HeaderDashboard';

class DevicePage extends Component {
    checkAuth = () => {
        if (window.localStorage.getItem("token")) {
            console.log("Token present: authenticated.");
        }
        else{
            window.location.replace("/");
        }
    }
    render() {
        return (
            this.checkAuth(),
            <div>
                <HeaderDashboard />
                <Device />
            </div>
        );
    }
}

export default DevicePage;