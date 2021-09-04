import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default function ChoosingCostModal({
    style
}) {
    return (
        <div
            className="choosing-cost-modal"
            style={style}
        >
            <div className="heading">
                <h3>Выберите количество дней.</h3>
                <CloseIcon className="close-icon" />
            </div>
        </div>
    )
}
