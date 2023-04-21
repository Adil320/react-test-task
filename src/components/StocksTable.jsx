import React, { useState, useEffect } from 'react';

import { Alert, Table } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import axios from 'axios';

export default function StocksTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    
    const fetchData = async () => {
      const response = await axios('https://api.iex.cloud/v1/data/CORE/INTRADAY_PRICES/JPM?token=sk_f7ed5fa24ee243c197734a244d868d1a');

      if(response.status === 200){
        setData(response.data);
      } else {
        Alert('Ошибка на сервере');
      }
      
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  function goToPage(value) {
    setCurrentPage(value);
  }

  const renderTableHeaderItems = () => {
     return  data[0] && Object.keys(data[0]).map((key, index) => (
        <th key={key + index}>{key}</th>
    ))
  }
  const renderData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end).map((item,index) => (
        <tr key={`${item.date}-${item.minute}-${index}`}>
          <td>{start + index+1}</td>
          <td>{item.date}</td>
          <td>{item.minute}</td>
          <td>{item.label}</td>
          <td>{item.high}</td>
          <td>{item.low}</td>
          <td>{item.open}</td>
          <td>{item.close}</td>
          <td>{item.average}</td>
          <td>{item.volume}</td>
          <td>{item.notional}</td>
          <td>{item.numberOfTrades}</td>
        </tr>
    ));
  };

  return (
    <div  className='container'>
      <div className="mt-3">
        <h3>Всего {data.length}</h3>
      </div>
      <div className="mt-5 mb-5">
        <Table striped bordered hover size="sm">
      <thead>
        <tr className="text-center">
        <th>№</th>
          {renderTableHeaderItems()}
        </tr>
      </thead>
      <tbody className="text-center">
          {renderData()}
      </tbody>
        </Table>
        <Pagination
          itemClass="page-item"
          linkClass="page-link"
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalPages * 10}
          pageRangeDisplayed={5}
          onChange={goToPage}
          onClick={goToPage}
        />
        </div>
    </div>
  );
}

