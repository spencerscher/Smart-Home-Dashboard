import React, { Component } from 'react';
import Header from './HeaderDashboard';
import UpdateForm from './UpdateForm'

class UpdatePage extends Component {
    render() {
        return (
            <div>
              <Header/>
              <UpdateForm/>
            </div>
        );
    }
}

export default UpdatePage;