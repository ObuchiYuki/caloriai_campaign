import exp from "constants";
import { Navigate, Route, Routes } from "react-router-dom";
import { ConfettiCard } from "../components/ConfettiCard";
import styled from "styled-components";
import { Home } from "./Home";
import { Code } from "./Code";
import { Check } from "./Check";
import { Input } from "./Input";

export const Invitation2024Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/invitation2024/check" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/code" element={<Code />} />
      <Route path="/check" element={<Check />} />
      <Route path="/input" element={<Input />} />
    </Routes>
  )
}