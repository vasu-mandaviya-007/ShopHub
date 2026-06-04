/**
 * AuthField — floating-label input with inline validation state
 * Replaces the ref-based DOM manipulation pattern with React state.
 *
 * Props:
 *   type, name, value, onChange, onKeyUp, placeholder,
 *   label, error, success, inputRef,
 *   showToggle (bool) — shows eye icon for password fields
 */
import React, { useState } from 'react';

const AuthField = ({
    type = 'text',
    name,
    value,
    onChange,
    onKeyUp,
    label,
    error,
    success,
    inputRef,
    autoComplete = 'off',
    spellCheck = false,
}) => {
    const [showPass, setShowPass] = useState(false);
    const isPassword = type === 'password';
    const resolvedType = isPassword ? (showPass ? 'text' : 'password') : type;

    const borderColor = error
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
        : success
            ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
            : 'border-zinc-200 focus:border-zinc-800 focus:ring-zinc-800/10';

    const labelColor = error
        ? 'text-rose-500'
        : success
            ? 'text-emerald-500'
            : 'text-zinc-400';

    return (
        <div className="flex flex-col gap-1.5">
            <div className="relative">
                <input
                    ref={inputRef}
                    type={resolvedType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    placeholder=" "           /* Keep placeholder=" " for :placeholder-shown trick */
                    autoComplete={autoComplete}
                    spellCheck={spellCheck}
                    className={`peer w-full h-12 px-4 pt-3 pb-3 rounded-xl border-2 bg-white text-sm text-zinc-800
            outline-none transition-all duration-200 focus:ring-4
            ${borderColor}
            ${isPassword ? 'pr-10' : success ? 'pr-10' : ''}`}
                />

                {/* Floating label */}
                <label
                    className={`absolute left-4 top-3 text-sm pointer-events-none transition-all duration-200
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
            peer-focus:-top-2 peer-focus:text-[11px] peer-focus:px-1 peer-focus:bg-white
            peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[11px]
            peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:bg-white
            ${labelColor}`}
                >
                    {label}
                </label>

                {/* Right icon — eye toggle or success check */}
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <i className={`fa-regular ${showPass ? 'fa-eye' : 'fa-eye-slash'} text-base`} />
                    </button>
                )}
                {!isPassword && success && (
                    <i className="fa-solid fa-circle-check absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-base" />
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 pl-1 animate-[fadeUp_0.2s_ease-out]">
                    <i className="fa-solid fa-circle-exclamation text-[11px]" />
                    {error}
                </p>
            )}

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AuthField;