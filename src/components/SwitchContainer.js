import React, { useState } from "react";
import styled from "styled-components";

// Styled components for the switch

const SwitchContainer = styled.div`
  width: 235px;
  height: 65px;
  background-color: #fff;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOn ? "flex-end" : "flex-start")};
  cursor: pointer;
  position: relative;
  box-shadow: 0 0 5px rgb(255 255 255);;
`;

const ToggleButton = styled.div`
  width: 110px;
  height: 57px;
  background-color: ${(props) => (props.isOn ? "#5fa051" : "#DD8A6C")};
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  position: absolute;
  left: ${(props) => (props.isOn ? "50.5%" : "2.5%")};
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

const Content = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
`;

const IOSSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="switch-btn" style={{ display: "flex", justifyContent: "center", margin: "60px" }}>
        <SwitchContainer isOn={isOn} onClick={handleToggle}>
          <Label>
            <span style={{ color: "#5fa051" }}>Ongoing</span>
            <span style={{ color: "#DD8A6C" }}>Completed</span>
          </Label>
          <ToggleButton isOn={isOn}>{isOn ? "Completed" : "Ongoing"}</ToggleButton>
        </SwitchContainer>
      </div>
      
      {/* Conditionally Render Content Based on isOn */}
      <Content>
        {isOn ? (
          <div>
            <h2>Completed</h2>
            <p>Here is the list of your completed orders.</p>
            {/* Add more content or components related to Completed */}
          </div>
        ) : (
          <div>
            <h2>Ongoing Orders</h2>
            <p>Here is the list of your ongoing orders.</p>
            {/* Add more content or components related to Ongoing Orders */}
          </div>
        )}
      </Content>
    </div>
  );
};

export default IOSSwitch;
