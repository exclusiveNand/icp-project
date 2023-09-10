import React, { useState } from 'react';
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "../../../../context/global-context";
import { Popover, Result, Table, Tabs, Tag, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { oasis_backend } from '../../../../../../declarations/oasis_backend';
import BadgeComponent from '../../badge';
import { isAdmin } from '../../../../functions/fn';
import PreLoader from '../../pre-loader';
import { AiOutlineReload } from 'react-icons/ai';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: <>Abuse&nbsp;Type</>,
        dataIndex: 'abuse_type',
        key: 'type',
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


const filterArray = (array, key) => {
    return array.filter((value, index) => {
        return value.status == key;
    })
}
const AdminHome = () => {
    const { Aside, PageTitle, ReportedCases, Storage } = useContext(GlobalContext);
    const isMounted = useRef(false);
    const [defaultTab, setDefaultTab] = useState('pending');
    const [loadData, setLoadData] = useState([]);
    const navigate = useNavigate();
    const [viewPage, setViewPage] = useState(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            Aside.update('admin');
            PageTitle.set('Admin | Home');
            loadContent();
            const Interval = setInterval(() => {
                if (window.location.pathname != "/dashboard/admin") {
                    clearInterval(Interval);
                } else {
                    loadContent();
                }
            }, 5000);
        }
    }, []);
    function loadContent() {
        isAdmin(Storage.user.get.phone).then(admin => {
            if (admin) {
                var resp = oasis_backend.fetchAllUsers();
                var cases = [];
                resp.then(AllUsers => {
                    setLoadData([]);
                    AllUsers.forEach((User, index) => {
                        delete User.id;
                        delete User.token;
                        delete User.userData;
                        User.reportedAbuseCases = JSON.parse(User.reportedAbuseCases);
                        setViewPage('content');
                        if (User.reportedAbuseCases.length > 0) {
                            User.reportedAbuseCases.forEach((Case, index) => {
                                Case.phone = User.phone;
                                setLoadData((prev) => {
                                    return [...prev, Case];
                                })
                            })
                        }
                    })
                })
            } else {
                setViewPage('not-allowed');
            }
        })
    }

    useEffect(() => {
        console.log(loadData);
    }, [loadData]);

    const handleView = (id, phone) => {
        ReportedCases.update({
            id: id,
            phone: phone,
            adminView: true
        });
        navigate(`/dashboard/admin/view`);
    }

    const TableContent = (props) => {
        const dataSource = [
            ...props.data.map((value, index) => {
                return {
                    key: index,
                    name: value.name,
                    abuse_type: <div className='capitalize'>{value.type}</div>,
                    location: value.location,
                    status: <BadgeComponent text={value.status} />,
                    date: <>{value.days} {value.daysPeriod}</>,
                    action: <button onClick={() => handleView(value.id, value.phone)} className="px-3 py-2 text-white duration-200 ease-in-out hover:text-[#f1f1f1] hover:bg-[#fe580be4] bg-[#fe570b] rounded-md">View</button>,
                }
            })
        ];
        return (
            <>
                <div className="overflow-x-auto relative">
                    <Table dataSource={dataSource} columns={columns} />
                </div>
            </>
        )

    }

    const items = [
        {
            key: 'pending',
            label: 'New',
            children: <><TableContent data={filterArray(loadData, 'pending')} /></>
        },
        {
            key: 'under investigation',
            label: 'Under Investigation',
            children: <><TableContent data={filterArray(loadData, 'under investigation')} /></>
        },
        {
            key: 'resolved',
            label: 'Resolved',
            children: <><TableContent data={filterArray(loadData, 'resolved')} /></>
        },
    ];
    return (
        <>
            {!viewPage && <>
                <div className="flex items-center justify-center h-[70dvh]">
                    <PreLoader />
                </div>
            </>
                || viewPage == "content" && <>
                    <Tabs
                        defaultActiveKey="pending"
                        onChange={key => setDefaultTab(key)}
                        items={items}
                        tabBarExtraContent={<><Tooltip title="Reload content" placement='leftTop'><div onClick={() => { setViewPage(false); loadContent(); }} className='p-2 mr-16 rounded-md cursor-pointer'><AiOutlineReload className='text-xl' /></div></Tooltip></>}
                    />
                </>
                || viewPage == "not-allowed" && <>
                    <div className="flex items-center justify-center h-[70dvh]">
                        <Result
                            status="warning"
                            title="Sorry, you are not authorized to access this page."
                            extra={<Link to="/dashboard"><button className="py-2 px-4 hover:border-[#fff] border-2 rounded-lg duration-300 ease-in-out hover:text-white'><span className='flex items-center gap-2">Back Home</button></Link>}
                        />
                    </div>
                </>
            }
        </>
    )
}
export default AdminHome;