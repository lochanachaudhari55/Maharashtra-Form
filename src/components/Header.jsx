import React from 'react';


export default function Header() {
  return (
    <div style={{
      background: '#fff',
      borderBottom: '3px solid #003d7a',
      padding: '10px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 88,
    }}>
      {/* Left logo - aligned left, same side as header */}
      <div style={{ paddingLeft: '280px' }}>
        <img
          src={'/logo2.png'}
          alt="Government of India Emblem"
          style={{ height: 66, width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Center Text */}
      <div style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 1, fontWeight: 400 }}>
          Government of Maharashtra
        </p>
        <p style={{ fontSize: 11.5, color: '#666', marginBottom: 4, fontWeight: 400 }}>
          Skill, Employment, Entrepreneurship and Innovation Department
        </p>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: '#003d7a', lineHeight: 1.35, margin: 0 }}>
          Maharashtra State Board of Skill, Vocational Education and Training
        </h1>
      </div>

      {/* Right logo - aligned right, same side as header */}
      <div style={{ paddingRight: '280px'}}>
        <img
          src={'/logo3.png'}
          alt="Maharashtra State Board Logo"
          style={{ height: 70, width: 'auto', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
