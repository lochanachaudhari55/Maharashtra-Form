import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Input, Select, Alert, Divider, ErrorBanner } from '../UI';
import { validateStep7Declaration, validateStep7Payment } from '../../utils/validate';

const ICON_DECL = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z';
const ICON_PAY  = 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z';
const YL = v => v==='yes'?'Yes':v==='no'?'No':(v||'—');
const FEE = '100';

const BANKS = ['','State Bank of India','Bank of Maharashtra','Punjab National Bank',
  'Bank of Baroda','Canara Bank','Union Bank of India','HDFC Bank','ICICI Bank',
  'Axis Bank','Kotak Mahindra Bank','IDBI Bank','Yes Bank','IndusInd Bank','Federal Bank'];

const PAYMENT_METHODS = [
  { value:'upi',        label:'UPI / QR Code',      icon:'📱' },
  { value:'card',       label:'Debit / Credit Card', icon:'💳' },
  { value:'netbanking', label:'Net Banking',          icon:'🏦' },
];

export default function Step7Declaration({ formData, updateFormData, goTo, onSubmit }) {
  const [candSignURL,  setCandSignURL]  = useState(null);
  const [guardSignURL, setGuardSignURL] = useState(null);
  const [declErrors,   setDeclErrors]  = useState({});
  const [payErrors,    setPayErrors]   = useState({});
  const [paying,       setPaying]      = useState(false);
  const [paid,         setPaid]        = useState(false);
  const [previewOpen,  setPreviewOpen] = useState(false);

  const candRef  = useRef(null);
  const guardRef = useRef(null);

  const clrD = f => setDeclErrors(p=>({...p,[f]:''}));
  const clrP = f => setPayErrors(p=>({...p,[f]:''}));
  const upd  = f => e => { updateFormData({[f]:e.target.value}); clrD(f); };

  const handleCandSign  = e => { const file=e.target.files[0]; if(!file)return; const url=URL.createObjectURL(file); setCandSignURL(url);  updateFormData({candidateSignature:file,candidateSignatureURL:url}); };
  const handleGuardSign = e => { const file=e.target.files[0]; if(!file)return; const url=URL.createObjectURL(file); setGuardSignURL(url); updateFormData({guardianSignature:file,guardianSignatureURL:url}); };

  /* ─── Validate declaration first, then payment ─── */
  const handleSubmit = () => {
    const dErr = validateStep7Declaration(formData);
    if (Object.keys(dErr).length) { setDeclErrors(dErr); window.scrollTo({top:0,behavior:'smooth'}); return; }
    if (!paid) {
      const pErr = validateStep7Payment(formData);
      if (Object.keys(pErr).length) { setPayErrors(pErr); return; }
      alert('Please complete the payment before submitting.');
      return;
    }
    onSubmit();
  };

  /* ─── Simulate payment ─── */
  const handlePayNow = () => {
    const errs = validateStep7Payment(formData);
    if (Object.keys(errs).length) { setPayErrors(errs); return; }
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); updateFormData({paymentStatus:'success'}); }, 2000);
  };

  /* ─── PREVIEW APPLICATION (opens full form in new window, no auto-print) ─── */
  const handlePreview = () => {
    const f = formData;
    const photoURL = f.photo ? URL.createObjectURL(f.photo) : '';
    const cSURL    = candSignURL  || f.candidateSignatureURL  || '';
    const gSURL    = guardSignURL || f.guardianSignatureURL   || '';

    const row = (l,v) => `<tr><td class="lbl">${l}</td><td class="val">${v||'—'}</td></tr>`;
    const sec = t    => `<tr><td colspan="2" class="sec">${t}</td></tr>`;
    const qualRows = (f.qualifications||[]).map(q =>
      `<tr><td>${q.type||'—'}</td><td>${q.obtained||'—'}</td><td>${q.max||'—'}</td><td>${q.percentage?q.percentage+'%':'—'}</td><td>${q.board||'—'}</td></tr>`
    ).join('');

    const b64 = url => new Promise(res=>{
      if(!url) return res('');
      fetch(url).then(r=>r.blob()).then(b=>{const rd=new FileReader();rd.onload=()=>res(rd.result);rd.readAsDataURL(b);}).catch(()=>res(''));
    });

    Promise.all([b64(photoURL),b64(cSURL),b64(gSURL)]).then(([ph,cs,gs])=>{
      const img=(src,w,h)=>src?`<img src="${src}" style="width:${w}px;height:${h}px;object-fit:contain"/>`:''
      const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Application Preview – ${f.fullName||f.firstName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:12px;padding:20px;background:#f5f7fa;color:#222}
.page{background:#fff;max-width:900px;margin:0 auto;padding:24px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1)}
.print-bar{display:flex;justify-content:flex-end;gap:10px;margin-bottom:16px}
.btn-print{background:#003d7a;color:#fff;border:none;borderRadius:6px;padding:10px 24px;font-size:13px;font-weight:700;cursor:pointer;border-radius:6px}
.btn-close{background:#e0e7f0;color:#333;border:none;padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;border-radius:6px}
.hdr{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #003d7a;padding-bottom:10px;margin-bottom:14px}
.hdr-txt{flex:1;text-align:center;padding:0 12px}.hdr-txt p{font-size:11px;color:#555;margin:2px 0}.hdr-txt h1{font-size:14px;font-weight:800;color:#003d7a}
.layout{display:flex;gap:14px}.left{flex:1}.right{width:120px;flex-shrink:0;text-align:center}
table.main{width:100%;border-collapse:collapse;margin-bottom:10px}
td{padding:5px 8px;vertical-align:top;font-size:11.5px}
.sec{background:#003d7a;color:#fff;font-weight:700;padding:7px 10px}
.lbl{background:#f0f4f8;font-weight:600;color:#444;width:40%;border:1px solid #dde3ec}
.val{border:1px solid #dde3ec}
table.qual{width:100%;border-collapse:collapse;margin-bottom:10px}
.qual th{background:#003d7a;color:#fff;padding:6px 8px;font-size:11px;border:1px solid #003d7a;text-align:left}
.qual td{padding:5px 8px;border:1px solid #dde3ec;font-size:11px}
.photo-box{width:110px;height:120px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;overflow:hidden;margin:0 auto}
.sign-sec{display:flex;justify-content:space-between;margin-top:20px;border-top:1px solid #ddd;padding-top:14px}
.sign-col{text-align:center;flex:1}.sign-col p{font-size:11px;font-weight:700;color:#333;margin-bottom:8px}
.sign-box{width:180px;height:70px;border:1px solid #ccc;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;overflow:hidden}
.sign-meta{font-size:10px;color:#777;margin-top:5px}
@media print{.print-bar{display:none}body{padding:0;background:#fff}.page{box-shadow:none;padding:10px}@page{margin:10mm;size:A4}}
</style>
</head><body>
<div class="page">
<div class="print-bar">
  <button class="btn-close" onclick="window.close()">✕ Close</button>
  <button class="btn-print" onclick="window.print()">🖨 Print</button>
</div>

<div class="hdr">
  <div>${img('/logo2.png',58,62)}</div>
  <div class="hdr-txt"><p>Government of Maharashtra</p><p>Skill, Employment, Entrepreneurship and Innovation Department</p><h1>Maharashtra State Board of Skill, Vocational Education and Training</h1></div>
  <div>${img('/logo3.png',62,66)}</div>
</div>

<div class="layout">
<div class="left">
<table class="main">
${sec('1. Primary Details')}
${row('Full Name',f.fullName||[f.firstName,f.middleName,f.lastName].filter(Boolean).join(' '))}
${row('First Name',f.firstName)}${row('Middle Name',f.middleName)}${row('Last Name',f.lastName)}
${row('Date of Birth',f.dob)}${row('Gender',f.gender)}${row('Aadhar Number',f.aadharNumber)}
${row('Email',f.email)}${row('Category',f.category)}${row('Nationality',f.nationality)}
${row('Primary Mobile',f.primaryMobile?'+91 '+f.primaryMobile:'')}
${row('Name Change',YL(f.nameChangeStatus))}
${f.nameChangeStatus==='yes'?row('Changed Name',[f.changedFirstName,f.changedMiddleName,f.changedLastName].filter(Boolean).join(' ')):''}
</table>
<table class="main">
${sec('2. Personal Information')}
${row('Father Name',f.fatherName)}${row('Mother Name',f.motherName)}
${row('Height (cm)',f.height)}${row('Weight (kg)',f.weight)}
${row('Chest Deflated',f.chestDeflated)}${row('Chest Inflated',f.chestInflated)}
${row('Hearing Impaired',YL(f.hearingImpaired))}${row('Knows Marathi',YL(f.knowsMarathi))}
${row('Preferred Location 1',f.preferredLocation1)}${row('Preferred Location 2',f.preferredLocation2)}${row('Preferred Location 3',f.preferredLocation3)}
</table>
<table class="main">
${sec('3. Address & Identity')}
${row('Address',f.address)}${row('Village/City',f.village)}${row('Taluka',f.taluka)}
${row('District',f.district)}${row('State',f.state)}${row('Country',f.country)}${row('Pin Code',f.pinCode)}
${row('Domicile MH',YL(f.domicileMaharashtra))}${row('PWD',YL(f.pwdStatus))}
${row('Project Affected',YL(f.projectAffected))}${row('Earthquake Affected',YL(f.earthquakeAffected))}${row('Ex-Servicemen Kin',YL(f.exServiceman))}
</table>
</div>
<div class="right"><div class="photo-box">${ph?`<img src="${ph}" style="width:110px;height:120px;object-fit:cover"/>`:' Photo'}</div><p style="font-size:9px;color:#666;margin-top:3px">Candidate Photo</p></div>
</div>

<div style="font-weight:700;font-size:12px;background:#003d7a;color:#fff;padding:7px 10px;margin-bottom:0">4. Educational Qualifications</div>
<table class="qual"><thead><tr><th>Qualification</th><th>Obtained</th><th>Max</th><th>%</th><th>Board / University</th></tr></thead><tbody>${qualRows}</tbody></table>

<table class="main">
${sec('5. Medical & Sports')}
${row('Vision 6/6',YL(f.vision66))}${row('Colour Vision',YL(f.colorVision))}${row('Normal Hearing',YL(f.normalHearing))}${row('Squint Eyes',YL(f.squintEyes))}
${row('Chest Expansion',YL(f.chestExpansion5cm))}${row('Flat Foot',YL(f.flatFoot))}${row('Knee Knock',YL(f.kneeKnock))}${row('Varicose Vein',YL(f.varicoseVein))}
${row('Bone Disease',YL(f.boneDisease))}${row('No Deformity',YL(f.noMedicalDeformity))}${row('Mental History',YL(f.mentalHistory))}${row('Major Surgery',YL(f.majorSurgery))}
${row('Speech Deficiency',YL(f.speechDeficiency))}${row('Skin Disease',YL(f.skinDisease))}
${row('DL LMV',YL(f.drivingLicenseLMV))}${row('DL HMV',YL(f.drivingLicenseHMV))}${row('NCC-A',YL(f.nccA))}${row('NCC-B',YL(f.nccB))}${row('NCC-C',YL(f.nccC))}
${row('Civil Defence',YL(f.civilDefense))}${row('Home Guard',YL(f.homeGuard))}${row('Meritorious Sports',YL(f.meritoriousSports))}
</table>

<table class="main">
${sec('6. Declaration & Payment')}
${row('Declaration Date',f.declarationDate)}${row('Declaration Place',f.declarationPlace)}
${row('Guardian Name',f.guardianName)}${row('Guardian Date',f.guardianDate)}${row('Guardian Place',f.guardianPlace)}
${row('Payment Method',f.paymentMethod)}${row('Payment Status',f.paymentStatus||'Pending')}
</table>

<div class="sign-sec">
<div class="sign-col"><p>Signature of Candidate (उमेदवार स्वारी)</p><div class="sign-box">${cs?img(cs,176,66):'Signature'}</div><p class="sign-meta">Date: ${f.declarationDate||'___'} &nbsp; Place: ${f.declarationPlace||'___'}</p></div>
<div class="sign-col"><p>Signature of Father / Mother / Guardian</p><div class="sign-box">${gs?img(gs,176,66):'Signature'}</div><p class="sign-meta">Date: ${f.guardianDate||'___'} &nbsp; Place: ${f.guardianPlace||'___'}</p></div>
</div>
</div>
</body></html>`;

      const win = window.open('', '_blank', 'width=960,height=800');
      win.document.open();
      win.document.write(html);
      win.document.close();

      // Reload parent when preview window closes
      const t = setInterval(() => {
        try { if(win.closed){ clearInterval(t); window.location.reload(); } } catch(e){ clearInterval(t); }
      }, 500);
    });
  };

  /* ─── Payment method tile ─── */
  const MethodTile = ({ value, label, icon }) => {
    const sel = formData.paymentMethod === value;
    return (
      <div onClick={()=>{updateFormData({paymentMethod:value});clrP('paymentMethod');}}
        style={{
          border:`2px solid ${sel?'#003d7a':'#cdd6e0'}`,
          borderRadius:10,padding:'14px 18px',cursor:'pointer',textAlign:'center',
          background:sel?'#e8f0fb':'#fff',transition:'all .15s',
          boxShadow:sel?'0 4px 12px rgba(0,61,122,.15)':'none',
          flex:1,minWidth:120,
        }}>
        <div style={{fontSize:26,marginBottom:6}}>{icon}</div>
        <div style={{fontSize:12,fontWeight:sel?700:500,color:sel?'#003d7a':'#555'}}>{label}</div>
        {sel && <div style={{width:8,height:8,borderRadius:'50%',background:'#003d7a',margin:'6px auto 0'}}/>}
      </div>
    );
  };

  const uplBtn = { background:'#00b4d8',color:'#fff',border:'none',borderRadius:5,padding:'7px 14px',fontSize:11,fontWeight:700,cursor:'pointer',marginTop:8,width:'100%' };
  const signBox = has => ({ width:180,height:75,border:`2px dashed ${has?'#003d7a':'#cdd6e0'}`,borderRadius:6,overflow:'hidden',cursor:'pointer',background:'#f9fafc',display:'flex',alignItems:'center',justifyContent:'center' });

  return (
    <>
      <ErrorBanner errors={declErrors}/>
       {/* ══ PAYMENT ══ */}
      <Card>
        <CardHeader icon={ICON_PAY}>Application Fee Payment</CardHeader>
        <CardBody>

          {/* Fee summary banner */}
          <div style={{background:'linear-gradient(135deg,#003d7a 0%,#0066cc 100%)',borderRadius:10,padding:'18px 22px',color:'#fff',marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:11,opacity:.8,marginBottom:4}}>Maharashtra State Board – Application Fee</div>
                <div style={{fontSize:22,fontWeight:1000}}>₹ {FEE} /-</div>
                <div style={{fontSize:11,opacity:.7,marginTop:4}}>Non-refundable processing fee</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,opacity:.8}}>Applicant</div>
                <div style={{fontSize:14,fontWeight:700}}>{formData.fullName||(formData.firstName+' '+formData.lastName).trim()||'—'}</div>
                <div style={{fontSize:11,opacity:.7,marginTop:4}}>Category: {formData.category||'—'}</div>
              </div>
            </div>
          </div>

          {paid ? (
            /* ── Success ── */
            <div style={{textAlign:'center',padding:'28px 16px'}}>
              <div style={{fontSize:52,marginBottom:10}}>✅</div>
              <div style={{fontSize:19,fontWeight:800,color:'#2e7d32',marginBottom:6}}>Payment Successful!</div>
              <div style={{fontSize:13,color:'#555',marginBottom:14}}>₹{FEE} paid via {PAYMENT_METHODS.find(m=>m.value===formData.paymentMethod)?.label}</div>
              <div style={{background:'#e8f5e9',borderRadius:8,padding:'10px 20px',display:'inline-block'}}>
                <div style={{fontSize:11,color:'#555',marginBottom:2}}>Transaction ID</div>
                <div style={{fontSize:14,fontWeight:700,color:'#2e7d32',letterSpacing:1}}>TXN{Date.now().toString().slice(-10)}</div>
              </div>
            </div>
          ) : (
            <>
              {/* Method selector */}
              <div style={{marginBottom:6,fontSize:13,fontWeight:600,color:'#333'}}>
                Select Payment Method <span style={{color:'#e53935'}}>*</span>
              </div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:payErrors.paymentMethod?4:18}}>
                {PAYMENT_METHODS.map(m=><MethodTile key={m.value} {...m}/>)}
              </div>
              {payErrors.paymentMethod&&<div style={{color:'#e53935',fontSize:11,marginBottom:14}}>⚠ {payErrors.paymentMethod}</div>}

              {/* UPI */}
              {formData.paymentMethod==='upi'&&(
                <div style={{background:'#f0fffe',border:'1px solid #b2dfdb',borderRadius:10,padding:18,marginBottom:16}}>
                  <div style={{fontWeight:700,fontSize:13,color:'#003d7a',marginBottom:14}}>📱 Pay via UPI</div>
                  <div style={{display:'flex',gap:20,alignItems:'center',flexWrap:'wrap'}}>
                    <div style={{width:110,height:110,background:'#fff',border:'2px solid #003d7a',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <div style={{textAlign:'center'}}><div style={{fontSize:36}}>⬛</div><div style={{fontSize:8,color:'#003d7a',fontWeight:700,marginTop:3}}>Scan to pay</div></div>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{fontSize:11,color:'#777',marginBottom:6}}>— OR enter UPI ID —</div>
                      <FormGroup label="Your UPI ID" required error={payErrors.upiId} hint="e.g. yourname@paytm">
                        <Input value={formData.upiId} onChange={e=>{updateFormData({upiId:e.target.value});clrP('upiId');}} placeholder="name@upi" error={payErrors.upiId}/>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Card */}
              {formData.paymentMethod==='card'&&(
                <div style={{background:'#f8f8ff',border:'1px solid #e0e7f0',borderRadius:10,padding:18,marginBottom:16}}>
                  <div style={{fontWeight:700,fontSize:13,color:'#003d7a',marginBottom:14}}>💳 Debit / Credit Card</div>
                  {/* Card visual */}
                  <div style={{background:'linear-gradient(135deg,#1a237e,#283593)',borderRadius:12,padding:'16px 20px',color:'#fff',marginBottom:18,maxWidth:320,fontFamily:'monospace',boxShadow:'0 6px 16px rgba(26,35,126,.3)'}}>
                    <div style={{fontSize:10,opacity:.7,marginBottom:12}}>DEBIT/CREDIT CARD</div>
                    <div style={{fontSize:16,letterSpacing:2,marginBottom:12}}>{formData.cardNumber||'•••• •••• •••• ••••'}</div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
                      <div><div style={{opacity:.7,fontSize:8}}>CARDHOLDER</div><div style={{fontWeight:700}}>{formData.cardName||'YOUR NAME'}</div></div>
                      <div><div style={{opacity:.7,fontSize:8}}>EXPIRES</div><div style={{fontWeight:700}}>{formData.cardExpiry||'MM/YY'}</div></div>
                    </div>
                  </div>
                  <div className="form-row cols-1">
                    <FormGroup label="Cardholder Name" required error={payErrors.cardName}>
                      <Input value={formData.cardName} onChange={e=>{updateFormData({cardName:e.target.value});clrP('cardName');}} placeholder="Name as on card" error={payErrors.cardName}/>
                    </FormGroup>
                  </div>
                  <div className="form-row cols-1">
                    <FormGroup label="Card Number" required error={payErrors.cardNumber} hint="16-digit number">
                      <Input value={formData.cardNumber} onChange={e=>{const r=e.target.value.replace(/\D/g,'').slice(0,16);updateFormData({cardNumber:r.match(/.{1,4}/g)?.join(' ')||r});clrP('cardNumber');}} placeholder="XXXX XXXX XXXX XXXX" maxLength={19} error={payErrors.cardNumber}/>
                    </FormGroup>
                  </div>
                  <div className="form-row cols-2">
                    <FormGroup label="Expiry (MM/YY)" required error={payErrors.cardExpiry}>
                      <Input value={formData.cardExpiry} onChange={e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);updateFormData({cardExpiry:v});clrP('cardExpiry');}} placeholder="MM/YY" maxLength={5} error={payErrors.cardExpiry}/>
                    </FormGroup>
                    <FormGroup label="CVV" required error={payErrors.cardCVV} hint="3-4 digits">
                      <Input value={formData.cardCVV} onChange={e=>{updateFormData({cardCVV:e.target.value.replace(/\D/g,'').slice(0,4)});clrP('cardCVV');}} placeholder="•••" maxLength={4} type="password" error={payErrors.cardCVV}/>
                    </FormGroup>
                  </div>
                  <Alert>🔒 Secured with 256-bit SSL encryption</Alert>
                </div>
              )}

              {/* Net Banking */}
              {formData.paymentMethod==='netbanking'&&(
                <div style={{background:'#fffde7',border:'1px solid #fff9c4',borderRadius:10,padding:18,marginBottom:16}}>
                  <div style={{fontWeight:700,fontSize:13,color:'#003d7a',marginBottom:14}}>🏦 Net Banking</div>
                  <FormGroup label="Select Your Bank" required error={payErrors.netbankingBank}>
                    <Select value={formData.netbankingBank} onChange={e=>{updateFormData({netbankingBank:e.target.value});clrP('netbankingBank');}} options={BANKS} error={payErrors.netbankingBank}/>
                  </FormGroup>
                  {formData.netbankingBank&&(
                    <div style={{background:'#fff',borderRadius:8,padding:'10px 14px',border:'1px solid #e0e7f0',marginTop:10,fontSize:12,color:'#555'}}>
                      You will be redirected to <strong>{formData.netbankingBank}</strong> portal to complete payment of <strong>₹{FEE}</strong>.
                    </div>
                  )}
                </div>
              )}

              {formData.paymentMethod&&(
                <div style={{textAlign:'center',marginTop:18}}>
                  <button onClick={handlePayNow} disabled={paying}
                    style={{background:paying?'#aaa':'linear-gradient(135deg,#2e7d32,#43a047)',color:'#fff',border:'none',borderRadius:10,padding:'13px 44px',fontSize:15,fontWeight:800,cursor:paying?'not-allowed':'pointer',boxShadow:'0 4px 14px rgba(46,125,50,.4)',letterSpacing:.4}}>
                    {paying?'⏳ Processing...': `💳 Pay ₹${FEE} Now`}
                  </button>
                  <div style={{fontSize:11,color:'#888',marginTop:6}}>🔒 100% Secure Payment</div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader icon={ICON_DECL}>Declaration by Applicant (अर्जदाराचे घोषणा पत्र)</CardHeader>
        <CardBody>
          <div className="declaration-box">
            <h4>Declaration by Applicant</h4>
            <p>I hereby declare that all the particulars stated in the application are true to the best of my knowledge and belief. I have read and understood all the provisions of the prospectus and agree to abide by them. In the event of suppression or distortion of any fact, my admission is liable for cancellation. The fire and rescue training imparted at state fire academy is strenuous and involves risk of injuries, damage and life risk and I will have no claim of any compensation.</p>
            <p style={{marginTop:8,fontSize:11,color:'#555'}}>मी जाहीर करतो /करते की मी अर्जी मध्ये नमूद केलेली माहिती खरी आहे. जाहिराती मध्ये दिलेल्या सर्व सूचना मी वाचल्या आहेत व त्याच्याशी मी बांधील आहे...</p>
          </div>

          <div className="form-row cols-2" style={{marginTop:20}}>
            <FormGroup label="Date (दिनांक)" required error={declErrors.declarationDate}>
              <Input type="date" value={formData.declarationDate} onChange={upd('declarationDate')} error={declErrors.declarationDate}/>
            </FormGroup>
            <FormGroup label="Place (ठिकाण)" required error={declErrors.declarationPlace}>
              <Input value={formData.declarationPlace} onChange={upd('declarationPlace')} placeholder="Enter place" error={declErrors.declarationPlace}/>
            </FormGroup>
          </div>

          {/* Candidate signature upload */}
          <div style={{marginTop:20,display:'flex',justifyContent:'flex-end'}}>
            <div style={{textAlign:'center'}}>
              <p style={{fontSize:12,fontWeight:700,color:'#333',marginBottom:10}}>Signature of Candidate (उमेदवार स्वारी) :</p>
              <input ref={candRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleCandSign}/>
              <div style={signBox(!!candSignURL)} onClick={()=>candRef.current.click()}>
                {candSignURL
                  ?<img src={candSignURL} alt="Sign" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}}/>
                  :<div style={{textAlign:'center'}}><div style={{fontSize:22,color:'#ccc'}}>✒️</div><div style={{fontSize:10,color:'#aaa'}}>Click to upload</div></div>}
              </div>
              <button type="button" style={uplBtn} onClick={()=>candRef.current.click()}>Upload Signature</button>
              {candSignURL&&<p style={{fontSize:10,color:'#2e7d32',fontWeight:600,marginTop:4}}>✓ Uploaded</p>}
            </div>
          </div>

          <Divider/>

          <div className="declaration-box" style={{marginTop:16}}>
            <h4>Assurance by Parent / Guardian (पालकांचे हमीपत्र)</h4>
            <p>I father/mother/guardian hereby declare that I am fully aware of the terms and conditions of the course. The information provided by my son/ward is true and correct. The fire and rescue training is strenuous and I/We will have no claim of any compensation in case of injury or life risk.</p>
          </div>

          <div className="form-row cols-1" style={{marginTop:16}}>
            <FormGroup label="Parent / Guardian Full Name" required error={declErrors.guardianName}>
              <Input value={formData.guardianName} onChange={upd('guardianName')} placeholder="Full name of father / mother / guardian" error={declErrors.guardianName}/>
            </FormGroup>
          </div>
          <div className="form-row cols-2">
            <FormGroup label="Date (दिनांक)" required error={declErrors.guardianDate}>
              <Input type="date" value={formData.guardianDate} onChange={upd('guardianDate')} error={declErrors.guardianDate}/>
            </FormGroup>
            <FormGroup label="Place (ठिकाण)" required error={declErrors.guardianPlace}>
              <Input value={formData.guardianPlace} onChange={upd('guardianPlace')} placeholder="Enter place" error={declErrors.guardianPlace}/>
            </FormGroup>
          </div>

          {/* Guardian signature upload */}
          <div style={{marginTop:16,display:'flex',justifyContent:'flex-end'}}>
            <div style={{textAlign:'center'}}>
              <p style={{fontSize:12,fontWeight:700,color:'#333',marginBottom:10}}>Signature of Father / Mother / Guardian :</p>
              <input ref={guardRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleGuardSign}/>
              <div style={signBox(!!guardSignURL)} onClick={()=>guardRef.current.click()}>
                {guardSignURL
                  ?<img src={guardSignURL} alt="Sign" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}}/>
                  :<div style={{textAlign:'center'}}><div style={{fontSize:22,color:'#ccc'}}>✒️</div><div style={{fontSize:10,color:'#aaa'}}>Click to upload</div></div>}
              </div>
              <button type="button" style={uplBtn} onClick={()=>guardRef.current.click()}>Upload Signature</button>
              {guardSignURL&&<p style={{fontSize:10,color:'#2e7d32',fontWeight:600,marginTop:4}}>✓ Uploaded</p>}
            </div>
          </div>

          <Divider/>
          <div>
            <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',fontSize:13,color:'#333'}}>
              <input type="checkbox" checked={formData.agreed}
                onChange={e=>{updateFormData({agreed:e.target.checked});clrD('agreed');}}
                style={{width:16,height:16,marginTop:2,accentColor:'#003d7a'}}/>
              I have read and agree to all declarations above and confirm that all information provided is true and correct.
            </label>
            {declErrors.agreed&&<div style={{color:'#e53935',fontSize:11,marginTop:4}}>⚠ {declErrors.agreed}</div>}
          </div>
        </CardBody>
      </Card>

      {/* ══ BOTTOM BUTTONS ══ */}
      <div className="btn-row">
        <button className="btn btn-secondary" onClick={()=>goTo(6)}>← Back</button>
        <div style={{display:'flex',gap:12}}>
          <button className="btn btn-primary" onClick={handlePreview}
            style={{background:'#003d7a',display:'flex',alignItems:'center',gap:6}}>
            👁 Preview Application
          </button>
          <button className="btn btn-success" onClick={handleSubmit}
            style={{opacity:paid?1:.6,cursor:paid?'pointer':'not-allowed'}}>
            ✓ Submit Application
          </button>
        </div>
      </div>
    </>
  );
}
