import React, { useState } from 'react';
import Fav from './Fav/Fav';
import RecentDis from './RecentDis/RecentDis';



export default function Project() {
    return (
        <>
            <div className="w-2/4 px-4">
                <Fav/>
                <RecentDis/>
            </div>
        </>
    )
}