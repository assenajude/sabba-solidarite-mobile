import {useSelector} from "react-redux";

let useInfo
export default useInfo = () => {
    const memberInfos = useSelector(state => state.entities.member.memberInfos)

    const getMemberInfoState = (info) => {
        let selected;
        if (info) {
        selected = memberInfos.find(item => item.id === info.id)
        }
        return selected?.member_info.isRead || false
    }

    const getMemberInfoPerso = (member) => {
        let infoPerso = `Info M${member.id}`
        if(member.username) infoPerso = member.username
        else if(member.nom) infoPerso = member.nom
        return infoPerso
    }
    return {getMemberInfoState, getMemberInfoPerso}
}