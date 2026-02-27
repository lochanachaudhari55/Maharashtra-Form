import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Alert, ErrorBanner } from '../UI';
import { validateStep6 } from '../../utils/validate';

const ICON_DOC = 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z';
const ICON_PAY = 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z';

const DOC_LIST = [
  { label:'Date of Birth Proof (Birth Certificate / SSC Certificate)', required:true  },
  { label:'Attested Copy of Caste Certificate',                        required:true  },
  { label:'Attested Copy of Domicile Certificate',                     required:true  },
  { label:'Medical Fitness Certificate',                               required:true  },
  { label:'Driving License (if applicable)',                           required:false },
  { label:'N.C.C. Certificate (if applicable)',                        required:false },
  { label:'Civil Defense Basic Course Certificate (if applicable)',    required:false },
  { label:'Sport Certificate (if applicable)',                         required:false },
  { label:'One Latest Passport Size Photograph',                       required:true  },
  { label:'Educational Qualification Documents (Xth Marksheet, HSC / ITI / Diploma / Graduation)', required:true },
];

export default function Step6Documents({ formData, updateFormData, goTo }) {
  const [errors, setErrors] = useState({});

  const handleFile = (idx, file) => {
    updateFormData({ documents: {...formData.documents, [idx]:file} });
    setErrors(p=>({...p,[`doc_${idx}`]:''}));
  };

  const handleNext = () => {
    const errs = validateStep6(formData);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({top:0,behavior:'smooth'}); return; }
    goTo(7);
  };

  return (
    <>
      <ErrorBanner errors={errors}/>
      <Card>
        <CardHeader icon={ICON_DOC}>Required Documents Upload</CardHeader>
        <CardBody>
          <Alert>Upload required documents (PDF or Image, max 2 MB each). Fields marked <strong style={{color:'#e53935'}}>*</strong> are mandatory.</Alert>
          {DOC_LIST.map((doc,idx)=>{
            const hasErr = errors[`doc_${idx}`];
            const uploaded = formData.documents?.[idx];
            return (
              <div key={idx} style={{
                display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
                background: hasErr?'#fff5f5':uploaded?'#f1fff3':'#fff',
                border:`1px solid ${hasErr?'#e53935':uploaded?'#a5d6a7':'#e0e7f0'}`,
                borderRadius:8, marginBottom:8, transition:'all .2s'
              }}>
                <span style={{minWidth:26,height:26,borderRadius:'50%',background:uploaded?'#2e7d32':'#003d7a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{uploaded?'✓':idx+1}</span>
                <div style={{flex:1}}>
                  <span style={{fontSize:13,fontWeight:600,color:'#222'}}>{doc.label}</span>
                  {doc.required
                    ? <span style={{color:'#e53935',marginLeft:4,fontSize:12,fontWeight:700}}>*</span>
                    : <span style={{color:'#888',marginLeft:6,fontSize:11}}>(if applicable)</span>}
                  {hasErr && <div style={{fontSize:11,color:'#e53935',marginTop:2}}>⚠ {hasErr}</div>}
                </div>
                <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0}}>
                  <button className="btn-upload" onClick={()=>document.getElementById(`docFile${idx}`).click()}>
                    {uploaded?'Change':'Choose File'}
                  </button>
                  <input id={`docFile${idx}`} type="file" accept=".pdf,image/*" style={{display:'none'}}
                    onChange={e=>handleFile(idx,e.target.files[0])}/>
                  {uploaded && <span style={{fontSize:11,color:'#2e7d32',fontWeight:600,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>✓ {uploaded.name}</span>}
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={()=>goTo(5)}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next: Declaration →</button>
      </div>
    </>
  );
}
