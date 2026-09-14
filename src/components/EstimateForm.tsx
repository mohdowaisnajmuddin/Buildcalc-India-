import React, { useState } from 'react';
import { Calculator, MapPin, AlertCircle } from 'lucide-react';
import type { CityId, EstimateInput, MaterialGrade, SoilType } from '../types.js';

interface EstimateFormProps {
  input: EstimateInput;
  onChange: (newInput: EstimateInput) => void;
  onCalculate: (input: EstimateInput) => void;
  hasCalculated: boolean;
  isLoading: boolean;
}

export const EstimateForm: React.FC<EstimateFormProps> = ({
  input,
  onChange,
  onCalculate,
  hasCalculated,
  isLoading,
}) => {
  const [areaError, setAreaError] = useState<string | null>(null);
  const [floorsError, setFloorsError] = useState<string | null>(null);

  const validate = (areaVal: number, floorVal: number): boolean => {
    let valid = true;
    if (isNaN(areaVal) || areaVal <= 0) {
      setAreaError('Built-up area must be a positive number.');
      valid = false;
    } else if (areaVal < 100) {
      setAreaError('Minimum recommended area is 100 sq ft.');
      valid = false;
    } else if (areaVal > 100000) {
      setAreaError('Exceeds residential capacity (1,00,000 sq ft).');
      valid = false;
    } else {
      setAreaError(null);
    }

    if (isNaN(floorVal) || floorVal < 1 || floorVal > 10) {
      setFloorsError('Floors must be between 1 and 10.');
      valid = false;
    } else {
      setFloorsError(null);
    }

    return valid;
  };

  const handleCityChange = (city: CityId) => {
    const updated = { ...input, city };
    onChange(updated);
    if (hasCalculated && validate(updated.areaSqft, updated.floors)) {
      onCalculate(updated);
    }
  };

  const handleAreaChange = (raw: string) => {
    const num = Number(raw);
    const updated = { ...input, areaSqft: isNaN(num) ? 0 : num };
    onChange(updated);
    const isValid = validate(num, input.floors);
    if (hasCalculated && isValid) {
      onCalculate(updated);
    }
  };

  const handleAreaPreset = (preset: number) => {
    const updated = { ...input, areaSqft: preset };
    onChange(updated);
    validate(preset, input.floors);
    if (hasCalculated) {
      onCalculate(updated);
    }
  };

  const handleFloorsChange = (floors: number) => {
    const updated = { ...input, floors };
    onChange(updated);
    const isValid = validate(input.areaSqft, floors);
    if (hasCalculated && isValid) {
      onCalculate(updated);
    }
  };

  const handleGradeChange = (materialGrade: MaterialGrade) => {
    const updated = { ...input, materialGrade };
    onChange(updated);
    if (hasCalculated && validate(input.areaSqft, input.floors)) {
      onCalculate(updated);
    }
  };

  const handleSoilChange = (soilType: SoilType) => {
    const updated = { ...input, soilType };
    onChange(updated);
    if (hasCalculated && validate(input.areaSqft, input.floors)) {
      onCalculate(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate(input.areaSqft, input.floors)) {
      onCalculate(input);
    }
  };

  return (
    <form
      id="estimate-form"
      onSubmit={handleSubmit}
      className="bg-[#151518] border border-[#272730] rounded-2xl p-5 sm:p-7 space-y-6"
    >
      <div>
        <h2 className="text-base font-medium text-white tracking-tight">Project Parameters</h2>
        <p className="text-xs font-normal text-neutral-400 mt-1">
          Specify location, floor area, and structural specifications for an ML-calibrated construction benchmark.
        </p>
      </div>

      {/* City Selector */}
      <div className="space-y-2">
        <label htmlFor="city-select" className="flex items-center gap-1.5 text-xs font-normal text-neutral-300">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>City / Schedule of Rates</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'hyderabad', name: 'Hyderabad', base: '₹1,850/sqft', code: 'TSSOR' },
            { id: 'bangalore', name: 'Bangalore', base: '₹2,050/sqft', code: 'KPWD' },
            { id: 'mumbai', name: 'Mumbai', base: '₹2,450/sqft', code: 'MAHA PWD' },
            { id: 'delhi_ncr', name: 'Delhi NCR', base: '₹1,950/sqft', code: 'CPWD' },
          ].map((c) => {
            const isSelected = input.city === c.id;
            return (
              <button
                key={c.id}
                type="button"
                id={`city-btn-${c.id}`}
                onClick={() => handleCityChange(c.id as CityId)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/60'
                    : 'border-[#272730] bg-[#1b1b22] hover:bg-[#22222a] text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{c.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">{c.code}</span>
                </div>
                <div className="text-xs font-normal text-neutral-400 mt-0.5">Base: {c.base}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Built-up Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="area-input" className="text-xs font-normal text-neutral-300">
            Total Built-up Area (Sq Ft)
          </label>
          <div className="flex items-center gap-1">
            {[1000, 1500, 2400, 3500].map((preset) => (
              <button
                key={preset}
                type="button"
                id={`preset-area-${preset}`}
                onClick={() => handleAreaPreset(preset)}
                className={`text-[11px] px-2 py-0.5 rounded-md border font-normal transition-colors cursor-pointer ${
                  input.areaSqft === preset
                    ? 'bg-amber-500 text-neutral-950 font-medium border-amber-500'
                    : 'bg-[#1b1b22] hover:bg-[#24242d] text-neutral-400 border-[#272730]'
                }`}
              >
                {preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <input
            id="area-input"
            type="number"
            min="100"
            max="100000"
            step="50"
            value={input.areaSqft || ''}
            onChange={(e) => handleAreaChange(e.target.value)}
            placeholder="e.g. 1800"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none ${
              areaError
                ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-950/20 text-red-300'
                : 'border-[#272730] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-[#1b1b22] text-white'
            }`}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-normal pointer-events-none">
            sq ft
          </div>
        </div>
        {areaError && (
          <p id="area-error-msg" className="flex items-center gap-1 text-xs text-red-400 font-normal mt-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{areaError}</span>
          </p>
        )}
      </div>

      {/* Floors Selector */}
      <div className="space-y-2">
        <label className="text-xs font-normal text-neutral-300">
          Building Elevation / Number of Floors
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { floors: 1, label: 'G only' },
            { floors: 2, label: 'G + 1' },
            { floors: 3, label: 'G + 2' },
            { floors: 4, label: 'G + 3' },
            { floors: 5, label: 'G + 4' },
          ].map((f) => {
            const isSelected = input.floors === f.floors;
            return (
              <button
                key={f.floors}
                type="button"
                id={`floor-btn-${f.floors}`}
                onClick={() => handleFloorsChange(f.floors)}
                className={`py-2 px-1 rounded-xl text-center border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-medium ring-1 ring-amber-500/50'
                    : 'border-[#272730] bg-[#1b1b22] hover:bg-[#22222a] text-neutral-300 font-normal'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        {floorsError && (
          <p id="floors-error-msg" className="text-xs text-red-400 font-normal">
            {floorsError}
          </p>
        )}
      </div>

      {/* Material Grade */}
      <div className="space-y-2">
        <label className="text-xs font-normal text-neutral-300">
          Material Grade & Finish Quality
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: 'standard',
              name: 'Standard',
              mult: '1.0× Base',
              desc: 'Fe500D steel, OPC 53, 2x2 vitrified tiles, standard UPVC',
            },
            {
              id: 'premium',
              name: 'Premium',
              mult: '1.28× Base',
              desc: 'Fe550D TMT, 4x2 GVT tiles, Kohler/Jaquar, teak frames',
            },
            {
              id: 'luxury',
              name: 'Luxury',
              mult: '1.65× Base',
              desc: 'Italian marble, Toto fixtures, DGU glass, smart automation',
            },
          ].map((g) => {
            const isSelected = input.materialGrade === g.id;
            return (
              <button
                key={g.id}
                type="button"
                id={`grade-btn-${g.id}`}
                onClick={() => handleGradeChange(g.id as MaterialGrade)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/60'
                    : 'border-[#272730] bg-[#1b1b22] hover:bg-[#22222a] text-neutral-300'
                }`}
              >
                <div className="text-xs font-medium text-white">{g.name}</div>
                <div className="text-[11px] text-amber-400 font-mono mt-0.5">{g.mult}</div>
                <div className="text-[10px] text-neutral-400 font-normal mt-1 leading-snug line-clamp-2">
                  {g.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Soil Type / Geotechnical */}
      <div className="space-y-2">
        <label className="text-xs font-normal text-neutral-300">
          Soil Strata / Foundation Condition
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              id: 'normal',
              name: 'Normal Loam / Red Soil',
              surcharge: '+0% Foundation',
              desc: 'Standard isolated column footings (5–6 ft depth).',
            },
            {
              id: 'sandy_rocky',
              name: 'Hard Rocky / Sandy',
              surcharge: '+6.5% Foundation',
              desc: 'Requires pneumatic breaker rock chiseling & leveling.',
            },
            {
              id: 'black_cotton',
              name: 'Black Cotton Soil',
              surcharge: '+14% Foundation Surcharge',
              desc: 'Expansive clay requiring bored under-reamed pile foundation.',
            },
            {
              id: 'clayey',
              name: 'Soft Clay / Alluvial',
              surcharge: '+8.5% Foundation',
              desc: 'Requires reinforced continuous raft to prevent settlement.',
            },
          ].map((s) => {
            const isSelected = input.soilType === s.id;
            return (
              <button
                key={s.id}
                type="button"
                id={`soil-btn-${s.id}`}
                onClick={() => handleSoilChange(s.id as SoilType)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/60'
                    : 'border-[#272730] bg-[#1b1b22] hover:bg-[#22222a] text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">{s.name}</span>
                </div>
                <div className="text-[11px] text-amber-400 font-mono mt-0.5">{s.surcharge}</div>
                <div className="text-[11px] text-neutral-400 font-normal mt-1 leading-tight">
                  {s.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button: Warm precision amber accent */}
      <div className="pt-2">
        <button
          id="calculate-btn"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          <Calculator className="w-4 h-4" />
          <span>{hasCalculated ? 'Recalculate Estimate' : 'Calculate Construction Cost'}</span>
        </button>
        {hasCalculated && (
          <p className="text-[11px] text-center text-neutral-400 font-normal mt-2">
            Result panel updates live automatically as you adjust inputs.
          </p>
        )}
      </div>
    </form>
  );
};
