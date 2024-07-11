import React, { useEffect } from "react";
import { useCombustionStore } from "../lib/combustion.store";

const CombustionTable: React.FC = () => {
  const { combustion, loadCombustion } = useCombustionStore();

  useEffect(() => {
    loadCombustion(); // Llama a loadCombustion cuando el componente se monta
  }, [loadCombustion]); // Dependencia vacía para solo llamar una vez al montar

  if (!combustion) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Tabla de Combustibles</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Consumo</th>
            {/* Agrega más encabezados si es necesario */}
          </tr>
        </thead>
        <tbody>
          {combustion.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.tipo}</td>
              <td>{item.consumo}</td>
              {/* Agrega más celdas si es necesario */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CombustionTable;
