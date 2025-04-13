import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cuentas() {
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nombre_pagina: '',
        correo: '',
        password: '',
        fecha_registro: '',
        fecha_vencimiento: '',
        tipo_servicio: 'otro',
        notas: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Cargar cuentas
    const fetchCuentas = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cuentas');
            setCuentas(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar las cuentas');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCuentas();
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
                // Actualizar cuenta existente
                await axios.put(`/api/cuentas/${editingId}`, formData);
            } else {
                // Crear nueva cuenta
                await axios.post('/api/cuentas', formData);
            }
            // Resetear formulario y recargar datos
            setFormData({
                nombre_pagina: '',
                correo: '',
                password: '',
                fecha_registro: '',
                fecha_vencimiento: '',
                tipo_servicio: 'otro',
                notas: ''
            });
            setShowForm(false);
            setEditingId(null);
            fetchCuentas();
        } catch (err) {
            setError('Error al guardar la cuenta');
            console.error(err);
        }
    };

    // Editar cuenta
    const handleEdit = (cuenta) => {
        setFormData({
            nombre_pagina: cuenta.nombre_pagina,
            correo: cuenta.correo,
            password: cuenta.password,
            fecha_registro: cuenta.fecha_registro,
            fecha_vencimiento: cuenta.fecha_vencimiento || '',
            tipo_servicio: cuenta.tipo_servicio || 'otro',
            notas: cuenta.notas || ''
        });
        setEditingId(cuenta.id);
        setShowForm(true);
    };

    // Eliminar cuenta
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cuenta?')) {
            try {
                await axios.delete(`/api/cuentas/${id}`);
                fetchCuentas();
            } catch (err) {
                setError('Error al eliminar la cuenta');
                console.error(err);
            }
        }
    };

    // Filtrar cuentas por término de búsqueda
    const filteredCuentas = cuentas.filter(cuenta => 
        cuenta.nombre_pagina.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gestión de Cuentas</h2>
                <button 
                    onClick={() => {
                        setFormData({
                            nombre_pagina: '',
                            correo: '',
                            password: '',
                            fecha_registro: '',
                            fecha_vencimiento: '',
                            tipo_servicio: 'otro',
                            notas: ''
                        });
                        setEditingId(null);
                        setShowForm(!showForm);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    {showForm ? 'Cancelar' : 'Nueva Cuenta'}
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
                    <h3 className="text-lg font-semibold mb-4">{editingId ? 'Editar Cuenta' : 'Nueva Cuenta'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre_pagina">
                                    Nombre de Página/Servicio *
                                </label>
                                <input
                                    type="text"
                                    id="nombre_pagina"
                                    name="nombre_pagina"
                                    value={formData.nombre_pagina}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
                                    Correo/Usuario *
                                </label>
                                <input
                                    type="text"
                                    id="correo"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Contraseña *
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_registro">
                                    Fecha de Registro *
                                </label>
                                <input
                                    type="date"
                                    id="fecha_registro"
                                    name="fecha_registro"
                                    value={formData.fecha_registro}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_vencimiento">
                                    Fecha de Vencimiento
                                </label>
                                <input
                                    type="date"
                                    id="fecha_vencimiento"
                                    name="fecha_vencimiento"
                                    value={formData.fecha_vencimiento}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipo_servicio">
                                    Tipo de Servicio *
                                </label>
                                <select
                                    id="tipo_servicio"
                                    name="tipo_servicio"
                                    value={formData.tipo_servicio}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="outlook">Outlook</option>
                                    <option value="hostinger">Hostinger</option>
                                    <option value="otro">Otro</option>
                                </select>
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
                    placeholder="Buscar por nombre o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {filteredCuentas.length === 0 ? (
                <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                    No se encontraron cuentas
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Nombre de Página/Servicio</th>
                                <th className="py-3 px-4 text-left">Correo/Usuario</th>
                                <th className="py-3 px-4 text-left">Tipo de Servicio</th>
                                <th className="py-3 px-4 text-left">Fecha de Registro</th>
                                <th className="py-3 px-4 text-left">Fecha de Vencimiento</th>
                                <th className="py-3 px-4 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCuentas.map((cuenta) => (
                                <tr key={cuenta.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{cuenta.nombre_pagina}</td>
                                    <td className="py-3 px-4">{cuenta.correo}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                                            cuenta.tipo_servicio === 'outlook' ? 'bg-blue-100 text-blue-800' : 
                                            cuenta.tipo_servicio === 'hostinger' ? 'bg-green-100 text-green-800' : 
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {cuenta.tipo_servicio ? cuenta.tipo_servicio.charAt(0).toUpperCase() + cuenta.tipo_servicio.slice(1) : 'Otro'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{new Date(cuenta.fecha_registro).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{cuenta.fecha_vencimiento ? new Date(cuenta.fecha_vencimiento).toLocaleDateString() : '-'}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(cuenta)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded transition duration-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cuenta.id)}
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

export default Cuentas;