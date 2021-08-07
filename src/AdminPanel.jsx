import React from 'react';
import jwtDecode from 'jwt-decode';

export default class AdminPanel extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="admin-panel">
                <h2>Admin Panel Component</h2>
            </div>
        )
    }
}
