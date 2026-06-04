import React from 'react';
import Hero from '../components/Hero';
import Popular from '../components/Popular';
import Offers from '../components/Offers';
import NewCollections from '../components/NewCollections';
import NewLetter from '../components/NewLetter';

const Shop = () => {
     
     return (
          <div>
               <Hero /> 
               <Popular /> 
               <Offers />
               <NewCollections/>
               <NewLetter/> 
          </div>
     );
}

export default Shop;
