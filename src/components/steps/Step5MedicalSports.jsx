import React, { useState } from 'react';
import { Card, CardHeader, CardBody, FormGroup, RadioGroup, SubHeading, Divider, ErrorBanner } from '../UI';
import { validateStep5 } from '../../utils/validate';

const ICON = 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z';
const YN = [{ value:'yes', label:'Yes' }, { value:'no', label:'No' }];
const SPORT_NAMES  = ['','Athletics','Basketball','Boxing','Chess','Cricket','Cycling','Football','Gymnastics','Hockey','Judo','Kabaddi','Kho-Kho','Swimming','Table Tennis','Tennis','Volleyball','Weight Lifting','Wrestling','Other'];
const SPORT_LEVELS = ['','National','State','District','University','International'];
const MEDALS       = ['','Gold','Silver','Bronze','1st Place','2nd Place','3rd Place','Participation'];

const MED_FIELDS = [
  { f:'vision66',          label:'Eye Sight Distant Vision 6/6 Without Spectacles?',    sec:'Vision & Hearing' },
  { f:'colorVision',       label:'Passed Colour Vision Test?',                           sec:'Vision & Hearing' },
  { f:'normalHearing',     label:'Normal Hearing (no past ear/nose/throat problem)?',    sec:'Vision & Hearing' },
  { f:'squintEyes',        label:'Squint Eyes?',                                         sec:'Vision & Hearing' },
  { f:'chestExpansion5cm', label:'Minimum Chest Expansion of 5 cm?',                     sec:'Physical Health' },
  { f:'flatFoot',          label:'Flat Foot?',                                           sec:'Physical Health' },
  { f:'kneeKnock',         label:'Knee Knock?',                                          sec:'Physical Health' },
  { f:'varicoseVein',      label:'Varicose Vein?',                                       sec:'Physical Health' },
  { f:'boneDisease',       label:'Disease of Bone and Joints?',                          sec:'Physical Health' },
  { f:'noMedicalDeformity',label:'No Medical Deformity?',                                sec:'Physical Health' },
  { f:'mentalHistory',     label:'Past History of Mental Breakdown or Fits?',            sec:'Medical History' },
  { f:'majorSurgery',      label:'Any Major Surgery?',                                   sec:'Medical History' },
  { f:'speechDeficiency',  label:'Speech Deficiency (e.g. Stammering)?',                 sec:'Medical History' },
  { f:'skinDisease',       label:'Skin Disease likely to cause Disability?',             sec:'Medical History' },
];

const CERT_FIELDS = [
  { f:'drivingLicenseLMV', label:'Driving Licence LMV (Light Motor Vehicle)?' },
  { f:'drivingLicenseHMV', label:'Driving Licence HMV (Heavy Motor Vehicle)?' },
  { f:'nccA',              label:'NCC-A Certificate?' },
  { f:'nccB',              label:'NCC-B Certificate?' },
  { f:'nccC',              label:'NCC-C Certificate?' },
  { f:'civilDefense',      label:'Any Civil Defence Basic Course?' },
  { f:'homeGuard',         label:'Home Guard Training?' },
];

export default function Step5MedicalSports({ formData, updateFormData, goTo }) {
  const [errors, setErrors] = useState({});
  const rb = (f,v) => { updateFormData({[f]:v}); setErrors(p=>({...p,[f]:''})); };

  const handleNext = () => {
    const errs = validateStep5(formData);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({top:0,behavior:'smooth'}); return; }
    goTo(6);
  };

  // group medical fields by section
  const sections = [...new Set(MED_FIELDS.map(x=>x.sec))];

  const addSport = () => updateFormData({sportsDetails:[...formData.sportsDetails,{name:'',level:'',startDate:'',endDate:'',medal:''}]});
  const updSport = (idx,field,val) => updateFormData({sportsDetails:formData.sportsDetails.map((s,i)=>i===idx?{...s,[field]:val}:s)});
  const delSport = idx => updateFormData({sportsDetails:formData.sportsDetails.filter((_,i)=>i!==idx)});

  return (
    <>
      <ErrorBanner errors={errors}/>
      <Card>
        <CardHeader icon={ICON}>Medical Fitness Details</CardHeader>
        <CardBody>
          {sections.map(sec=>(
            <div key={sec}>
              <SubHeading>{sec}</SubHeading>
              <div className="form-row cols-2">
                {MED_FIELDS.filter(x=>x.sec===sec).map(({f,label})=>(
                  <FormGroup key={f} label={label} required error={errors[f]}>
                    <RadioGroup fieldName={f} value={formData[f]} onChange={v=>rb(f,v)} options={YN} error={errors[f]}/>
                  </FormGroup>
                ))}
              </div>
              <Divider/>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={ICON}>Licences & Certificates</CardHeader>
        <CardBody>
          <div className="form-row cols-2">
            {CERT_FIELDS.map(({f,label})=>(
              <FormGroup key={f} label={label} required error={errors[f]}>
                <RadioGroup fieldName={f} value={formData[f]} onChange={v=>rb(f,v)} options={YN} error={errors[f]}/>
              </FormGroup>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={ICON}>Sports Details</CardHeader>
        <CardBody>
          <FormGroup label="Are you a meritorious sports person?" required error={errors.meritoriousSports}>
            <RadioGroup fieldName="meritoriousSports" value={formData.meritoriousSports} onChange={v=>rb('meritoriousSports',v)} options={YN} error={errors.meritoriousSports}/>
          </FormGroup>
          {formData.meritoriousSports==='yes' && (
            <div style={{marginTop:16}}>
              <div style={{overflowX:'auto'}}>
                <table className="data-table">
                  <thead><tr><th>Sport Name</th><th>Level</th><th>Start Date</th><th>End Date</th><th>Medal / Position</th><th style={{width:40}}></th></tr></thead>
                  <tbody>
                    {formData.sportsDetails.map((s,idx)=>(
                      <tr key={idx}>
                        <td><select value={s.name} onChange={e=>updSport(idx,'name',e.target.value)}>{SPORT_NAMES.map(n=><option key={n} value={n}>{n||'-- Sport --'}</option>)}</select></td>
                        <td><select value={s.level} onChange={e=>updSport(idx,'level',e.target.value)}>{SPORT_LEVELS.map(l=><option key={l} value={l}>{l||'-- Level --'}</option>)}</select></td>
                        <td><input type="date" value={s.startDate} onChange={e=>updSport(idx,'startDate',e.target.value)}/></td>
                        <td><input type="date" value={s.endDate}   onChange={e=>updSport(idx,'endDate',e.target.value)}/></td>
                        <td><select value={s.medal} onChange={e=>updSport(idx,'medal',e.target.value)}>{MEDALS.map(m=><option key={m} value={m}>{m||'-- Medal --'}</option>)}</select></td>
                        <td><button className="btn-del" onClick={()=>delSport(idx)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-secondary" style={{marginTop:10,fontSize:12}} onClick={addSport}>+ Add Sport</button>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={()=>goTo(4)}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next: Documents →</button>
      </div>
    </>
  );
}
