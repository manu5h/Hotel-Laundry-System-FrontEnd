import React, { useState } from "react";
import styled from "styled-components";

// Styled components for the switch

const SwitchContainer = styled.div`
  width: 14%;
  height: 65px;
  background-color: #fff;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOn ? "flex-end" : "flex-start")};
  cursor: pointer;
  position: relative;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;

const ToggleButton = styled.div`
  width: 50%;
  height: 90%;
  background-color: ${(props) => (props.isOn ? "#C62E2E" : "#FF9800")};
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isOn ? "#fff" : "#fff")};
  font-weight: bold;
  position: absolute;
  left: ${(props) => (props.isOn ? "47.5%" : "2.5%")};
  transition: 0.3s ease;
  z-index: 2; /* Ensure button is above text */
`;

const Label = styled.div`
  margin: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  align-items: center;
  z-index: 0;
  height: 100%;
`;

const IOSSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="switch-btn" style={{display: "flex", justifyContent: "center", margin: "60px"}}>
      <SwitchContainer isOn={isOn} onClick={handleToggle}>
        <Label>
          <span style={{ color: "#C62E2E" }}>Ongoing</span>
          <span style={{ color: "#FF9800" }}>History</span>
        </Label>
        <ToggleButton isOn={isOn}>{isOn ? "History" : "Ongoing"}</ToggleButton>
      </SwitchContainer>
    </div>
  );
};

export default IOSSwitch;
