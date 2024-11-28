import React, { useEffect } from 'react';
import * as CaloriAI from './caloriai_connector';
import html2canvas from 'html2canvas';
import styled from 'styled-components';
import { FixedFooter } from './components/FixedFooter';
import { ProminentButton, ProminentButtonStyle } from './components/ProminentButton';
import { Route, Routes } from 'react-router-dom';
import { Invitation2024Routes } from './invitation2024/Invitation2024Route';

function App() {
  const onClickRegister = async () => {
  }

  
  return (
    <Routes>
      <Route path="/invitation2024/*" element={<Invitation2024Routes />} />
    </Routes>
  );
}

export default App;
