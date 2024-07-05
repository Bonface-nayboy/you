// MyComponent.js

import React, { useState, useEffect } from 'react';
import Pagination from './pagination'; // Assuming Pagination.js is in the same directory

const MyComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]); // Replace with your data state
    const [totalPages, setTotalPages] = useState(1); // Replace with total pages from API or calculated

    // Simulated data fetching function (replace with your actual data fetching logic)
    const fetchData = async () => {
        // Example API call
        // const response = await fetch(`https://api.example.com/data?page=${currentPage}`);
        // const result = await response.json();
        // setData(result.data);
        // setTotalPages(result.totalPages);

        // Simulated data for demonstration
        const dataPerPage = 5; // Items per page
        const start = (currentPage - 1) * dataPerPage;
        const newData = Array.from({ length: dataPerPage }, (_, index) => ({
            id: start + index + 1,
            name: `Item ${start + index + 1}`
        }));
        setData(newData);
        setTotalPages(Math.ceil(20 / dataPerPage)); // Assuming 20 total items for demonstration
    };

    useEffect(() => {
        fetchData(); // Fetch data when currentPage changes
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update currentPage state
    };

    return (
        <div>
            <h1>MyComponent</h1>
            <ul>
                {/* Render your data here */}
                {data.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
            {/* Render pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default MyComponent;
