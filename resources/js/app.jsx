import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Busca el elemento con id 'app' y renderiza el componente App dentro de él
const container = document.getElementById('app');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Elemento con id 'app' no encontrado en el DOM.");
}
