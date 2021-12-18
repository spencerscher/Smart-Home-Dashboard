import React, { Component } from 'react';
import Dashboard from './Dashboard';
import HeaderDashboard from './HeaderDashboard';

class DashboardPage extends Component {
    checkAuth = () => {
        if (window.localStorage.getItem("token")) {
            console.log("Token present: authenticated.");
        }
        else{
            window.location.replace("/login");
        }
    }

    render() {
        return (
            this.checkAuth(),
            <div>
                <HeaderDashboard />
                <Dashboard />
            </div>
        );
    }
}

export default DashboardPage;