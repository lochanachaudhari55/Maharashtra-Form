import React, { useState } from 'react';
import Header       from './components/Header';
import ProgressBar  from './components/ProgressBar';
import Step1PrimaryDetails from './components/steps/Step1PrimaryDetails';
import Step2PersonalInfo   from './components/steps/Step2PersonalInfo';
import Step3Address        from './components/steps/Step3Address';
import Step4Qualifications from './components/steps/Step4Qualifications';
import Step5MedicalSports  from './components/steps/Step5MedicalSports';
import Step6Documents      from './components/steps/Step6Documents';
import Step7Payment        from './components/steps/Step7Payment';
import Step8Declaration    from './components/steps/Step8Declaration';
import SuccessScreen       from './components/SuccessScreen';

const TOTAL_STEPS = 8;
const stepLabels  = [
  'Primary Details','Personal Info','Address',
  'Qualifications','Medical & Sports','Documents',
  'Payment','Declaration',
];

export const INITIAL_STATE = {
  // Step 1
  firstName:'', middleName:'', lastName:'', fullName:'',
  dob:'', gender:'', aadharNumber:'', aadharFile:null,
  email:'', category:'', primaryMobile:'', nationality:'',
  nameChangeStatus:'', changedFirstName:'', changedMiddleName:'', changedLastName:'',
  photo:null, signature:null,
  // Step 2
  fatherName:'', motherName:'',
  height:'', weight:'', chestDeflated:'', chestInflated:'',
  hearingImpaired:'', knowsMarathi:'',
  preferredLocation1:'', preferredLocation2:'', preferredLocation3:'',
  // Step 3
  address:'', village:'', taluka:'', district:'', state:'', country:'', pinCode:'',
  domicileMaharashtra:'', pwdStatus:'', projectAffected:'', earthquakeAffected:'', exServiceman:'',
  // Step 4
  qualifications:[{ type:'SSC', obtained:'', max:'', percentage:'', board:'' }],
  ssc45:'', ssc50:'',
  // Step 5
  vision66:'', colorVision:'', normalHearing:'', squintEyes:'',
  chestExpansion5cm:'', flatFoot:'', kneeKnock:'', varicoseVein:'',
  boneDisease:'', noMedicalDeformity:'',
  mentalHistory:'', majorSurgery:'', speechDeficiency:'', skinDisease:'',
  drivingLicenseLMV:'', drivingLicenseHMV:'',
  nccA:'', nccB:'', nccC:'', civilDefense:'', homeGuard:'',
  meritoriousSports:'', sportsDetails:[],
  // Step 6
  documents:{},
  // Step 7 – Payment
  paymentMethod:'', upiId:'', cardNumber:'', cardExpiry:'', cardCVV:'', cardName:'',
  netbankingBank:'', paymentStatus:'', transactionId:'',
  // Step 8 – Declaration
  declarationDate:'', declarationPlace:'',
  guardianName:'', guardianDate:'', guardianPlace:'',
  candidateSignature:null, candidateSignatureURL:'',
  guardianSignature:null,  guardianSignatureURL:'',
  agreed:false,
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted,   setSubmitted]   = useState(false);
  const [formData,    setFormData]    = useState(INITIAL_STATE);

  const updateFormData = updates => setFormData(prev => ({ ...prev, ...updates }));

  const goTo = step => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      window.scrollTo({ top:0, behavior:'smooth' });
    }
  };

  const stepProps = { formData, updateFormData, goTo };

  return (
    <div style={{ fontFamily:"'Noto Sans',sans-serif", background:'#f0f4f8', minHeight:'100vh' }}>
      <Header />
      <ProgressBar currentStep={currentStep} stepLabels={stepLabels} goTo={goTo} submitted={submitted} />
      <div style={{ maxWidth:1100, margin:'24px auto', padding:'0 16px' }}>
        {submitted ? <SuccessScreen /> : (
          <>
            {currentStep === 1 && <Step1PrimaryDetails {...stepProps} />}
            {currentStep === 2 && <Step2PersonalInfo   {...stepProps} />}
            {currentStep === 3 && <Step3Address        {...stepProps} />}
            {currentStep === 4 && <Step4Qualifications {...stepProps} />}
            {currentStep === 5 && <Step5MedicalSports  {...stepProps} />}
            {currentStep === 6 && <Step6Documents      {...stepProps} />}
            {currentStep === 7 && <Step7Payment        {...stepProps} />}
            {currentStep === 8 && <Step8Declaration    {...stepProps} onSubmit={() => setSubmitted(true)} />}
          </>
        )}
      </div>
    </div>
  );
}
