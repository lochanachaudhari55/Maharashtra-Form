import React, { useState } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Input, Select, Textarea, RadioGroup, SubHeading, Divider, ErrorBanner } from '../UI';
import { validateStep3 } from '../../utils/validate';

const ICON = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';
const YN = [{ value:'yes', label:'Yes' }, { value:'no', label:'No' }];
const MH_DISTRICTS = ['','Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana','Chandrapur','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar','Nashik','Osmanabad','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'];
const STATES = ['','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'];

export default function Step3AddressIds({ formData, updateFormData, goTo }) {
  const [errors, setErrors] = useState({});
  const clr = f => setErrors(p=>({...p,[f]:''}));
  const upd = f => e => { updateFormData({[f]:e.target.value}); clr(f); };
  const rb  = (f,v) => { updateFormData({[f]:v}); clr(f); };

  const handleNext = () => {
    const errs = validateStep3(formData);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({top:0,behavior:'smooth'}); return; }
    goTo(4);
  };

  return (
    <>
      <ErrorBanner errors={errors}/>
      <Card>
        <CardHeader icon={ICON}>Address Details</CardHeader>
        <CardBody>
          <SubHeading>Current / Permanent Address</SubHeading>
          <div className="form-row cols-1">
            <FormGroup label="Full Address" required error={errors.address}><Textarea value={formData.address} onChange={upd('address')} rows={3} error={errors.address}/></FormGroup>
          </div>
          <div className="form-row cols-2">
            <FormGroup label="Village / City / Post Office" required error={errors.village}><Input value={formData.village} onChange={upd('village')} placeholder="Village or city" error={errors.village}/></FormGroup>
            <FormGroup label="Taluka" required error={errors.taluka}><Input value={formData.taluka} onChange={upd('taluka')} placeholder="Taluka" error={errors.taluka}/></FormGroup>
          </div>
          <div className="form-row cols-3">
            <FormGroup label="District" required error={errors.district}><Select value={formData.district} onChange={upd('district')} options={MH_DISTRICTS} error={errors.district}/></FormGroup>
            <FormGroup label="State" required error={errors.state}><Select value={formData.state} onChange={upd('state')} options={STATES} error={errors.state}/></FormGroup>
            <FormGroup label="Country" required error={errors.country}><Select value={formData.country} onChange={upd('country')} options={['','India','Other']} error={errors.country}/></FormGroup>
          </div>
          <div className="form-row cols-2">
            <FormGroup label="Pin Code" required hint="6-digit pin code" error={errors.pinCode}><Input value={formData.pinCode} onChange={upd('pinCode')} placeholder="e.g. 400001" maxLength={6} error={errors.pinCode}/></FormGroup>
          </div>

          <Divider/>
          <SubHeading>Identity & Category Details</SubHeading>
          <div className="form-row cols-2">
            <FormGroup label="Domicile of Maharashtra" required error={errors.domicileMaharashtra}>
              <RadioGroup fieldName="domicileMaharashtra" value={formData.domicileMaharashtra} onChange={v=>rb('domicileMaharashtra',v)} options={YN} error={errors.domicileMaharashtra}/>
            </FormGroup>
            <FormGroup label="Aadhaar Card No" required><Input value={formData.aadharNumber} readOnly style={{background:'#f5f7fa'}}/></FormGroup>
          </div>
          <div className="form-row cols-2">
            <FormGroup label="Person With Differential Abilities?" required error={errors.pwdStatus}>
              <RadioGroup fieldName="pwdStatus" value={formData.pwdStatus} onChange={v=>rb('pwdStatus',v)} options={YN} error={errors.pwdStatus}/>
            </FormGroup>
            <FormGroup label="Project Affected or Dependent?" required error={errors.projectAffected}>
              <RadioGroup fieldName="projectAffected" value={formData.projectAffected} onChange={v=>rb('projectAffected',v)} options={YN} error={errors.projectAffected}/>
            </FormGroup>
          </div>
          <div className="form-row cols-2">
            <FormGroup label="Earthquake Affected?" required error={errors.earthquakeAffected}>
              <RadioGroup fieldName="earthquakeAffected" value={formData.earthquakeAffected} onChange={v=>rb('earthquakeAffected',v)} options={YN} error={errors.earthquakeAffected}/>
            </FormGroup>
            <FormGroup label="Son / Daughter of Ex-servicemen?" required error={errors.exServiceman}>
              <RadioGroup fieldName="exServiceman" value={formData.exServiceman} onChange={v=>rb('exServiceman',v)} options={YN} error={errors.exServiceman}/>
            </FormGroup>
          </div>
        </CardBody>
      </Card>
      <div className="btn-row">
        <button className="btn btn-secondary" onClick={()=>goTo(2)}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next: Qualifications →</button>
      </div>
    </>
  );
}
