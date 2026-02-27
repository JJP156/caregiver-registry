import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const RangeSlider = ({ 
  value = [25, 55], 
  onChange, 
  label = "Rango de Edad",
  className = ""
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);
  const sliderRef = useRef(null);

  const min = 18;
  const max = 80;
  const step = 1;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = (val) => {
    return ((val - min) / (max - min)) * 100;
  };

  const handleMouseDown = (e, thumb) => {
    setIsDragging(true);
    setActiveThumb(thumb);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round((percentage / 100) * (max - min) + min);

    if (activeThumb === 'min') {
      const newMinValue = Math.min(newValue, localValue[1] - step);
      setLocalValue([newMinValue, localValue[1]]);
    } else if (activeThumb === 'max') {
      const newMaxValue = Math.max(newValue, localValue[0] + step);
      setLocalValue([localValue[0], newMaxValue]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveThumb(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (onChange) {
      onChange(localValue);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
        <div className="text-sm text-primary font-medium">
          {localValue[0]} - {localValue[1]} años
        </div>
      </div>

      {/* Slider visual */}
      <div className="relative" ref={sliderRef}>
        {/* Track de fondo */}
        <div className="h-2 bg-gray-200 rounded-full">
          {/* Track activo */}
          <div 
            className="h-2 bg-primary rounded-full absolute top-0"
            style={{
              left: `${getPercentage(localValue[0])}%`,
              width: `${getPercentage(localValue[1]) - getPercentage(localValue[0])}%`
            }}
          />
        </div>

        {/* Thumb mínimo */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-primary rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
          style={{ left: `${getPercentage(localValue[0])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
        />

        {/* Thumb máximo */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-primary rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
          style={{ left: `${getPercentage(localValue[1])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
        />
      </div>

      {/* Marcadores de edad */}
      <div className="flex justify-between text-xs text-text-secondary">
        <span>18 años</span>
        <span>49 años</span>
        <span>80+ años</span>
      </div>
    </div>
  );
};

export default RangeSlider;
