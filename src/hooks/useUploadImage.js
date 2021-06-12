import React, {useState} from 'react'
import {useDispatch, useStore} from "react-redux";
import {getSignedUrl} from "../store/slices/uploadImageSlice";
import {create} from "apisauce";
import {Buffer} from "buffer";

let useUploadImage;
export default useUploadImage = () => {
    const dispatch = useDispatch()
    const store = useStore()

    const getFileNameAndType = (imageUrl) => {
        let fileType = ''
        const fileName = imageUrl.split('/').pop()
        const type = fileName.split('.').pop()
        if(type==='jpeg' || type==='jpg') fileType = 'image/jpeg'
        if(type === 'png') fileType = 'image/png'
        return {fileName,fileType}
    }

    const dataTransformer = (imagesDataArray) => {
        const urlArray = imagesDataArray.map(image => image.url)
        let newArray = []
        urlArray.forEach(url => {
            const {fileType, fileName} = getFileNameAndType(url)
            const modifiedData = {
                fileName,
                fileType
            }
            newArray.push(modifiedData)
        })
        return newArray
    }


    const directUpload = async (transformedArray, imagesArray, getUploadProgress) => {
        const base64DataArray = imagesArray.map(image => image.imageData)
        await dispatch(getSignedUrl({dataArray: transformedArray}))
        const signedArray = store.getState().uploadImage.signedRequestArray
        let uploadSuccess = false
        if(signedArray.length>0 && base64DataArray.length>0){
            for(let i=0; i<base64DataArray.length; i++) {
                const {fileType} = getFileNameAndType(imagesArray[i].url)
                const byApiSauce = create({
                    baseURL: signedArray[i].signedUrl
                })


                const bufferData = new Buffer(base64DataArray[i], 'base64')

                const result  = await  byApiSauce.put('',bufferData, {
                    headers: {
                        'x-amz-acl' : 'public-read',
                        'Content-Encoding': 'base64',
                        'Content-Type': fileType
                    },
                    onUploadProgress: (progress) => getUploadProgress(progress.loaded/progress.total*100)

                })
                if(result.ok) uploadSuccess = true
                else {
                    throw new Error(`error: ${result.data}`)
                    uploadSuccess = false
                }

            }
        }
        if(uploadSuccess) {
            alert('upload success..')
        } else {
            alert("can't upload now..try later")
        }
        return uploadSuccess
    }

    return {dataTransformer,directUpload}
}