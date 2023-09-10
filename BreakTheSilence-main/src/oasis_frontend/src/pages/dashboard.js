import React, { useContext, useEffect, useRef, useState } from 'react';
import AdminPage from './adminPage';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardFormPage from './components/dashboard/sub-pages/dashboard';
import AbuseForm from './components/dashboard/sub-pages/abuse-form';
import Err404 from './components/dashboard/sub-pages/Err-404';
import AdminHome from './components/dashboard/sub-pages/admin-home';
import ReportPreview from './components/dashboard/sub-pages/report-preview';
import ReportedCases from './components/dashboard/sub-pages/reported-cases';
import { GlobalContext } from '../context/global-context';
import { oasis_backend } from '../../../declarations/oasis_backend';
const Dashboard = () => {
    const [viewPage, setViewPage] = useState(false);
    const { page_id, view_key } = useParams();
    const navigate = useNavigate();
    const { Storage, Admin, PageTitle } = useContext(GlobalContext);
    const isMounted = useRef(false);

    // Page title update
    useEffect(() => {
        if(PageTitle.title != false) {
            document.title = PageTitle.title + " | BreakTheSilence";
        }
    }, [PageTitle.title])

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            if (localStorage.auth) {
                var ldata = JSON.parse(localStorage.auth);
                if (ldata.status != "logged-in") {
                    navigate('/auth');
                } else {
                    if (Storage.user.get == false) {
                        Storage.user.set(ldata.userInfo);
                    }
                    //fetch user data from backend and update it in localstorage and context
                    var resp = oasis_backend.getUser(ldata.userInfo.phone);
                    resp.then(data => {
                        data.forEach((value, index) => {
                            var ldata = JSON.parse(localStorage.auth);
                            ldata.status = "logged-in";
                            delete value.token;
                            delete value.id;
                            delete value.reportedAbuseCases;
                            value.userData = JSON.parse(value.userData);
                            ldata.userInfo = value;
                            localStorage.auth = JSON.stringify(ldata);
                            Storage.user.set(ldata.userInfo);
                            //check if user is admin
                            var admin = oasis_backend.getAdmin();
                            admin.then(resp => {
                                if(resp == value.phone){
                                    Admin.status.set(true);
                                } else {
                                    Admin.status.set('deny');
                                }
                            })
                        })
                    })
                }
            } else {
                navigate('/auth');
            }
        }
    }, [])

    useEffect(() => {
        if (page_id == "" || page_id == null) {
            setViewPage('dashboard');
        } else if (page_id == "abuse-form") {
            setViewPage('abuse-form')
        } else if (page_id == "admin") {
            if (view_key == "" || view_key == null) {
                setViewPage('admin');
            } else {
                setViewPage('admin-view');
            }
        } else if (page_id == "reported-cases") {
            setViewPage('reported-cases');
        } else {
            setViewPage('404');
        }
    }, [page_id, view_key])
    return (
        <div>
            <AdminPage>
                {
                    viewPage == 'dashboard' && <DashboardFormPage />
                    || viewPage == 'abuse-form' && <AbuseForm />
                    || viewPage == '404' && <Err404 />
                    || viewPage == 'admin' && <AdminHome />
                    || viewPage == 'admin-view' && <ReportPreview view_key={view_key} />
                    || viewPage == 'reported-cases' && <ReportedCases />
                }
            </AdminPage>

        </div>
    );
}

export default Dashboard;