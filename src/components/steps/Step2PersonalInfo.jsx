import React, { useState } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Input, Select, RadioGroup, SubHeading, Divider, ErrorBanner } from '../UI';
import { validateStep2 } from '../../utils/validate';

const ICON = 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z';
const YN = [{ value:'yes', label:'Yes' }, { value:'no', label:'No' }];
const LOCATIONS = ['','Mumbai','Navi Mumbai','Pune','Nashik','Aurangabad','Nagpur','Thane','Kolhapur','Solapur','Amravati','Latur','Akola','Jalgaon','Sangli','Satara','Ratnagiri','Wardha','Chandrapur','Gondia','Yavatmal','Dhule','Nanded'];

export default function Step2PersonalInfo({ formData, updateFormData, goTo }) {
  const [errors, setErrors] = useState({});
  const clr = f => setErrors(p=>({...p,[f]:''}));
  const upd = f => e => { updateFormData({[f]:e.target.value}); clr(f); };

  const handleNext = () => {
    const errs = validateStep2(formData);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({top:0,behavior:'smooth'}); return; }
    goTo(3);
  };

  return (
    <>
      <ErrorBanner errors={errors}/>
      <Card>
        <CardHeader icon={ICON}>Personal Information</CardHeader>
        <CardBody>
          <SubHeading>Family Details</SubHeading>
          <div className="form-row cols-2">
            <FormGroup label="Father Name" required error={errors.fatherName}><Input value={formData.fatherName} onChange={upd('fatherName')} placeholder="Father's full name" error={errors.fatherName}/></FormGroup>
            <FormGroup label="Mother Name" required error={errors.motherName}><Input value={formData.motherName} onChange={upd('motherName')} placeholder="Mother's full name" error={errors.motherName}/></FormGroup>
          </div>

          <Divider/>
          <SubHeading>Physical Details</SubHeading>
          <div className="form-row cols-4">
            <FormGroup label="Height (cm)" required error={errors.height}><Input type="number" value={formData.height} onChange={upd('height')} placeholder="e.g. 168" error={errors.height}/></FormGroup>
            <FormGroup label="Weight (kg)" required error={errors.weight}><Input type="number" value={formData.weight} onChange={upd('weight')} placeholder="e.g. 74" error={errors.weight}/></FormGroup>
            <FormGroup label="Chest Deflated (cm)"><Input type="number" value={formData.chestDeflated} onChange={upd('chestDeflated')} placeholder="e.g. 90"/></FormGroup>
            <FormGroup label="Chest Inflated (cm)"><Input type="number" value={formData.chestInflated} onChange={upd('chestInflated')} placeholder="e.g. 96"/></FormGroup>
          </div>

          <Divider/>
          <SubHeading>Language & Other</SubHeading>
          <div className="form-row cols-2">
            <FormGroup label="Are you hearing impaired / blind?" required error={errors.hearingImpaired}>
              <RadioGroup fieldName="hearingImpaired" value={formData.hearingImpaired} onChange={v=>{updateFormData({hearingImpaired:v});clr('hearingImpaired');}} options={YN} error={errors.hearingImpaired}/>
            </FormGroup>
            <FormGroup label="Know Marathi Language?" required error={errors.knowsMarathi}>
              <RadioGroup fieldName="knowsMarathi" value={formData.knowsMarathi} onChange={v=>{updateFormData({knowsMarathi:v});clr('knowsMarathi');}} options={YN} error={errors.knowsMarathi}/>
            </FormGroup>
          </div>

          <Divider/>
          <SubHeading>Preferred Posting Locations</SubHeading>
          <div className="form-row cols-3">
            <FormGroup label="Preferred Location 1"><Select value={formData.preferredLocation1} onChange={upd('preferredLocation1')} options={LOCATIONS}/></FormGroup>
            <FormGroup label="Preferred Location 2"><Select value={formData.preferredLocation2} onChange={upd('preferredLocation2')} options={LOCATIONS}/></FormGroup>
            <FormGroup label="Preferred Location 3"><Select value={formData.preferredLocation3} onChange={upd('preferredLocation3')} options={LOCATIONS}/></FormGroup>
          </div>
        </CardBody>
      </Card>
      <div className="btn-row">
        <button className="btn btn-secondary" onClick={()=>goTo(1)}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next: Address →</button>
      </div>
    </>
  );
}
