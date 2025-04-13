import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Gastos() {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        monto: '',
        fecha: '',
        categoria: '',
        notas: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [facturas, setFacturas] = useState([]);
    const [showFacturas, setShowFacturas] = useState(false);
    const [selectedGastoId, setSelectedGastoId] = useState(null);

    // Cargar gastos
    const fetchGastos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/gastos');
            setGastos(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los gastos');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGastos();
    }, []);

    // Cargar facturas de un gasto específico
    const fetchFacturas = async (gastoId) => {
        try {
            const response = await axios.get(`/api/gastos/${gastoId}/facturas`);
            setFacturas(response.data);
            setSelectedGastoId(gastoId);
            setShowFacturas(true);
        } catch (err) {
            setError('Error al cargar las facturas');
            console.error(err);
        }
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Actualizar gasto existente
                await axios.put(`/api/gastos/${editingId}`, formData);
            } else {
                // Crear nuevo gasto
                await axios.post('/api/gastos', formData);
            }
            // Resetear formulario y recargar datos
            setFormData({
                descripcion: '',
                monto: '',
                fecha: '',
                categoria: '',
                notas: ''
            });
            setShowForm(false);
            setEditingId(null);
            fetchGastos();
        } catch (err) {
            setError('Error al guardar el gasto');
            console.error(err);
        }
    };

    // Editar gasto
    const handleEdit = (gasto) => {
        setFormData({
            descripcion: gasto.descripcion,
            monto: gasto.monto,
            fecha: gasto.fecha,
            categoria: gasto.categoria || '',
            notas: gasto.notas || ''
        });
        setEditingId(gasto.id);
        setShowForm(true);
    };

    // Eliminar gasto
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
            try {
                await axios.delete(`/api/gastos/${id}`);
                fetchGastos();
            } catch (err) {
                setError('Error al eliminar el gasto');
                console.error(err);
            }
        }
    };

    // Filtrar gastos por término de búsqueda
    const filteredGastos = gastos.filter(gasto => 
        gasto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gasto.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gestión de Gastos</h2>
                <button 
                    onClick={() => {
                        setFormData({
                            descripcion: '',
                            monto: '',
                            fecha: '',
                            categoria: '',
                            notas: ''
                        });
                        setEditingId(null);
                        setShowForm(!showForm);
                        setShowFacturas(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    {showForm ? 'Cancelar' : 'Nuevo Gasto'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Cerrar</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                </div>
            )}

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{editingId ? 'Editar Gasto' : 'Nuevo Gasto'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                                    Descripción *
                                </label>
                                <input
                                    type="text"
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monto">
                                    Monto *
                                </label>
                                <input
                                    type="number"
                                    id="monto"
                                    name="monto"
                                    value={formData.monto}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
                                    Fecha *
                                </label>
                                <input
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
                                    Categoría
                                </label>
                                <input
                                    type="text"
                                    id="categoria"
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notas">
                                Notas
                            </label>
                            <textarea
                                id="notas"
                                name="notas"
                                value={formData.notas}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                                {editingId ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showFacturas && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Facturas Asociadas</h3>
                        <button 
                            onClick={() => setShowFacturas(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {facturas.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                            No hay facturas asociadas a este gasto
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Nombre</th>
                                        <th className="py-2 px-4 text-left">Monto</th>
                                        <th className="py-2 px-4 text-left">Fecha Emisión</th>
                                        <th className="py-2 px-4 text-left">Tipo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {facturas.map((factura) => (
                                        <tr key={factura.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4">{factura.nombre}</td>
                                            <td className="py-2 px-4">${parseFloat(factura.monto).toFixed(2)}</td>
                                            <td className="py-2 px-4">{new Date(factura.fecha_emision).toLocaleDateString()}</td>
                                            <td className="py-2 px-4">{factura.tipo_documento}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por descripción o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {filteredGastos.length === 0 ? (
                <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                    No se encontraron gastos
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Descripción</th>
                                <th className="py-3 px-4 text-left">Monto</th>
                                <th className="py-3 px-4 text-left">Fecha</th>
                                <th className="py-3 px-4 text-left">Categoría</th>
                                <th className="py-3 px-4 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredGastos.map((gasto) => (
                                <tr key={gasto.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{gasto.descripcion}</td>
                                    <td className="py-3 px-4">${parseFloat(gasto.monto).toFixed(2)}</td>
                                    <td className="py-3 px-4">{new Date(gasto.fecha).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{gasto.categoria || '-'}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            onClick={() => fetchFacturas(gasto.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition duration-300"
                                            title="Ver facturas"
                                        >
                                            Facturas
                                        </button>
                                        <button
                                            onClick={() => handleEdit(gasto)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded transition duration-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gasto.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition duration-300"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Gastos;