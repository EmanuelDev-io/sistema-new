import React from 'react';
import Ingresos from './Ingresos';
import Gastos from './Gastos';
import Cuentas from './Cuentas';
import Facturas from './Facturas';

function App() {
    return (
        <div>
            <h1>Sistema de Gastos e Ingresos</h1>
            {/* Por ahora, mostramos solo Ingresos. Más adelante se puede añadir enrutamiento */}
            <Ingresos />
            {/* <Gastos /> */}
            {/* <Cuentas /> */}
            {/* <Facturas /> */}
        </div>
    );
}

export default App;
