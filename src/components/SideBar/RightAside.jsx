import React from 'react';
import HeadTeacher from './HeadTeacher';
import President from './President';
import Gap from '../Gap/Gap';
import Hotline from './Hotline';

const RightAside = () => {
    return (
        <div >
           <HeadTeacher/>
           <Gap value={5}/>
           <President/>
           <Gap value={5}/>
           <Hotline/>
        </div>
    );
};

export default RightAside;