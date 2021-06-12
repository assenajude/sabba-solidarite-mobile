import {useSelector} from "react-redux";

let useTransaction;
export default useTransaction = () => {
    const listReseau = useSelector(state => state.entities.transaction.reseauList)

    const getReseau = (name) => {
        let selectedReseau = {}
        selectedReseau = listReseau.find(item => item.name.toLowerCase() === name.toLowerCase())
        return selectedReseau
    }

    return {getReseau}
}