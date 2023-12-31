import React, { useState } from 'react';
import { Empty, Spin, Table, Tag, message } from "antd";
import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../../context/global-context";
import PreLoader from '../../pre-loader';
import { oasis_backend } from '../../../../../../declarations/oasis_backend';
import BadgeComponent from '../../badge';

const ReportedCases = () => {
    const { Aside, PageTitle, Storage, ReportedCases } = useContext(GlobalContext);
    const isMounted = useRef(false);
    const [isContentLoading, setIsContentLoading] = useState(true);
    const [pageData, setPageData] = useState([]);
    const navigate = useNavigate();
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            var resp = oasis_backend.getUser(Storage.user.get.phone);
            resp.then(data => {
                data.forEach((value, index) => {
                    delete value.token;
                    delete value.id;
                    delete value.userData;
                    delete value.phone;
                    var reportedAbuseCases = JSON.parse(value.reportedAbuseCases); //array
                    reportedAbuseCases.forEach((value, index) => {
                        // remove value.evidences from the object then update the array
                        delete value.evidences;
                    });
                    setPageData(reportedAbuseCases);
                    resolve(true);
                })
            }).catch(err => {
                console.error(err);
                reject(false);
            })
        })
    }
    useEffect(() => {
        console.table(pageData);
        console.log(pageData);
    }, [pageData])
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            Aside.update("reported-cases");
            PageTitle.set('Reported Cases');
            fetchData().then(done => {
                if (done) {
                    setIsContentLoading(false);
                } else {
                    //retry another time
                    message.loading("Failed to load data. Retrying..", 30);
                    fetchData().then(done => {
                        message.destroy();
                        if (done) {
                            setIsContentLoading(false)
                        } else {
                            message.error("Failed to load data. Please try again later..", 5);
                        }
                    })
                }
            });
        }
    }, []);
    const dataSource = [
        ...pageData.map((value, index) => {
            return {
                key: index,
                name: value.name,
                abuse_type: <div className='capitalize'>{value.type}</div>,
                location: value.location,
                status: <BadgeComponent text={value.status} />,
                date: <>{value.days} {value.daysPeriod}</>,
                action: <button onClick={() => handleView(value.id)} className="px-3 py-2 rounded-md text-white duration-200 ease-in-out hover:text-[#f1f1f1] hover:bg-[#fe580be4] bg-[#fe570b]">View</button>,
            }
        })
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <>Abuse&nbsp;Type</>,
            dataIndex: 'abuse_type',
            key: 'abuse_type',
        },
        {
            title: <>Location</>,
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: <>Status</>,
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: <>Abuse Period</>,
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: <>Action</>,
            dataIndex: 'action',
            key: 'action',
        },
    ];

    const handleView = (id) => {
        ReportedCases.update({
            id: id,
            phone: Storage.user.get.phone,
        });
        navigate(`/dashboard/admin/view`);
    }

    return (
        <>
            {isContentLoading && <>
                <div className="flex items-center justify-center h-[70dvh]">
                    <PreLoader />
                </div>
            </>

                || <>
                    {pageData.length > 0 && <><div className="overflow-x-auto relative">
                        <Table dataSource={dataSource} columns={columns} />
                    </div></>
                        || <div className="flex items-center justify-center h-[70dvh]">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<div className='text-gray-400'>No reported cases yet.</div>} />
                        </div>}
                </>}
        </>
    )
}
export default ReportedCases;