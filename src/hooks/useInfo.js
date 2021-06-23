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
    return {getMemberInfoState}
}