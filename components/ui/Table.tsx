import React from 'react';

interface Column<T> {
    header: string;
    accessor: (item: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
}

export function Table<T>({ data, columns, keyExtractor }: TableProps<T>) {
    if (!data || data.length === 0) {
        return <div className="p-4 text-center text-gray-500">No data available</div>;
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th
                                            key={idx}
                                            scope="col"
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                                        >
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item) => (
                                    <tr key={keyExtractor(item)}>
                                        {columns.map((col, idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {col.accessor(item)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
