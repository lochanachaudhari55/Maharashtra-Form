const radio = (val, msg='Please select Yes or No') => (!val ? msg : '');

export function validateStep1(f) {
  const e = {};
  if (!f.firstName?.trim())   e.firstName    = 'First name is required';
  if (!f.lastName?.trim())    e.lastName     = 'Last name is required';
  if (!f.dob)                 e.dob          = 'Date of birth is required';
  if (!f.gender)              e.gender       = 'Please select gender';
  if (!f.aadharNumber || f.aadharNumber.length!==12 || !/^\d+$/.test(f.aadharNumber))
                              e.aadharNumber = 'Enter valid 12-digit Aadhar number';
  if (!f.email || !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter valid email address';
  if (!f.category)            e.category     = 'Please select category';
  if (!f.primaryMobile || f.primaryMobile.length!==10 || !/^\d+$/.test(f.primaryMobile))
                              e.primaryMobile = 'Enter valid 10-digit mobile number';
  if (!f.nationality)         e.nationality  = 'Please select nationality';
  return e;
}

export function validateStep2(f) {
  const e = {};
  if (!f.fatherName?.trim()) e.fatherName    = 'Father name is required';
  if (!f.motherName?.trim()) e.motherName    = 'Mother name is required';
  if (!f.height)             e.height        = 'Height is required';
  if (!f.weight)             e.weight        = 'Weight is required';
  const r1=radio(f.hearingImpaired); if(r1) e.hearingImpaired=r1;
  const r2=radio(f.knowsMarathi);   if(r2) e.knowsMarathi=r2;
  return e;
}

export function validateStep3(f) {
  const e = {};
  if (!f.address?.trim()) e.address  = 'Address is required';
  if (!f.village?.trim()) e.village  = 'Village / City is required';
  if (!f.taluka?.trim())  e.taluka   = 'Taluka is required';
  if (!f.district)        e.district = 'Please select district';
  if (!f.state)           e.state    = 'Please select state';
  if (!f.country)         e.country  = 'Please select country';
  if (!f.pinCode || f.pinCode.length!==6 || !/^\d+$/.test(f.pinCode))
                          e.pinCode  = 'Enter valid 6-digit pin code';
  ['domicileMaharashtra','pwdStatus','projectAffected','earthquakeAffected','exServiceman']
    .forEach(k => { const r=radio(f[k]); if(r) e[k]=r; });
  return e;
}

export function validateStep4(f) {
  const e = {};
  if (!f.qualifications.some(q=>q.obtained&&q.max&&q.board))
    e.qualifications = 'At least one complete qualification entry is required';
  const r1=radio(f.ssc45); if(r1) e.ssc45=r1;
  const r2=radio(f.ssc50); if(r2) e.ssc50=r2;
  return e;
}

export function validateStep5(f) {
  const e = {};
  ['vision66','colorVision','normalHearing','squintEyes',
   'chestExpansion5cm','flatFoot','kneeKnock','varicoseVein',
   'boneDisease','noMedicalDeformity','mentalHistory','majorSurgery',
   'speechDeficiency','skinDisease','drivingLicenseLMV','drivingLicenseHMV',
   'nccA','nccB','nccC','civilDefense','homeGuard','meritoriousSports']
  .forEach(k => { const r=radio(f[k]); if(r) e[k]=r; });
  return e;
}

export function validateStep6(f) {
  const e = {};
  [0,1,2,3,8,9].forEach(i => { if(!f.documents?.[i]) e[`doc_${i}`]='This document is required'; });
  return e;
}

export function validateStep7Payment(f) {
  const e = {};
  if (!f.paymentMethod) { e.paymentMethod = 'Please select a payment method'; return e; }
  if (f.paymentMethod==='upi') {
    if (!f.upiId?.trim()) e.upiId = 'UPI ID is required';
    else if (!/^[\w.\-_]{2,}@[a-zA-Z]{2,}$/.test(f.upiId)) e.upiId = 'Enter valid UPI ID (e.g. name@upi)';
  }
  if (f.paymentMethod==='card') {
    if (!f.cardName?.trim()) e.cardName = 'Cardholder name is required';
    if (!f.cardNumber || f.cardNumber.replace(/\s/g,'').length!==16) e.cardNumber = 'Enter valid 16-digit card number';
    if (!f.cardExpiry || !/^\d{2}\/\d{2}$/.test(f.cardExpiry)) e.cardExpiry = 'Enter expiry as MM/YY';
    if (!f.cardCVV || !/^\d{3,4}$/.test(f.cardCVV)) e.cardCVV = 'Enter valid 3 or 4 digit CVV';
  }
  if (f.paymentMethod==='netbanking') {
    if (!f.netbankingBank) e.netbankingBank = 'Please select your bank';
  }
  return e;
}

export function validateStep8Declaration(f) {
  const e = {};
  if (!f.declarationDate)          e.declarationDate  = 'Declaration date is required';
  if (!f.declarationPlace?.trim()) e.declarationPlace = 'Declaration place is required';
  if (!f.guardianName?.trim())     e.guardianName     = 'Guardian name is required';
  if (!f.guardianDate)             e.guardianDate     = 'Guardian date is required';
  if (!f.guardianPlace?.trim())    e.guardianPlace    = 'Guardian place is required';
  if (!f.agreed)                   e.agreed           = 'You must agree to the declaration';
  return e;
}
