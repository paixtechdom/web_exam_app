// import { useNavigate } from 'react-router'
import  DataTable, {TableColumn}  from 'react-data-table-component'
import { FC } from 'react'
import { FormatTime } from '../../../../assets/Functions'
import { AdminResultTableInterface } from '../../../../assets/Interfaces';


interface ResultsTableProps {
  data: AdminResultTableInterface[];
  currentPage?: number;
}

export const ResultsTable:FC<ResultsTableProps> = ({data, currentPage=1}) => {
    

    const columns: TableColumn<AdminResultTableInterface>[] = [
        {
            id: '#',
            name: <p className="font-bold text-sm">#</p>,
            selector: row => row.index || 0,
            sortable: false,
            cell: (row, index) => <div><span className="hidden">{row.index}</span>
                {(index + 1 + currentPage * 10) - 10}</div>,
            width: 7+'%',
        },
        {
            id: 'studentName',
            name:  <p className="font-bold text-sm">Student</p>,
            sortable: true,
            selector: row => row.studentName
        },
        {
            id: 'score',
            name:  <p className="font-bold text-sm">Score</p>,
            sortable: true,
            selector: row => row.score,
        },
        {
            id: 'timeUsed',
            name:  <p className="font-bold text-sm">Time Used</p>,
            sortable: true,
            selector: row => FormatTime(row.timeUsed),
        },
        {
            id: 'Date',
            name:  <p className="font-bold text-sm">Date</p>,
            sortable: true,
            selector: row => row.date
        },
    ] 
    const sortIcon = <i className="bi bi-chevron-down text-3xl ml-1"></i>


    return(
        <DataTable 
            title='Orders'
            data={data}
            sortIcon={sortIcon}
            columns={columns}
            highlightOnHover
            pointerOnHover
            noHeader
            striped
            keyField="id"
        />
    )
}






// import DataTable, { TableColumn } from 'react-data-table-component';
// import { useState } from 'react';
// import { FormatTime } from '../../../../assets/Functions';

// // 1. Define the shape of each row in the data table
// interface ResultRow {
//   id: string | number; // depending on your keyField
//   index?: number;
//   studentName: string;
//   score: number;
//   timeUsed: number; // assuming it's in seconds or milliseconds
//   date: string;     // or Date, depending on your data format
// }

// // 2. Define the component props
// interface ResultsTableProps {
//   data: ResultRow[];
//   currentPage?: number;
// }

// // 3. Main component
// export const ResultsTable: React.FC<ResultsTableProps> = ({ data, currentPage = 1 }) => {
//   const [loading, setLoading] = useState(false);

//   // 4. Define columns with proper typing
//   const columns: TableColumn<ResultRow>[] = [
//     {
//       id: '#',
//       name: <p className="font-bold text-sm">#</p>,
//       selector: row => row.index || 0,
//       sortable: false,
//       cell: (row, index) => <div>{(index + 1 + currentPage * 10) - 10}</div>,
//       width: '7%',
//     },
//     {
//       id: 'studentName',
//       name: <p className="font-bold text-sm">Student</p>,
//       selector: row => row.studentName,
//       sortable: true,
//     },
//     {
//       id: 'score',
//       name: <p className="font-bold text-sm">Score</p>,
//       selector: row => row.score,
//       sortable: true,
//     },
//     {
//       id: 'timeUsed',
//       name: <p className="font-bold text-sm">Time Used</p>,
//       selector: row => row.timeUsed,
//       sortable: true,
//       cell: row => <div>{FormatTime(row.timeUsed)}</div>,
//     },
//     {
//       id: 'date',
//       name: <p className="font-bold text-sm">Date</p>,
//       selector: row => row.date,
//       sortable: true,
//     },
//   ];

//   const sortIcon = <i className="bi bi-chevron-down text-3xl ml-1"></i>;

//   return (
//     <DataTable
//       title="Orders"
//       data={data}
//       columns={columns}
//       sortIcon={sortIcon}
//       highlightOnHover
//       pointerOnHover
//       noHeader
//       striped
//       keyField="id"
//       progressPending={loading}
//     />
//   );
// };
