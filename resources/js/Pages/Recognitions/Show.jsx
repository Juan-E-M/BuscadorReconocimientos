import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Swal from "sweetalert2";

export default function Show(props) {
    const { recognition, auth } = props;

    const recognitionsField = [
        { label: "Nombre", value: recognition.name },
        { label: "Presupuesto", value: recognition.budget },
        { label: "País", value: recognition.country.name },
        { label: "Región", value: recognition.region },
        { label: "Fecha de Inicio", value: recognition.start_date },
        { label: "Fecha de Fin", value: recognition.end_date },
        { label: "Institución", value: recognition.institution },
        { label: "Resumen", value: recognition.summary },
        { label: "CRL", value: recognition.crl.name },
        { label: "TRL", value: recognition.trl.name },
        {
            label: "OCDE",
            value: recognition.ocde.map((item) => item.code).join(", "),
        },
        {
            label: "ODS",
            value: recognition.ods.map((item) => item.name).join(", "),
        },
        {
            label: "Estado",
            value: recognition.status === 1 ? "Vigente" : "No Vigente",
        },
        { label: "Contacto", value: recognition.contact },
        { label: "Ir al sitio", name: "link", value: recognition.link },
        {
            label: "Archivo",
            name: "file_path",
            value: recognition.file_path,
        },
        { label: "Creación del registro", value: recognition.created_at },
        { label: "Otros", value: recognition.others },
    ];

    const formatDate = (date) => {
        const parsedDate = new Date(date);
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth() + 1;
        const year = parsedDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatField = (field) => {
        if (
            field.label === "Fecha de Inicio" ||
            field.label === "Fecha de Fin" ||
            field.label === "Creación del registro"
        ) {
            return formatDate(field.value);
        } else {
            return field.value;
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/recognitions/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Registro Eliminado",
                            text: "Se elimino el registro",
                            icon: "success",
                        });
                    },
                    onError: () => {
                        return Swal.fire({
                            icon: "Error",
                            title: "Oops...",
                            text: "Algo salió mal",
                        });
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Informacion del Reconocimiento
                </h2>
            }
        >
            <Head title="Registro Reconocimientos" />
            <div className="py-6 mx-3">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {recognitionsField.map((field, i) => (
                            <div key={i}>
                                <h2 className="text-lg font-medium text-gray-900">
                                    {field.label}
                                </h2>
                                {field.name === "file_path" && (
                                    <p className="mt-1 text-sm text-gray-600">
                                        <a
                                            href={field.value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500"
                                        >
                                            Descargar
                                        </a>
                                    </p>
                                )}
                                {field.name === "link" ? (
                                    <a
                                        href={field.value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 text-sm text-blue-500"
                                    >
                                        {field.label}
                                    </a>
                                ) : Array.isArray(field.value) ? (
                                    <ul className="mt-1 text-sm text-gray-600">
                                        {field.value.map((item) => (
                                            <li key={item.id}>
                                                {item.name || item.description}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    field.name !== "file_path" && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            {formatField(field)}
                                        </p>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                    {auth.user.role_id == 1&& (
                        <button
                            onClick={() => handleDelete(recognition.id)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
