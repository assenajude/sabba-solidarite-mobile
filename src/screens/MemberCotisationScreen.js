import React, {useEffect, useRef} from 'react';
import {ScrollView, View,FlatList, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import {initYears} from '../utilities/years'
import {initMonth} from '../utilities/months'
import YearItem from "../components/cotisation/YearItem";
import MonthItem from "../components/cotisation/MonthItem";
import ListItemSeparator from "../components/ListItemSeparator";
import useCotisation from "../hooks/useCotisation";
import AppAddNewButton from "../components/AppAddNewButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";
import {getCotisationDetails, getMonthDetails, getYearSelected, populateTimeData} from "../store/slices/memberSlice";


function MemberCotisationScreen({route, navigation}) {
    const dispatch = useDispatch()
    const selectedMember = route.params
    const scrollRef = useRef()
    const {getMonthTotal} = useCotisation()

    const selectedMonthCotisations = useSelector(state => state.entities.member.selectedMonthCotisations)
    const isLoading = useSelector(state => state.entities.member.loading)

    const allYears = useSelector(state => state.entities.member.years)
    const allMonths = useSelector(state => state.entities.member.months)


    const handleSelectYear = (year) => {
        dispatch(getYearSelected({...year, memberId: selectedMember.member.id}))
    }

    const handleMonthDetail = (month) => {
        dispatch(getMonthDetails(month))
    }

    const initSelectYear = () => {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentYearData = {
            year: currentYear,
            selected: false,
            memberId: selectedMember.member.id
        }
        dispatch(getYearSelected(currentYearData))
    }
    setTimeout(() => {
        scrollRef.current?.scrollToEnd()
    }, 500)


    const handleCotisationDetails = (cotisation) => {
        dispatch(getCotisationDetails(cotisation))
    }

    const populateData = () => {
        let startData = initYears
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const isYearPresent = initYears.some(item => item.year === currentYear)
        if(!isYearPresent) {
            const newYear = {
                year: currentYear,
                selected: false
            }
            startData.push(newYear)
        }
        dispatch(populateTimeData({years: startData, months: initMonth}))

    }

    useEffect(() => {
        populateData()
        const unsubscribe = navigation.addListener('focus', () => {
            initSelectYear()
        })
        return unsubscribe
    }, [navigation])


    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <View style={{
                marginBottom: 20,
                marginTop: 20
            }}>
            {allYears.length>0 && <ScrollView ref={scrollRef}  horizontal>
                {allYears.map((item) =>
                    <YearItem key={item.year.toString()}
                              year={item.year} isSelected={item.selected}
                              selectYear={()=>handleSelectYear(item)}/>
                              )}
            </ScrollView>}
            </View>

            <FlatList data={allMonths}
                      ItemSeparatorComponent={ListItemSeparator}
                      keyExtractor={item => item.label}
                      renderItem={({item}) =>
                          <MonthItem month={item.label}
                                     getCotisationDetails={handleCotisationDetails}
                                     monthTotal={getMonthTotal(item)}
                                     showMonthDetail={item.showDetail}
                                     showMonthItemDetail={() => handleMonthDetail(item)}
                                     monthCotisations={selectedMonthCotisations}/>}
            />

        </>
    );
}

const styles = StyleSheet.create({
    newCotisation: {
        position: 'absolute',
        right: 20,
        bottom: 30
    }
})
export default MemberCotisationScreen;