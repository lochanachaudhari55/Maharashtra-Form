

## 📁 Project Structure

```
src/
├── App.jsx                        # Main app, state management, step routing
├── index.js                       # React entry point
├── styles/
│   └── global.css                 # All shared styles
├── assets/
│   ├── logo1.js                   # Maharashtra Seal (base64)
│   ├── logo2.js                   # GOI Ashoka Emblem (base64)
│   └── logo3.js                   # Board Shield Logo (base64)
└── components/
    ├── Header.jsx                 # Top header with logos
    ├── Navbar.jsx                 # Navigation bar
    ├── ProgressBar.jsx            # 7-step progress indicator
    ├── SuccessScreen.jsx          # Submission success page
    ├── UI.jsx                     # Reusable UI components
    └── steps/
        ├── Step1PrimaryDetails.jsx    # Name, DOB, Aadhar, Mobile, Photo
        ├── Step2PersonalInfo.jsx      # Family, Physical, Locations
        ├── Step3AddressIds.jsx        # Address, Domicile, Special Categories
        ├── Step4Qualifications.jsx    # Education table with auto % calc
        ├── Step5MedicalSports.jsx     # Medical fitness + Sports details
        ├── Step6Documents.jsx         # Document upload + Payment info
        └── Step7Declaration.jsx       # Declaration + Submission
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```
