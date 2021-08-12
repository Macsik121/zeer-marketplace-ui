import React from 'react';

export default class Statistics extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.props.SearchToRender && this.props.renderSearchBar(null);
    }
    render() {
        return (
            <div className="statistics">
                Statistics component
            </div>
        )
    }
}
