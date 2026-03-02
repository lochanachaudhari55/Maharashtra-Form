maharashtra-form/
├── public/                             # Static HTML shell
|    ├──index.html
|     ├──logo2.png
|    ├──logo3.png
├── src/
|   ├──index.js 
│   ├── App.jsx                # 🧠 Main brain — state, routing, step control
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx         # Top government header with logos
│   │   ├── Navbar.jsx         # Sticky nav with registration dropdown
│   │   ├── Dashboard.jsx      # Home screen with progress cards
│   │   ├── SuccessScreen.jsx  # Final submission success page
│   │   ├── OTPVerification.jsx # Mobile OTP popup
│   │   ├── ProgressBar.jsx    # Step progress strip
│   │   ├── UI.jsx             # Reusable UI components
│   │   └── steps/
│   │       ├── Step1PrimaryDetails.jsx   # Name, DOB, Photo, Signature
│   │       ├── Step2PersonalInfo.jsx     # Family, height, weight
│   │       ├── Step3AddressIds.jsx       # Address + pincode autofill
│   │       ├── Step4Qualifications.jsx   # Education + SSC autofill
│   │       ├── Step5MedicalSports.jsx    # Medical checkboxes + sports
│   │       ├── Step6Documents.jsx        # File uploads
│   │       ├── Step7Payment.jsx          # UPI / Card / Netbanking
│   │       └── Step8Declaration.jsx      # Sign & Submit
│   ├── data/
│   │   └── talukas.js         # All 37 districts + 400+ talukas of Maharashtra
│   ├── styles/
│   │   └── global.css         # All styling
│   └── utils/
│       └── validate.js        # Validation rules for all 8 steps
└── package.json
