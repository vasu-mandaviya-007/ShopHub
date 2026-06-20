import React from 'react';
// import './SelectBox.css';

const SelectBox = () => {
     return (
          <div className='select-box'>

               <form>
                    <input type="checkbox" id="options-checkbox-btn" />
                    <div id="select-btn" className="fx fx-justify-between">
                         <div id="selected-value">
                              <span>Select a platform</span>
                         </div>
                         <div id="chevrons">
                              <i className="fas fa-chevron-up"></i>
                              <i className="fas fa-chevron-down"></i>
                         </div>
                    </div>
                    <div id="options">
                         <div className="option">
                              <input className="option-radio-btn top" type="radio" name="platform" value="codepen" />
                              <i className="fab fa-codepen"></i>
                              <span className="option-label">Male</span>
                         </div>
                         <div className="option">
                              <input className="option-radio-btn top" type="radio" name="platform" value="dribbble" />
                              <i className="fab fa-dribbble"></i>
                              <span className="option-label">Female</span>
                         </div>
                         <div className="option">
                              <input className="option-radio-btn top" type="radio" name="platform" value="behance" />
                              <i className="fab fa-behance"></i>
                              <span className="option-label">Kids</span>
                         </div>
                         <div id="option-bg"></div>
                    </div>
               </form>
          </div>
     );
}

export default SelectBox;
