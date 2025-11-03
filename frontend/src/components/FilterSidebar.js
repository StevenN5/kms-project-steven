import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange, categories = [] }) => {
    const [filters, setFilters] = useState({
        category: {}, // TAMBAHKAN category filter
        kategori: {},
        departemen: {},
        tipe_dokumen: {},
        status: {},
        tahun: {}
    });

    const handleFilterChange = (category, value) => {
        const newFilters = {
            ...filters,
            [category]: {
                ...filters[category],
                [value]: !filters[category]?.[value]
            }
        };
        
        setFilters(newFilters);
        
        if (onFilterChange) {
            const activeFilters = {};
            Object.keys(newFilters).forEach(cat => {
                activeFilters[cat] = Object.keys(newFilters[cat]).filter(
                    item => newFilters[cat][item]
                );
            });
            onFilterChange(activeFilters);
        }
    };

    const resetFilters = () => {
    const resetState = {
        category: {},
        kategori: {},
        departemen: {},
        tipe_dokumen: {},
        status: {},
        tahun: {}
    };
    setFilters(resetState);
    if (onFilterChange) {
        // Pastikan mengirim state yang benar-benar kosong
        const emptyFilters = {
            category: [],
            kategori: [],
            departemen: [],
            tipe_dokumen: [],
            status: [],
            tahun: []
        };
        onFilterChange(emptyFilters);
    }
};

    const kmsSections = [
        // TAMBAHKAN category filter di paling atas
        {
            id: 'category',
            title: 'Kategori',
            type: 'simple',
            items: categories.length > 0 
                ? categories.map(cat => cat.name)
                : ['Loading categories...']
        },
        {
            id: 'kategori',
            title: 'Jenis Dokumen',
            type: 'simple',
            items: [
                'Prosedur Operasional',
                'Panduan Teknis', 
                'Kebijakan Perusahaan',
                'Laporan Tahunan',
                'Standar Kualitas',
                'Manual Pengguna'
            ]
        },
        {
            id: 'departemen',
            title: 'Departemen',
            type: 'nested',
            items: [
                {
                    label: 'Divisi Teknologi',
                    children: [
                        'IT Infrastructure',
                        'Software Development', 
                        'Network Security',
                        'Data Center',
                        'Cloud Services'
                    ]
                },
                {
                    label: 'Divisi Operasi',
                    children: [
                        'Power Generation',
                        'Transmission',
                        'Distribution',
                        'Maintenance',
                        'Grid Management'
                    ]
                },
                {
                    label: 'Divisi Bisnis',
                    children: [
                        'Customer Service',
                        'Billing & Collection',
                        'Business Development',
                        'Strategic Planning'
                    ]
                }
            ]
        },
        {
            id: 'tipe_dokumen',
            title: 'Tipe File',
            type: 'simple',
            items: [
                'PDF',
                'Word Document',
                'Excel Spreadsheet', 
                'PowerPoint Presentation',
                'Image Files',
                'Video Tutorial'
            ]
        },
        {
            id: 'status',
            title: 'Status',
            type: 'simple',
            items: [
                'Draft',
                'Review', 
                'Approved',
                'Published',
                'Archived'
            ]
        },
        {
            id: 'tahun',
            title: 'Tahun',
            type: 'simple', 
            items: [
                '2024',
                '2023',
                '2022',
                '2021', 
                '2020'
            ]
        }
    ];

    return (
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Filter Dokumen</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Saring dokumen berdasarkan kriteria
                </p>
            </div>

            {/* Filter Sections */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {kmsSections.map((section) => (
                    <div key={section.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {section.title}
                        </h3>

                        {section.type === 'simple' ? (
                            <div className="space-y-3">
                                {section.items.map((item) => (
                                    <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={filters[section.id]?.[item] || false}
                                            onChange={() => handleFilterChange(section.id, item)}
                                            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-cyan-700 transition-colors">
                                            {item}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {section.items.map((group, groupIndex) => (
                                    <div key={groupIndex}>
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">{group.label}</h4>
                                        <div className="space-y-2 ml-2">
                                            {group.children.map((item) => (
                                                <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters[section.id]?.[item] || false}
                                                        onChange={() => handleFilterChange(section.id, item)}
                                                        className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                                    />
                                                    <span className="text-sm text-gray-700 group-hover:text-cyan-700 transition-colors">
                                                        {item}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex space-x-3">
                    <button 
                        onClick={resetFilters}
                        className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Reset Filter
                    </button>
                    <button 
                        onClick={() => console.log('Applied filters:', filters)}
                        className="flex-1 px-4 py-2 text-sm text-white bg-cyan-600 border border-transparent rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;