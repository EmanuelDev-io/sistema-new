import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Ingresos() {
    const [ingresos, setIngresos] = useState([]);
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

    // Cargar ingresos
    const fetchIngresos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/ingresos');
            setIngresos(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los ingresos');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchIngresos();
    }, []);

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
                // Actualizar ingreso existente
                await axios.put(`/api/ingresos/${editingId}`, formData);
            } else {
                // Crear nuevo ingreso
                await axios.post('/api/ingresos', formData);
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
            fetchIngresos();
        } catch (err) {
            setError('Error al guardar el ingreso');
            console.error(err);
        }
    };

    // Editar ingreso
    const handleEdit = (ingreso) => {
        setFormData({
            descripcion: ingreso.descripcion,
            monto: ingreso.monto,
            fecha: ingreso.fecha,
            categoria: ingreso.categoria || '',
            notas: ingreso.notas || ''
        });
        setEditingId(ingreso.id);
        setShowForm(true);
    };

    // Eliminar ingreso
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
            try {
                await axios.delete(`/api/ingresos/${id}`);
                fetchIngresos();
            } catch (err) {
                setError('Error al eliminar el ingreso');
                console.error(err);
            }
        }
    };

    // Filtrar ingresos por término de búsqueda
    const filteredIngresos = ingresos.filter(ingreso => 
        ingreso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingreso.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gestión de Ingresos</h2>
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
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    {showForm ? 'Cancelar' : 'Nuevo Ingreso'}
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
                    <h3 className="text-lg font-semibold mb-4">{editingId ? 'Editar Ingreso' : 'Nuevo Ingreso'}</h3>
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

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por descripción o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {filteredIngresos.length === 0 ? (
                <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                    No se encontraron ingresos
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
                            {filteredIngresos.map((ingreso) => (
                                <tr key={ingreso.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{ingreso.descripcion}</td>
                                    <td className="py-3 px-4">${parseFloat(ingreso.monto).toFixed(2)}</td>
                                    <td className="py-3 px-4">{new Date(ingreso.fecha).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{ingreso.categoria || '-'}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(ingreso)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded transition duration-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ingreso.id)}
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

export default Ingresos;