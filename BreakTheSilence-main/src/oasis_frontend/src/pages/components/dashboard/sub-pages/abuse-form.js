import React, { useContext, useEffect, useRef, useState } from 'react';
import { DatePicker, Tooltip, Select, Checkbox, Empty, Button, Result, ConfigProvider } from 'antd';
import { AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai'
import { CheckCircleFilled } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import { GlobalContext } from '../../../../context/global-context';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { oasis_backend } from '../../../../../../declarations/oasis_backend';
import { getRandomInt } from '../../../../functions/fn';
const { RangePicker } = DatePicker;
const AbuseForm = () => {
    const { Aside, PageTitle, message, Storage } = useContext(GlobalContext);
    const isMounted = useRef(false);
    const [pageSection, updatePageSection] = useState(false);
    const [fileString, setFileString] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [days, setdays] = useState('');
    const [daysPeriod, setdaysPeriod] = useState('');
    const [witnessName, setWitnessName] = useState('');
    const [witnessNo, setWitnessNo] = useState('');
    const [description, setDescription] = useState('');
    const [addInfo, setAddInfo] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [policyAgreed, setPolicyAgreed] = useState(false);
    const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);


    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            Aside.update("abuse-form");
            PageTitle.set('Submit your Statement');
            if (localStorage.auth) {
                var ld = JSON.parse(localStorage.auth);
                if (Object.keys(ld.userInfo.userData).length > 0) {
                    updatePageSection("form");
                } else {
                    updatePageSection("personalInfoRequired");
                }
            }
        }
    }, []);
    useEffect(() => {
        if (termsAgreed && policyAgreed) {
            setSubmitBtnDisabled(false);
        } else {
            setSubmitBtnDisabled(true);
        }
    }, [termsAgreed, policyAgreed])
    useEffect(() => {
        if (fileString !== false) {
            console.log(fileString);
        }
    }, [fileString])
    const formatDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD');
    }
    const handleDateChange = (e) => {
        e.map((date, index) => {
            if (index === 0) {
                setdays(formatDate(date));
            } else {
                setdaysPeriod(formatDate(date));
            }
        })
    }
    const handleElement = async (e) => {
        e.preventDefault()
        if (submitBtnDisabled) {
            message.error('You must agree to the terms and policy to submit a new statement!');
            return;
        }
        //VALIDATE
        if (name === "" || type === "" || location === "" || days === "" || daysPeriod === "" || description === "") {
            message.error("Please fill all the details..", 5);
            return;
        }
        if (fileString === false) {
            setFileString([]);
        }
        var fdata = {
            id: getRandomInt(111111, 999999),
            name: name,
            type: type,
            location: location,
            days: days,
            daysPeriod: daysPeriod,
            witnessName: witnessName,
            witnessNo: witnessNo,
            description: description,
            addInfo: addInfo,
            evidences: fileString,
            status: "pending"
        }
        // console.log(JSON.stringify(data));
        //get user's previous abuse reports from backend
        var userData = oasis_backend.getUser(Storage.user.get.phone);
        message.loading("Processing request...", 120);
        userData.then(data => {
            data.forEach((value, index) => {
                delete value.id;
                delete value.userData;
                delete value.phone;
                delete value.token;
                //check if user has already reported an abuse case
                if (value.reportedAbuseCases.length > 0) {
                    //user has reported abuse cases
                    var reportedAbuseCases = JSON.parse(value.reportedAbuseCases);
                    //check if user has already reported this abuse case
                    var alreadyReported = false;

                    if (alreadyReported) {
                        message.error('You have already reported this abuse case!');
                        return;
                    } else {
                        //user has not reported this abuse case
                        // delete data.id;
                        data.id = Number(data.id);
                        reportedAbuseCases.push(fdata);
                        console.table(reportedAbuseCases);
                        console.table(data);
                        var resp = oasis_backend.updateReportedAbuseCases(Storage.user.get.phone, JSON.stringify(reportedAbuseCases));
                        resp.then(data => {
                            data = JSON.parse(data);
                            message.destroy();
                            if (data.status == 200) {
                                // message.success('Abuse case reported successfully!');
                                updatePageSection('upload-success');
                            } else {
                                message.error('Failed to report abuse case!');
                            }
                        })
                    }
                } else {
                    //user has not reported any abuse cases
                    var reportedAbuseCases = [];
                    reportedAbuseCases.push(fdata);
                    var resp = oasis_backend.updateReportedAbuseCases(Storage.user.get.phone, JSON.stringify(reportedAbuseCases));
                    resp.then(data => {
                        data = JSON.parse(data);
                        if (data.status == 200) {
                            message.success('Abuse case reported successfully!');
                        } else {
                            message.error('Failed to report abuse case!');
                        }
                    })
                }
            })
        })

    }
    const abuseTypes = [
        {
            value: 'physical',
            label: 'Physical',
        },
        {
            value: 'sexual',
            label: 'Sexual',
        },
    ]

    // generate days array 1-100 without 0 
    const days_array = [
        ...Array(100).keys()
    ].map(i => i + 1);
    
    const days100 = days_array.map((day) => {
        return {
            value: day,
            label: day,
        }
    })

    const handleFileChange = (e) => {
        setFileString(false);
        //get  multiple image files and convert them to base64 string and set it to state as object {filename: imgName, file: base64String, type: imgType}
        var files = e.target.files;
        var fileArr = [];
        //max 5 files
        if (files.length > 5) {
            message.error('Maximum 5 files are allowed');
            //clear file input
            e.target.value = null;
            return;
        }

        for (var i = 0; i < files.length; i++) {
            //check if file is image
            if (!files[i].type.includes('image')) {
                message.error('Only image files are allowed');
                //clear file input
                e.target.value = null;
                return;
            }
            //check if file size is greater than 3mb
            if (files[i].size > 1000000) {
                message.error('Each file size should be less than 1mb');
                //clear file input
                e.target.value = null;
                return;
            }
            var file = files[i];
            var reader = new FileReader();
            reader.onload = (e) => {
                var fileObj = {
                    filename: file.name,
                    file: e.target.result,
                    type: file.type
                }
                fileArr.push(fileObj);
                setFileString(fileArr);
            }
            reader.readAsDataURL(file);
        }
    };
    return (
        <>
            {pageSection == false && <>Loading...</>

                || pageSection == "form" && <>
                    <div className='ml-8'>
                        <div className='flex flex-col'>
                            <div className='flex items-center gap-2 border-b-[1.5px] border-[#fff] w-fit border-spacing-2'>
                                <svg className="mt-1" width="28" height="13" viewBox="0 0 37 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.3717 0C-6.98563 0 -2.11412 22 9.29322 22C11.5792 22 13.7316 20.8146 15.1037 18.7997L16.5779 16.6346C17.475 15.3175 19.2688 15.3175 20.166 16.6346L21.6401 18.7997C23.0117 20.8146 25.1642 22 27.4501 22C38.3275 22 44.1008 0 18.3717 0ZM10.5416 13.9998C8.18921 13.9998 6.65952 12.5297 5.95369 11.648C5.65405 11.2739 5.65405 10.7261 5.95369 10.3515C6.65952 9.46917 8.18864 7.99964 10.5416 7.99964C12.8946 7.99964 14.4237 9.46974 15.1295 10.3515C15.4292 10.7256 15.4292 11.2733 15.1295 11.648C14.4237 12.5303 12.894 13.9998 10.5416 13.9998ZM26.1249 13.9998C23.7725 13.9998 22.2429 12.5297 21.537 11.648C21.2374 11.2739 21.2374 10.7261 21.537 10.3515C22.2429 9.46917 23.772 7.99964 26.1249 7.99964C28.4779 7.99964 30.007 9.46974 30.7129 10.3515C31.0125 10.7256 31.0125 11.2733 30.7129 11.648C30.007 12.5303 28.4773 13.9998 26.1249 13.9998Z" fill="#fff" />
                                </svg>
                                Incident Info
                            </div>
                        </div>
                        <form onSubmit={handleElement} className='my-10'>
                            <div className='flex flex-col gap-10'>
                                <div className='flex items-center gap-10 w-[80%]'>
                                    <div className='flex flex-col gap-3 w-[100%]'>
                                        <div className='font-semibold'>Name of Abuser</div>
                                        <input value={name} onChange={e => setName(e.target.value)} name='name' placeholder="Enter abuser's name" className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2' />
                                    </div>
                                    <div className='flex flex-col gap-3 w-[100%]'>
                                        <div className='font-semibold'>Type of Abuse</div>
                                        <Select
                                            name='type'
                                            placeholder="Choose the abuse type"
                                            options={abuseTypes}
                                            size='large'
                                            value={type || null}
                                            onChange={e => setType(e)}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3 w-[80%]'>
                                    <div className='font-semibold'>Location of incident</div>
                                    <input value={location} onChange={e => setLocation(e.target.value)} name='location' placeholder='Enter location of incident' className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2' />
                                </div>
                                <div className='flex flex-col gap-3 w-[80%]'>
                                    <div className='flex items-center gap-2 font-semibold'>Abuse Period
                                        <Tooltip name='date' placement='rightBottom' title='Approximate'><AiOutlineInfoCircle className='cursor-pointer mt-1 text-lg' /></Tooltip>
                                    </div>
                                    <div className='flex gap-3 items-center w-full'>
                                        <Select
                                            name='days'
                                            placeholder="Select abuse period"
                                            options={days100}
                                            size='large'
                                            value={days || null}
                                            onChange={e => setdays(e)}
                                            className='w-[75%]'
                                            virtual={true}
                                            showSearch={true}
                                        />
                                        <Select
                                            name='type'
                                            placeholder="Days | Weeks | Months | Years"
                                            options={[
                                                {
                                                    value: 'days',
                                                    label: 'Days',
                                                },
                                                {
                                                    value: 'weeks',
                                                    label: 'Weeks',
                                                },
                                                {
                                                    value: 'months',
                                                    label: 'Months',
                                                },
                                                {
                                                    value: 'years',
                                                    label: 'Years',
                                                },
                                            ]}
                                            size='large'
                                            value={daysPeriod || null}
                                            onChange={e => setdaysPeriod(e)}
                                            className='w-[25%]'
                                        />
                                    </div>
                                    {/* <RangePicker onChange={handleDateChange} className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2 resize-none' /> */}
                                </div>
                                <div className='flex items-center gap-10 w-[80%]'>
                                    <div className='flex flex-col gap-3 w-[100%]'>
                                        <div className='font-semibold'>Witness Name (optional)</div>
                                        <input value={witnessName} onChange={e => setWitnessName(e.target.value)} name='witnessName' placeholder="Enter Witness' name" className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2' />
                                    </div>
                                    <div className='flex flex-col gap-3 w-[100%]'>
                                        <div className='font-semibold'>Witness Phone number (optional)</div>
                                        <input value={witnessNo} onChange={e => setWitnessNo(e.target.value)} placeholder="Enter Witness' Phone number" className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3 w-[80%]'>
                                    <div className='font-semibold'>Detailed description of incident</div>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} name='description' placeholder='Let us know what you were forced to go through' rows={6} className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2 resize-none' />
                                </div>
                                <div className='flex flex-col gap-3 w-[80%]'>
                                    <div className='font-semibold'>Supporting Evidence (optional)</div>
                                    <input onChange={handleFileChange} name='evidences' accept='image/png, image/jpeg, image/jpg, image/webp' type='file' placeholder='Upload Evidence' className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2' />
                                    <p className='text-[12px] text-[#fe570b]'>Supported file types: <span className='uppercase'>png, jpg, jpeg, webp</span> (Max 1 MB)</p>
                                </div>
                                <div className='flex flex-col gap-3 w-[80%]'>
                                    <div className='font-semibold'>Additional Information or Comments</div>
                                    <input value={addInfo} onChange={e => setAddInfo(e.target.value)} name='addInfo' placeholder='If you like to add anything more...' className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2' />
                                </div>
                                <div name='legals' className='flex flex-col gap-3 w-[80%]'>
                                    <div className='font-semibold'>Consent and Legal Disclaimer</div>
                                    <Checkbox onChange={e => setTermsAgreed(e.target.checked)}>I hereby declare that all information provided is true and accurate to the best of my knowledge.</Checkbox>
                                    <Checkbox onChange={e => setPolicyAgreed(e.target.checked)}>I understand that sharing fake information will result in legal repercussions, including but not limited to fines, penalties, or civil liabilities, depending on the jurisdiction and severity of the misinformation.</Checkbox>
                                </div>
                            </div>
                            <div className='w-[80%] flex justify-end'>
                                {submitBtnDisabled == true && <Tooltip title={'You must agree to the terms and policy to submit a new statement!'}><button disabled={submitBtnDisabled} type='submit' className='bg-[#fe570b] disabled:bg-[#fe570be9] disabled:cursor-not-allowed text-white  font-semibold rounded-md my-10 px-4 py-2'>
                                    Submit
                                </button></Tooltip>
                                    || !submitBtnDisabled &&
                                    <button disabled={submitBtnDisabled} type='submit' className='bg-[#fe570b] disabled:bg-[#fe570be9] disabled:cursor-not-allowed text-white  font-semibold rounded-md my-10 px-4 py-2'>
                                        Submit
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                </>

                || pageSection == "personalInfoRequired" && <>
                    <div className='h-[40dvh] flex items-center justify-center'>
                        <Empty

                            description={
                                <span>
                                    Please fill in your personal details before submitting your Statement...
                                </span>
                            }
                        >
                            <Link to="/dashboard"><button type="submit" class="bg-[#fe570b] text-white font-semibold rounded-md py-2 px-4 uppercase">UPDATE personal INFO</button></Link>
                        </Empty>
                    </div>
                </>
                || pageSection == "upload-success" && <>
                    <div className='h-[40dvh] flex items-center justify-center'>
                        <Result
                            status={'success'}
                            title={'Your Statement has been submitted successfully!'}
                            subTitle={'Your voice matters. Thank you for taking a bold step towards ending the cycle of abuse. We will get back to you soon. Stay strong!'}
                            icon={<CheckCircleFilled className='text-[#0f1629]' />}
                            extra={[
                                <>
                                    <Link to='/dashboard'>
                                        <button className='px-4 bg-[#fe570b] text-white py-2 rounded-lg'>Go to Dashboard</button>
                                    </Link>
                                    <Link to='/dashboard/reported-cases'><button className='py-2 ml-4 px-4 hover:border-[#fe570b] text-white border-2 rounded-lg duration-300 ease-in-out' key="buy">View your reported cases</button></Link>
                                </>]}
                        />
                    </div>
                </>
            }
        </>
    )
}

export default AbuseForm;