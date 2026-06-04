import React from 'react';

const Input = ({ type, name, value, placeholder, required = false, inputRef, onChange, onKeyUp = null, spellCheck = true, autoComplete }) => {
     return (
          <input
               ref={inputRef}
               type={type}
               onKeyUp={onKeyUp}
               onChange={onChange}
               value={value}
               name={name}
               id={name}
               placeholder={placeholder}
               required={required}
               className='input-field'
               spellCheck={spellCheck}
               autoComplete={autoComplete}
          />
     );
}

export default Input;
