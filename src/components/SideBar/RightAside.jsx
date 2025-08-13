import React from 'react';
import HeadTeacher from './HeadTeacher';
import President from './President';
import Gap from '../Gap/Gap';
import Hotline from './Hotline';
import ImportentLink from '../ImportentLink/ImportentLink';

const RightAside = () => {
    return (
        <div >
           <Gap value={5}/>
           <HeadTeacher/>
           <Gap value={5}/>
           <President/>
           <Gap value={5}/>
           <ImportentLink/>
           <Gap value={5}/>
           <Hotline/>
        </div>
    );
};

export default RightAside;