import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Facturas() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        monto: '',
        fecha_emision: '',
        fecha_vencimiento: '',
        tipo_documento: 'otro',
        gasto_id: '',
        notas: ''
    });
    const [archivo, setArchivo] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [gastos, setGastos] = useState([]);

    // Cargar facturas
    const fetchFacturas = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/facturas');
            setFacturas(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar las facturas');
            setLoading(false);
            console.error(err);
        }
    };

    // Cargar gastos para el selector
    const fetchGastos = async () => {
        try {
            const response = await axios.get('/api/gastos');
            setGastos(response.data);
        } catch (err) {
            console.error('Error al cargar los gastos:', err);
        }
    };

    useEffect(() => {
        fetchFacturas();
        fetchGastos();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar cambios en el archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArchivo(file);
            
            // Crear URL para previsualización
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
                setFormData({ ...formData, tipo_documento: 'imagen' });
            } else if (file.type === 'application/pdf') {
                setPreviewUrl(null); // No hay previsualización para PDF
                setFormData({ ...formData, tipo_documento: 'pdf' });
            } else {
                setPreviewUrl(null);
                setFormData({ ...formData, tipo_documento: 'otro' });
            }
        } else {
            setArchivo(null);
            setPreviewUrl(null);
        }
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formDataToSend = new FormData();
            
            // Añadir todos los campos del formulario
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Añadir el archivo si existe
            if (archivo) {
                formDataToSend.append('archivo', archivo);
            }
            
            if (editingId) {
                // Actualizar factura existente
                await axios.post(`/api/facturas/${editingId}?_method=PUT`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Crear nueva factura
                await axios.post('/api/facturas', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            // Resetear formulario y recargar datos
            setFormData({
                nombre: '',
                monto: '',
                fecha_emision: '',
                fecha_vencimiento: '',
                tipo_documento: 'otro',
                gasto_id: '',
                notas: ''
            });
            setArchivo(null);
            setPreviewUrl(null);
            setShowForm(false);
            setEditingId(null);
            fetchFacturas();
        } catch (err) {
            setError('Error al guardar la factura');
            console.error(err);
        }
    };

    // Editar factura
    const handleEdit = (factura) => {
        setFormData({
            nombre: factura.nombre,
            monto: factura.monto,
            fecha_emision: factura.fecha_emision,
            fecha_vencimiento: factura.fecha_vencimiento || '',
            tipo_documento: factura.tipo_documento,
            gasto_id: factura.gasto_id || '',
            notas: factura.notas || ''
        });
        setArchivo(null); // No podemos cargar el archivo existente
        setPreviewUrl(null);
        setEditingId(factura.id);
        setShowForm(true);
    };

    // Eliminar factura
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
            try {
                await axios.delete(`/api/facturas/${id}`);
                fetchFacturas();
            } catch (err) {
                setError('Error al eliminar la factura');
                console.error(err);
            }
        }
    };

    // Ver archivo
    const handleViewFile = (rutaArchivo) => {
        window.open(`/storage/${rutaArchivo}`, '_blank');
    };

    // Filtrar facturas por término de búsqueda
    const filteredFacturas = facturas.filter(factura => 
        factura.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gestión de Facturas</h2>
                <button 
                    onClick={() => {
                        setFormData({
                            nombre: '',
                            monto: '',
                            fecha_emision: '',
                            fecha_vencimiento: '',
                            tipo_documento: 'otro',
                            gasto_id: '',
                            notas: ''
                        });
                        setArchivo(null);
                        setPreviewUrl(null);
                        setEditingId(null);
                        setShowForm(!showForm);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    {showForm ? 'Cancelar' : 'Nueva Factura'}
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
                    <h3 className="text-lg font-semibold mb-4">{editingId ? 'Editar Factura' : 'Nueva Factura'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre/Descripción *
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_emision">
                                    Fecha de Emisión *
                                </label>
                                <input
                                    type="date"
                                    id="fecha_emision"
                                    name="fecha_emision"
                                    value={formData.fecha_emision}
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gasto_id">
                                    Asociar a Gasto
                                </label>
                                <select
                                    id="gasto_id"
                                    name="gasto_id"
                                    value={formData.gasto_id}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">-- Seleccionar Gasto --</option>
                                    {gastos.map(gasto => (
                                        <option key={gasto.id} value={gasto.id}>
                                            {gasto.descripcion} - ${parseFloat(gasto.monto).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="archivo">
                                    {editingId ? 'Reemplazar Archivo' : 'Archivo *'}
                                </label>
                                <input
                                    type="file"
                                    id="archivo"
                                    name="archivo"
                                    onChange={handleFileChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    accept="image/*,.pdf"
                                    required={!editingId}
                                />
                                {previewUrl && (
                                    <div className="mt-2">
                                        <img src={previewUrl} alt="Vista previa" className="max-h-32 rounded border" />
                                    </div>
                                )}
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
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {filteredFacturas.length === 0 ? (
                <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                    No se encontraron facturas
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Nombre/Descripción</th>
                                <th className="py-3 px-4 text-left">Monto</th>
                                <th className="py-3 px-4 text-left">Fecha de Emisión</th>
                                <th className="py-3 px-4 text-left">Tipo</th>
                                <th className="py-3 px-4 text-left">Gasto Asociado</th>
                                <th className="py-3 px-4 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredFacturas.map((factura) => (
                                <tr key={factura.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{factura.nombre}</td>
                                    <td className="py-3 px-4">${parseFloat(factura.monto).toFixed(2)}</td>
                                    <td className="py-3 px-4">{new Date(factura.fecha_emision).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-block px-2 py-1 rounded text-xs ${factura.tipo_documento === 'imagen' ? 'bg-blue-100 text-blue-800' : factura.tipo_documento === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {factura.tipo_documento.charAt(0).toUpperCase() + factura.tipo_documento.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {factura.gasto_id ? (
                                            gastos.find(g => g.id === factura.gasto_id)?.descripcion || 'Gasto no encontrado'
                                        ) : '-'}
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            onClick={() => handleViewFile(factura.ruta_archivo)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition duration-300"
                                            title="Ver archivo"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => handleEdit(factura)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded transition duration-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(factura.id)}
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

export default Facturas;