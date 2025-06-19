import  DataTable, { TableColumn }  from 'react-data-table-component'
import { FormatTime } from '../../../assets/Functions'
import { AdminResultTableInterface } from '../../../assets/Interfaces'



interface ResultsTableProps {
    data: AdminResultTableInterface[];
    currentPage: number;
    loading: boolean
  }


export const StudentReportTable = ({data, currentPage, loading}: ResultsTableProps) => {

    
    // const navigate = useNavigate()

    

    const columns: TableColumn<AdminResultTableInterface>[]  = [
        {
            id: '#',
            name: <p className="font-bold text-sm">#</p>,
            selector: row => row.index,
            sortable: false,
            cell: (_, index) => <div>{(index + 1 + currentPage * 10) - 10}</div>,
            width: 7+'%',
        },
        {
            id: 'examTitle',
            name:  <p className="font-bold text-sm">Exam</p>,
            sortable: true,
            selector: row => row.examTitle,
        },
        {
            id: 'score',
            name:  <p className="font-bold text-sm">Score</p>,
            sortable: true,
            selector: row => row.score,
        },
        {
            id: 'totalScore',
            name:  <p className="font-bold text-sm">Total Score</p>,
            sortable: true,
            selector: row => row.totalScore,
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
            // persistTableHead
            keyField="id"
            progressPending={loading}
            
            // paginationServer
            // pagination
            // paginationTotalRows={data.length}                    
            // paginationPerPage={1}
            

            // onChangePage={(page) => {
            //     setCurrentPage(page)
            // }}

            // onChangeRowsPerPage={(currentRowsPerPage) => setPerPage(currentRowsPerPage)}

        />
    )
}



