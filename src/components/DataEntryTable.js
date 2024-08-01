import React, { useState, useCallback } from 'react';
import { Table, Form, Button } from 'react-bootstrap';

const DataEntryTable = () => {
    const initialData = [
        { id: 1, item: 'Accounting Standard', value2021: 'IFRS', value2022: 'IFRS', value2024: 'IFRS', isEditable: false, isStaticVal: true },
        { id: 2, item: 'Audit method', value2021: 'IFRS 16 adj', value2022: 'IFRS 16 adj', value2024: 'IFRS 16 adj', isEditable: false, isStaticVal: true },
        { id: 3, item: 'Display Currency', value2021: 'HKD', value2022: 'HKD', value2024: 'HKD', isEditable: false, isStaticVal: true },
        { id: 4, item: 'Fix Rate', value2021: 0.12826, value2022: 0.12826, value2024: 0.12826, isEditable: true },
        { id: 5, item: 'Revenue', value2021: null, value2022: null, value2024: null, isEditable: false, isStaticVal: true },
        { id: 6, item: 'Passenger', value2021: 4357.00, value2022: 14333.0, value2024: 15213.0, isEditable: true },
        { id: 7, item: 'Cargo', value2021: 35814.00, value2022: 30554.0, value2024: 29312.0, isEditable: true },
        { id: 8, item: 'Other', value2021: null, value2022: null, value2024: null, isEditable: false, isStaticVal: true },
        { id: 9, item: 'Catering ...', value2021: 5416, value2022: 6149, value2024: 5236.0, isEditable: true },
    ];

    const [data, setData] = useState(initialData);

    const addRow = useCallback(() => {
        const newRow = {
            id: data.length + 1,
            item: `Other child ${data.length + 1}`,
            value2021: null,
            value2022: null,
            value2024: 0,
            isEditable: true,
            isStaticVal: false,
        };
        setData((prevData) => [...prevData, newRow]);
    }, [data.length]);

    const handleValueChange = useCallback((id, value, year) => {
        setData((prevData) =>
            prevData.map((row) =>
                row.id === id ? { ...row, [year]: parseFloat(value) || null } : row
            )
        );
    }, []);

    const calculateVariance = useCallback((value2024, value2022) => {
        return typeof value2024 === 'number' && typeof value2022 === 'number'
            ? value2024 - value2022
            : null;
    }, []);

    const calculateVariancePercentage = useCallback((variance, value2022) => {
        return typeof variance === 'number' && typeof value2022 === 'number'
            ? `${((variance / value2022) * 100).toFixed(1)}%`
            : null;
    }, []);

    const calculateTotal = useCallback(
        (key) =>
            data.reduce((acc, row) => {
                return typeof row[key] === 'number' ? acc + row[key] : acc;
            }, 0),
        [data]
    );

    const totalValue2021 = calculateTotal('value2021');
    const totalValue2022 = calculateTotal('value2022');
    const totalValue2024 = calculateTotal('value2024');
    const totalVariance = totalValue2024 - totalValue2022;
    const totalVariancePercentage = totalValue2022 ? (totalVariance / totalValue2022) * 100 : 0;

    return (
        <div className="container mt-5">
            <h3>Data Entry Interface</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Million</th>
                        <th>31-12-2021</th>
                        <th>31-12-2022</th>
                        <th>31-12-2024</th>
                        <th>Variance</th>
                        <th>Variance %</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => {
                        const variance = calculateVariance(row.value2024, row.value2022);
                        const variancePercentage = calculateVariancePercentage(variance, row.value2022);
                        return (
                            <tr key={row.id}>
                                <td>
                                    {row.item}
                                    {row.item === 'Other' && (
                                        <Button onClick={addRow} className="m-2">
                                            +
                                        </Button>
                                    )}
                                </td>
                                <td>{row.value2021}</td>
                                <td>{row.value2022}</td>
                                <td>
                                    {row.isStaticVal ? (
                                        row.value2024
                                    ) : (
                                        <Form.Control
                                            type="number"
                                            readOnly={!row.isEditable}
                                            disabled={!row.isEditable}
                                            value={row.value2024}
                                            className="form-control bg-white"
                                            onChange={(e) => handleValueChange(row.id, e.target.value, 'value2024')}
                                        />
                                    )}
                                </td>
                                <td>{variance}</td>
                                <td>{variancePercentage}</td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td>Total</td>
                        <td>{totalValue2021.toFixed(2)}</td>
                        <td>{totalValue2022.toFixed(2)}</td>
                        <td>{totalValue2024.toFixed(2)}</td>
                        <td>{totalVariance.toFixed(2)}</td>
                        <td>{totalVariancePercentage.toFixed(1)}%</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

export default DataEntryTable;
