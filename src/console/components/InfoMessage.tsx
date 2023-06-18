import React from "react";
import styled from "../styles/styled";
import useAutoResize from "../hooks/useAutoResize";

const Wrapper = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.info?.background};
  color: ${({ theme }) => theme.info?.foreground};
  font-weight: normal;
  white-space: pre-wrap;
`;

const InfoMessage: React.FC = ({ children }) => {
  useAutoResize();

  return <Wrapper role="status">{children}</Wrapper>;
};

export default InfoMessage;
