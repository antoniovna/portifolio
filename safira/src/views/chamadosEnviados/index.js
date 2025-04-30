import React from "react";
import ChamadosAtivos from './chamadosAtivos';
import ChamadosEncerrados from './chamadosEncerrados';
export default function ChamadosRecebidos() {


  return (
    <>
      <div className="content">
        <ChamadosAtivos />
        <ChamadosEncerrados />
      </div>
    </>
  );
};
