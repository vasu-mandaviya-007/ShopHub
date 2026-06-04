import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const Super = () => {
     
     const [isAuth, setisAuth] = useState(false);



     if(isAuth)
     {
          return <Outlet/>;
     }else{
          return <Navigate to={"/login"} />;
     }

}

export default Super;
