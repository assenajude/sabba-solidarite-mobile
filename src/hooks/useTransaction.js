import {useSelector} from "react-redux";
import useAuth from "./useAuth";

let useTransaction;
export default useTransaction = () => {
    const {dataSorter} = useAuth()

    const listReseau = useSelector(state => state.entities.transaction.reseauList)
    const retraitTransactions = useSelector(state => {
        const listTransactions = state.entities.transaction.list
        const retraitList = listTransactions.filter(transac => transac.typeTransac === 'retrait')
        return retraitList
    })

    const getReseau = (name) => {
        let selectedReseau = {}
        selectedReseau = listReseau.find(item => item.name.toLowerCase() === name.toLowerCase())
        return selectedReseau
    }

    const getRetraitRecentNumber = (reseau) => {
        let selectedTransactions = retraitTransactions.filter(transact => transact.reseau === reseau)
        const sortedList = dataSorter(selectedTransactions)
        const numbers = sortedList.map(trans => trans.numero)
        const finalResult = [...new Set(numbers)]
        return finalResult
    }

    return {getReseau, getRetraitRecentNumber}
}