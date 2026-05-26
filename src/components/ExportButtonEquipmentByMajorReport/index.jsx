import React from 'react';
import { CSVLink } from 'react-csv';

const ExportButtonEquipmentByMajorReport = ({ data }) => {
  const headers = [
    { label: 'Nivel', key: 'prgdLevel' },
    { label: 'Código Asignatura', key: 'coursCode' },
    { label: 'Asignatura', key: 'courseDescription' },
    { label: 'Código Clase', key: 'stdcItemCode' },
    { label: 'Clase', key: 'stdcItemDescription' },
    { label: 'Recinto', key: 'stdcRlayDescription' },
    { label: 'Capacidad Recinto', key: 'rlayCapacity' },
    { label: 'Ciclo de Renvación', key: 'stdcRenewalCicle' },
    { label: 'Ciclo Mantención', key: 'stdcMaintenanceCicle' },
    { label: 'Rendimiento', key: 'stdcPerformance' },
    { label: 'Cantidad', key: 'quantity' },
  ];

  return (
    // <div className={styles}>
    //     <button className='btn btn-primary'>
    //         <i className='fa fa-file-download'></i>
    //         <span> Exportar</span>
    //     </button>
    // </div>
    <CSVLink
      data={data}
      headers={headers}
      className="btn btn-primary"
      separator={';'}
      bom={true}
      filename={`reporte_equipamiento_por_carrera_${new Date().toLocaleDateString()}.csv`}>
      <i className="fa fa-file-download" />
      <span> Exportar</span>
    </CSVLink>
  );
};

export default ExportButtonEquipmentByMajorReport;
