import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Input, Select, RadioGroup, SubHeading, Divider, ErrorBanner } from '../UI';
import OTPVerification from '../OTPVerification';
import { validateStep1 } from '../../utils/validate';

const ICON = 'M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z';
const YN   = [{ value:'yes', label:'Yes' }, { value:'no', label:'No' }];
const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT  = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function DatePicker({ value, onChange, error }) {
  const today = new Date();
  const parseVal = v => {
    if (!v) return null;
    const [d,m,y] = (v||'').split('/');
    if (!d||!m||!y||isNaN(+y)) return null;
    return new Date(+y, +m-1, +d);
  };
  const sel = parseVal(value);
  const [open,  setOpen]  = useState(false);
  const [vy,    setVy]    = useState(sel ? sel.getFullYear() : today.getFullYear() - 20);
  const [vm,    setVm]    = useState(sel ? sel.getMonth()    : today.getMonth());
  const wrap = useRef(null);

  useEffect(() => {
    const h = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const prevM = () => { if (vm===0){setVm(11);setVy(y=>y-1);}else setVm(m=>m-1); };
  const nextM = () => { if (vm===11){setVm(0);setVy(y=>y+1);}else setVm(m=>m+1); };
  const daysInM = (y,m) => new Date(y,m+1,0).getDate();
  const firstDay = (y,m) => new Date(y,m,1).getDay();

  const pick = day => {
    onChange(`${String(day).padStart(2,'0')}/${String(vm+1).padStart(2,'0')}/${vy}`);
    setOpen(false);
  };

  const total = daysInM(vy,vm);
  const offset = firstDay(vy,vm);
  const cells = Array(offset).fill(null).concat(Array.from({length:total},(_,i)=>i+1));
  const yearList = Array.from({length:80},(_,i)=>today.getFullYear()-i+5-25);

  return (
    <div ref={wrap} style={{position:'relative'}}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          border:`1px solid ${error?'#e53935':open?'#003d7a':'#cdd6e0'}`,
          borderRadius:5,padding:'9px 12px',cursor:'pointer',background:'#fff',fontSize:13,
          color:value?'#222':'#aaa',
          boxShadow:open?'0 0 0 3px rgba(0,61,122,.1)':error?'0 0 0 3px rgba(229,57,53,.1)':'none',userSelect:'none'
        }}>
        <span>📅 {value || 'DD / MM / YYYY'}</span>
        <span style={{fontSize:10,color:'#888'}}>{open?'▲':'▼'}</span>
      </div>

      {open && (
        <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:1000,background:'#fff',borderRadius:12,width:300,boxShadow:'0 8px 32px rgba(0,0,0,.18)',overflow:'hidden',border:'1px solid #e0e7f0'}}>
          {/* Header */}
          <div style={{background:'#003d7a',padding:'12px 14px',color:'#fff'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <button onClick={prevM} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',borderRadius:6,width:30,height:30,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
              <span style={{fontWeight:700,fontSize:14,minWidth:90,textAlign:'center'}}>{MONTHS_LONG[vm]}</span>
              <button onClick={nextM} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',borderRadius:6,width:30,height:30,cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              <button onClick={()=>setVy(y=>y-1)} style={{background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.3)',color:'#fff',borderRadius:4,padding:'3px 8px',cursor:'pointer',fontSize:12}}>−</button>
              <select value={vy} onChange={e=>setVy(+e.target.value)}
                style={{background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.3)',color:'#fff',borderRadius:6,padding:'4px 8px',fontSize:13,fontWeight:700,cursor:'pointer'}}>
                {yearList.map(y=><option key={y} value={y} style={{color:'#222',background:'#fff'}}>{y}</option>)}
              </select>
              <button onClick={()=>setVy(y=>y+1)} style={{background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.3)',color:'#fff',borderRadius:4,padding:'3px 8px',cursor:'pointer',fontSize:12}}>+</button>
            </div>
          </div>
          {/* Day headers */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',background:'#f0f4f8',padding:'6px 8px'}}>
            {DAYS_SHORT.map(d=><div key={d} style={{textAlign:'center',fontSize:11,fontWeight:700,color:'#003d7a',padding:'3px 0'}}>{d}</div>)}
          </div>
          {/* Cells */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',padding:'4px 8px 10px',gap:2}}>
            {cells.map((day,i)=>{
              if(!day) return <div key={'e'+i}/>;
              const isSel = sel && sel.getDate()===day && sel.getMonth()===vm && sel.getFullYear()===vy;
              const isNow = today.getDate()===day && today.getMonth()===vm && today.getFullYear()===vy;
              return (
                <div key={day} onClick={()=>pick(day)}
                  style={{
                    textAlign:'center',padding:'7px 2px',fontSize:12,borderRadius:8,cursor:'pointer',
                    fontWeight:isSel?700:isNow?600:400,
                    background:isSel?'#003d7a':isNow?'#e8f0fb':'transparent',
                    color:isSel?'#fff':isNow?'#003d7a':'#222',
                    border:isNow&&!isSel?'1px solid #003d7a':'1px solid transparent',
                    transition:'background .1s',
                  }}
                  onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='#e8f0fb';}}
                  onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=isNow?'#e8f0fb':'transparent';}}
                >{day}</div>
              );
            })}
          </div>
          {/* Footer */}
          <div style={{borderTop:'1px solid #eee',padding:'8px 12px',display:'flex',justifyContent:'space-between'}}>
            <button onClick={()=>{onChange('');setOpen(false);}} style={{background:'none',border:'1px solid #cdd6e0',borderRadius:5,padding:'4px 12px',fontSize:11,cursor:'pointer',color:'#666'}}>Clear</button>
            <button onClick={()=>{setVy(today.getFullYear());setVm(today.getMonth());}} style={{background:'#003d7a',border:'none',borderRadius:5,padding:'4px 12px',fontSize:11,cursor:'pointer',color:'#fff'}}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Step1PrimaryDetails({ formData, updateFormData, goTo }) {
  const [photoPreview,   setPhotoPreview]   = useState(null);
  const [signPreview,    setSignPreview]    = useState(null);
  const [showOTP,        setShowOTP]        = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [errors,         setErrors]         = useState({});
  const photoRef = useRef(null);
  const signRef  = useRef(null);

  const clr = f => setErrors(p=>({...p,[f]:''}));

  const upd = f => e => {
    const val = e.target.value;
    if (['firstName','middleName','lastName'].includes(f)) {
      const fn = f==='firstName'  ? val : formData.firstName;
      const mn = f==='middleName' ? val : formData.middleName;
      const ln = f==='lastName'   ? val : formData.lastName;
      updateFormData({ [f]:val, fullName:[fn,mn,ln].filter(Boolean).join(' ').toUpperCase() });
    } else { updateFormData({ [f]:val }); }
    clr(f);
  };

  const handleNext = () => {
    const errs = validateStep1(formData);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({top:0,behavior:'smooth'}); return; }
    goTo(2);
  };

  const handlePhoto = e => { const f=e.target.files[0]; if(f){setPhotoPreview(URL.createObjectURL(f));updateFormData({photo:f});} };
  const handleSign  = e => { const f=e.target.files[0]; if(f){setSignPreview(URL.createObjectURL(f)); updateFormData({signature:f});} };

  const previewBox = (has,h=120) => ({ width:110,height:h,border:`2px dashed ${has?'#003d7a':'#cdd6e0'}`,borderRadius:8,overflow:'hidden',cursor:'pointer',background:'#f9fafc',display:'flex',alignItems:'center',justifyContent:'center' });
  const uplBtn = { width:'100%',background:'#00b4d8',color:'#fff',border:'none',borderRadius:6,padding:'7px 0',fontSize:11,fontWeight:700,cursor:'pointer',marginTop:6 };

  return (
    <>
      {showOTP && <OTPVerification mobile={formData.primaryMobile} onVerified={()=>{setMobileVerified(true);setTimeout(()=>setShowOTP(false),1300);}} onClose={()=>setShowOTP(false)} />}

      <ErrorBanner errors={errors} />

      <Card>
        <CardHeader icon={ICON}>Registration – Primary Details</CardHeader>
        <CardBody>
          <div style={{display:'grid',gridTemplateColumns:'1fr 150px',gap:24,alignItems:'start'}}>
            <div>
              <SubHeading>Name</SubHeading>
              <div className="form-row cols-3">
                <FormGroup label="First Name" required error={errors.firstName}><Input value={formData.firstName} onChange={upd('firstName')} placeholder="First name" error={errors.firstName} /></FormGroup>
                <FormGroup label="Middle / Father Name"><Input value={formData.middleName} onChange={upd('middleName')} placeholder="Middle name" /></FormGroup>
                <FormGroup label="Last / Surname" required error={errors.lastName}><Input value={formData.lastName} onChange={upd('lastName')} placeholder="Last name" error={errors.lastName} /></FormGroup>
              </div>
              <div className="form-row cols-1" style={{marginBottom:14}}>
                <FormGroup label="Full Name (Auto-filled)"><Input value={formData.fullName} placeholder="Auto-filled from above" readOnly /></FormGroup>
              </div>

              <Divider />
              <SubHeading>Personal Info</SubHeading>
              <div className="form-row cols-2">
                <FormGroup label="Date of Birth" required error={errors.dob} hint="Click 📅 to open calendar">
                  <DatePicker value={formData.dob} onChange={v=>{updateFormData({dob:v});clr('dob');}} error={errors.dob} />
                </FormGroup>
                <FormGroup label="Gender" required error={errors.gender}>
                  <Select value={formData.gender} onChange={e=>{upd('gender')(e);}} options={['Male','Female','Other']} error={errors.gender} />
                </FormGroup>
              </div>

              <div className="form-row cols-2">
                <FormGroup label="Aadhar Number" required error={errors.aadharNumber}><Input value={formData.aadharNumber} onChange={upd('aadharNumber')} placeholder="12-digit Aadhar" maxLength={12} error={errors.aadharNumber} /></FormGroup>
                <FormGroup label="Upload Aadhar Card">
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <button className="btn-upload" onClick={()=>document.getElementById('aadharInp').click()}>Upload</button>
                    <input id="aadharInp" type="file" accept="image/*,.pdf" style={{display:'none'}} onChange={e=>updateFormData({aadharFile:e.target.files[0]})} />
                    <span style={{fontSize:11,color:formData.aadharFile?'#2e7d32':'#888'}}>{formData.aadharFile?`✓ ${formData.aadharFile.name}`:'PDF / Image'}</span>
                  </div>
                </FormGroup>
              </div>

              <div className="form-row cols-2">
                <FormGroup label="E-Mail ID" required error={errors.email}><Input value={formData.email} onChange={upd('email')} type="email" placeholder="Enter email" error={errors.email} /></FormGroup>
                <FormGroup label="Category" required error={errors.category}><Select value={formData.category} onChange={upd('category')} options={['General','SC','ST','OBC','NT','VJ','SBC']} error={errors.category} /></FormGroup>
              </div>

              <div className="form-row cols-1">
                <FormGroup label="Primary Mobile Number" required error={errors.primaryMobile}>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <span style={{background:'#f0f4f8',border:'1px solid #cdd6e0',borderRadius:5,padding:'9px 10px',fontSize:13,fontWeight:600,color:'#333'}}>+91</span>
                    <input type="tel" value={formData.primaryMobile} maxLength={10} placeholder="10-digit mobile number"
                      onChange={e=>{updateFormData({primaryMobile:e.target.value.replace(/\D/g,'').slice(0,10)});setMobileVerified(false);clr('primaryMobile');}}
                      style={{flex:1,border:`1px solid ${errors.primaryMobile?'#e53935':mobileVerified?'#2e7d32':'#cdd6e0'}`,borderRadius:5,padding:'9px 12px',fontSize:13,fontFamily:'inherit',outline:'none',background:mobileVerified?'#f1fff3':'#fff'}}/>
                    {mobileVerified
                      ?<span style={{background:'#e8f5e9',color:'#2e7d32',border:'1px solid #a5d6a7',borderRadius:5,padding:'9px 12px',fontSize:12,fontWeight:700,whiteSpace:'nowrap'}}>✓ Verified</span>
                      :<button className="btn-verify" onClick={()=>{if(!formData.primaryMobile||formData.primaryMobile.length!==10){setErrors(p=>({...p,primaryMobile:'Enter valid 10-digit number'}));return;}setShowOTP(true);}}>Verify</button>}
                  </div>
                </FormGroup>
              </div>

              <div className="form-row cols-2">
                <FormGroup label="Nationality" required error={errors.nationality}><Select value={formData.nationality} onChange={upd('nationality')} options={['Indian','Other']} error={errors.nationality} /></FormGroup>
                <FormGroup label="Name Change Status">
                  <RadioGroup fieldName="nameChangeStatus" value={formData.nameChangeStatus} onChange={v=>updateFormData({nameChangeStatus:v})} options={YN} />
                </FormGroup>
              </div>

              {formData.nameChangeStatus==='yes' && (
                <div className="form-row cols-3">
                  <FormGroup label="Changed First Name"><Input value={formData.changedFirstName} onChange={upd('changedFirstName')} placeholder="Changed first name" /></FormGroup>
                  <FormGroup label="Changed Middle Name"><Input value={formData.changedMiddleName} onChange={upd('changedMiddleName')} placeholder="Changed middle name" /></FormGroup>
                  <FormGroup label="Changed Last Name"><Input value={formData.changedLastName} onChange={upd('changedLastName')} placeholder="Changed last name" /></FormGroup>
                </div>
              )}
            </div>

            {/* Photo & Sign */}
            <div style={{display:'flex',flexDirection:'column',gap:20,alignItems:'center',paddingTop:8}}>
              <div style={{width:'100%',textAlign:'center'}}>
                <p style={{fontSize:10,color:'#888',marginBottom:4,fontWeight:600,textTransform:'uppercase'}}>Photo</p>
                <input ref={photoRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
                <div style={previewBox(!!photoPreview)} onClick={()=>photoRef.current.click()}>
                  {photoPreview?<img src={photoPreview} alt="Photo" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    :<div style={{textAlign:'center'}}><div style={{fontSize:30,color:'#ccc'}}>📷</div><div style={{fontSize:9,color:'#aaa',marginTop:4}}>Passport Size</div></div>}
                </div>
                <button type="button" style={uplBtn} onClick={()=>photoRef.current.click()}>Upload Photo</button>
                {photoPreview&&<div style={{fontSize:10,color:'#2e7d32',fontWeight:600,marginTop:4}}>✓ Added</div>}
              </div>
              <div style={{width:'100%',textAlign:'center'}}>
                <p style={{fontSize:10,color:'#888',marginBottom:4,fontWeight:600,textTransform:'uppercase'}}>Signature</p>
                <input ref={signRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleSign}/>
                <div style={previewBox(!!signPreview,70)} onClick={()=>signRef.current.click()}>
                  {signPreview?<img src={signPreview} alt="Sign" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                    :<div style={{textAlign:'center'}}><div style={{fontSize:22,color:'#ccc'}}>✒️</div><div style={{fontSize:9,color:'#aaa',marginTop:2}}>Sign here</div></div>}
                </div>
                <button type="button" style={uplBtn} onClick={()=>signRef.current.click()}>Upload Sign</button>
                {signPreview&&<div style={{fontSize:10,color:'#2e7d32',fontWeight:600,marginTop:4}}>✓ Added</div>}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="btn-row"><span/><button className="btn btn-primary" onClick={handleNext}>Next: Personal Info →</button></div>
    </>
  );
}
