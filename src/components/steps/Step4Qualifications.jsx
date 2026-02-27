import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Alert, RadioGroup, FormGroup, SubHeading, Divider, ErrorBanner } from '../UI';
import { validateStep4 } from '../../utils/validate';

const ICON = 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z';
const YN = [{ value:'yes', label:'Yes' }, { value:'no', label:'No' }];
const QUAL_TYPES = ['SSC','HSC','ITI','Diploma','Graduate','Post Graduate','Other'];
const MH_BOARDS  = ['','Maharashtra State Board (MSBSHSE)','Maharashtra HSC Board','CBSE','ICSE','Mumbai University','Pune University','Nagpur University','Aurangabad University','Amravati University','Kolhapur University','Nashik University','Shivaji University','Solapur University','Nanded University','DR BABASAHEB AMBEDKAR MARATHWADA UNIVERSITY','YASHWANTRAO CHAVAN MAHARASHTRA OPEN UNIVERSITY','National Institute of Open Schooling (NIOS)','Other Board/University'];

export default function Step4Qualifications({ formData, updateFormData, goTo }) {
  const [errors, setErrors] = useState({});
  const quals = formData.qualifications;

  const updateQual = (idx, field, value) => {
    const updated = quals.map((q,i) => {
      if (i!==idx) return q;
      const nq = {...q,[field]:value};
      if (field==='obtained'||field==='max') {
        const ob = parseFloat(field==='obtained'?value:q.obtained)||0;
        const mx = parseFloat(field==='max'?value:q.max)||0;
        nq.percentage = mx>0 ? ((ob/mx)*100).toFixed(2) : '';
      }
      return nq;
    });
    updateFormData({qualifications:updated});
    setErrors(p=>({...p,qualifications:''}));
  };

  const addRow = () => updateFormData({qualifications:[...quals,{type:'SSC',obtained:'',max:'',percentage:'',board:''}]});
  const delRow = idx => { if(quals.length>1) updateFormData({qualifications:quals.filter((_,i)=>i!==idx)}); };

  const handleNext = () => {
    const errs = validateStep4(formData);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({top:0,behavior:'smooth'}); return; }
    goTo(5);
  };

  return (
    <>
      <ErrorBanner errors={errors}/>
      <Card>
        <CardHeader icon={ICON}>Educational Qualifications</CardHeader>
        <CardBody>
          <Alert>Enter all qualifications starting from SSC. Percentage is auto-calculated from marks.</Alert>
          {errors.qualifications && <div style={{color:'#e53935',fontSize:12,marginBottom:10}}>⚠ {errors.qualifications}</div>}
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead>
                <tr><th>Qualification</th><th>Obtained Marks</th><th>Max Marks</th><th>Percentage (%)</th><th>Board / University</th><th style={{width:40}}></th></tr>
              </thead>
              <tbody>
                {quals.map((q,idx)=>(
                  <tr key={idx}>
                    <td><select value={q.type} onChange={e=>updateQual(idx,'type',e.target.value)}>{QUAL_TYPES.map(t=><option key={t}>{t}</option>)}</select></td>
                    <td><input type="number" value={q.obtained} placeholder="e.g. 450" onChange={e=>updateQual(idx,'obtained',e.target.value)}/></td>
                    <td><input type="number" value={q.max} placeholder="e.g. 600" onChange={e=>updateQual(idx,'max',e.target.value)}/></td>
                    <td><input type="text" value={q.percentage} readOnly placeholder="Auto" style={{background:'#f0f4f8',color:'#555'}}/></td>
                    <td><select value={q.board} onChange={e=>updateQual(idx,'board',e.target.value)}>{MH_BOARDS.map(b=><option key={b} value={b}>{b===''?'-- Select Board --':b}</option>)}</select></td>
                    <td><button className="btn-del" onClick={()=>delRow(idx)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-secondary" style={{marginTop:14,fontSize:12}} onClick={addRow}>+ Add Qualification</button>

          <Divider/>
          <SubHeading>SSC Passing Criteria</SubHeading>
          <div className="form-row cols-2">
            <FormGroup label="Passed SSC with more than 45%?" required error={errors.ssc45}>
              <RadioGroup fieldName="ssc45" value={formData.ssc45} onChange={v=>{updateFormData({ssc45:v});setErrors(p=>({...p,ssc45:''}));}} options={YN} error={errors.ssc45}/>
            </FormGroup>
            <FormGroup label="Passed SSC with more than 50%?" required error={errors.ssc50}>
              <RadioGroup fieldName="ssc50" value={formData.ssc50} onChange={v=>{updateFormData({ssc50:v});setErrors(p=>({...p,ssc50:''}));}} options={YN} error={errors.ssc50}/>
            </FormGroup>
          </div>
        </CardBody>
      </Card>
      <div className="btn-row">
        <button className="btn btn-secondary" onClick={()=>goTo(3)}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next: Medical & Sports →</button>
      </div>
    </>
  );
}
