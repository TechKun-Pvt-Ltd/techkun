/** @jsxImportSource @emotion/react */
import {useState, ChangeEvent, FocusEvent, useRef} from "react";
import { css } from "@emotion/react";

interface SliderNumberInputProps {
    min?: number;
    max?: number;
    step?: number;
    initialValue?: number;
    onChange(num: number): void;
}

const rowStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const sliderStyle = css`
  flex: 1;
  height: 0.5rem;
  border-radius: 9999px;
  appearance: none;
  background: #e5e5e5;
  accent-color: #171717;
  cursor: pointer;
`;

const numberInputStyle = css`
  width: 4rem;
  border-radius: 0.5rem;
  border: 1px solid #d4d4d4;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #171717;
  text-align: center;

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #171717;
  }
`;

export default function SliderNumberInput({
    min = 0, max = 100,
    step = 1,
    initialValue = 50,
    onChange
}: SliderNumberInputProps) {
    const sliderRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    function clamp(n: number) {
        return Math.min(max, Math.max(min, n));
    }
    function changeValue(newValue: number) {
        if (inputRef.current)
            inputRef.current.value = String(newValue);
        onChange(newValue);
    }

    function handleSliderChange(e: ChangeEvent<HTMLInputElement>) {
        changeValue(Number(e.target.value));
    }
    function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;
        const num = Number(raw);
        if (raw === "")
            changeValue(min);
        else if (!Number.isNaN(num))
            changeValue(num);
    }
    function handleNumberBlur(e: FocusEvent<HTMLInputElement>) {
        const currentValue = e.target.value;
        const number = Number(currentValue);
        changeValue(currentValue === "" || Number.isNaN(number) ? min : clamp(number));
    }

    return <div css={rowStyle}>
        <input
            ref={sliderRef}
            type="range"
            min={min}
            max={max}
            step={step}
            defaultValue={initialValue}
            onChange={handleSliderChange}
            css={sliderStyle}
        />
        <input
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            step={step}
            defaultValue={initialValue}
            onChange={handleNumberChange}
            onBlur={handleNumberBlur}
            css={numberInputStyle}
        />
    </div>;
}