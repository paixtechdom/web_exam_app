export interface alertInterface {
    showAlert: boolean
    alertType: string,
    alertMessage: string,
}

export interface NavigationInterface{

    showSideNav: boolean,
    currentNav: number,
    currentDropDown: number,
    showTopNav: boolean,
} 


export interface studentInfoInterface {
    firstName: string,
    middleName: string,
    lastName: string,
    id: string,
    matricNumber: string,
    level: string,
    department: string,
    faculty: string
}



export interface AdminResultTableInterface {
    id: number; // depending on your keyField
    index: number;
    studentName: string;
    score: number;
    timeUsed: number; // assuming it's in seconds or milliseconds
    date: string;     // or Date, depending on your data format
    examKey:string
    examTitle:string
    studentId:string
    totalScore:number
}   