"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

interface CaptchaWidgetProps {
  onValidate: (isValid: boolean) => void;
}

export default function CaptchaWidget({ onValidate }: CaptchaWidgetProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);

  const generateCaptcha = useCallback(() => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserInput("");
    setError(false);
    onValidate(false);
  }, [onValidate]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setUserInput(val);
    const expected = num1 + num2;
    if (val === String(expected)) {
      setError(false);
      onValidate(true);
    } else {
      if (val.length >= String(expected).length) {
        setError(true);
      } else {
        setError(false);
      }
      onValidate(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-bste-navy-600" />
        <span className="text-xs font-semibold text-slate-700">Security Verification:</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-bste-navy-800 to-bste-navy-950 text-bste-gold font-mono font-bold px-3 py-1.5 rounded tracking-widest text-sm select-none border border-bste-gold/40 shadow-inner">
          {num1} + {num2} = ?
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-1.5 text-slate-500 hover:text-bste-navy-800 hover:bg-slate-200 rounded transition-colors"
          title="Regenerate Captcha"
          aria-label="Regenerate Captcha"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 min-w-[120px]">
        <input
          type="text"
          placeholder="Enter sum"
          value={userInput}
          onChange={handleChange}
          className={`w-full px-3 py-1.5 text-xs rounded border transition-colors outline-none font-mono ${
            error
              ? "border-red-400 bg-red-50 text-red-700"
              : userInput && userInput === String(num1 + num2)
              ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold"
              : "border-slate-300 focus:border-bste-navy-600 bg-white"
          }`}
          maxLength={3}
        />
      </div>
    </div>
  );
}
