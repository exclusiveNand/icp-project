import React, { useContext, useEffect, useState } from 'react';
import logo from '../assets/Logo.svg'
import auth1 from '../assets/Auth1.svg'
import { Form, Link, useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Alert, Modal } from 'antd';
import { oasis_backend } from "../../../declarations/oasis_backend";
import { getRandomInt } from '../functions/fn';
import { GlobalContext } from '../context/global-context';

const AuthPage = () => {
  const { message } = useContext(GlobalContext);
  const [viewPage, setViewPage] = useState('screen-1');
  const [page_message, setMessage] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.auth) {
      var ldata = JSON.parse(localStorage.auth);
      if (ldata.status == "awaiting-otp-verification") {
        setViewPage("screen-2");
      } else if (ldata.status == "logged-in") {
        navigate('/dashboard');
      }
      if (ldata.phone) {
        setPhoneNumber(ldata.phone);
      }
    }
  }, []);

  const initLogin = async () => {
    if (phoneNumber == false) {
      console.error("No phone number is set")
      return;
    }
    setMessage({
      type: "info",
      message: "Sending OTP...",
    })
    message.loading("Sending OTP...", 30);
    var otp = getRandomInt(1111, 9999);
    var initLoginResp = await oasis_backend.login_init("+91" + phoneNumber, otp.toString()); // text -> string
    //response status 200 - message || 400 - error
    var convertedStr = JSON.parse(initLoginResp);
    if (convertedStr.status != 200) {
      message.destroy();
      message.error("Something went wrong!");
      setMessage({
        type: "error",
        message: "Something went wrong!",
        description: convertedStr.error
      })
    } else {
      setMessage(false);
      setViewPage('screen-2');
      message.destroy();
      message.info("OTP sent successfully! Please check your phone.");
      localStorage.auth = JSON.stringify({ 'status': 'awaiting-otp-verification', "phone": "+91" + phoneNumber });
    }
  }

  const createNewAccount = async () => {
    //create code run
    var userID = getRandomInt(0, 999999);
    var otp = getRandomInt(1111, 9999);
    if (phoneNumber == false) {
      console.error("No phone number is set")
      return;
    }
    message.loading("Creating a new account...", 30);
    var accountCreation = await oasis_backend.addNewUser(userID, "{}", "[]", otp.toString(), "+91" + phoneNumber);
    var validJSONResp = JSON.parse(accountCreation);
    if (validJSONResp.status != 200) {
      message.destroy();
      message.error("Something went wrong!");
      setMessage({
        type: "error",
        message: "Something went wrong!",
        description: validJSONResp.error
      })
    } else {
      message.destroy();
      initLogin();
    }
    setModalVisibility(false);
  }

  const handleScreen1FormSubmit = async (e) => {
    e.preventDefault();
    var fdata = new FormData(e.target)
    var phone = fdata.get("phone")
    //validate phone number
    if (phone.length != 10) {
      setMessage({
        type: "info",
        message: "Invalid Phone number",
        description: "Please enter a valid phone number"
      })
      return;
    }
    setMessage(false);
    phone = "+91" + phone;
    message.loading("Checking...", 30);
    var response = await oasis_backend.getUser(phone);
    if (response.length == 0) {
      message.destroy();
      setModalVisibility(true);
      return;
    } else {
      message.destroy();
      initLogin();
    }
  }
  const changeFocus = (e, focus = true) => {
    if (focus) {
      if (e.target.value != "") {
        e.target.nextElementSibling.focus();
      }
    }
    if ((e.target.value).length > 1) {
      var tempNum = e.target.value;
      var tstring = tempNum.toString();
      e.target.value = parseInt(tstring.charAt(0));
    }
  }
  const loginUser = async () => {
    var userData = await oasis_backend.getUser("+91" + phoneNumber);
    userData.forEach((value, index) => {
      var ldata = JSON.parse(localStorage.auth);
      ldata.status = "logged-in";
      delete value.token;
      delete value.id;
      ldata.userInfo = value;
      localStorage.auth = JSON.stringify(ldata);
      navigate('/dashboard');
    })
  };
  const handleScreen2FormSubmit = async (e) => {
    e.preventDefault();
    //get otp
    var otp = "";
    document.querySelectorAll('#otp-box').forEach((elm, key) => {
      otp += elm.value;
    })
    if (otp.length != 4) {
      setMessage({
        type: "info",
        message: "Invalid OTP",
        description: "Please enter a valid OTP!"
      })
      return;
    }
    setMessage(false);
    message.loading("Verifying OTP...", 30);
    var otpVerify = await oasis_backend.verifyToken("+91" + phoneNumber, otp);
    console.info(otpVerify);
    var validJSONResp = JSON.parse(otpVerify);
    console.table(validJSONResp);
    if (validJSONResp.status != 200) {
      message.destroy();
      message.error("Something went wrong!");
      setMessage({
        type: "error",
        message: "Something went wrong!",
        description: validJSONResp.error
      })
    } else {
      message.destroy();
      message.success("Cool! You are now logged in :)");
      setMessage({
        type: "success",
        message: "OTP verified",
        description: "Logging you in..."
      })
      //fetch user details
      loginUser();
      return;
    }
    return;
  }
  return (
    <>
      <div className='grid grid-cols-12 h-screen'>
        <div className='bg-[#0e0e0e] col-span-5'>
          <div className='m-8'>
            <div>
              <Link to="/"><img className='w-24 h-auto mx-5' src={logo} /></Link>
              <div className='mt-12 mx-12'>
                <h1 className='text-3xl font-bold text-white'>Where Healing Begins <br /><span className='text-[#fe570b]'>Justice Prevails</span></h1>
              </div>
              <div className='mt-12 absolute bottom-10 w-[45%] right-0 left-0'>
                <img className='w-[90%] h-auto' src={auth1} />
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-7 '>
          {viewPage == 'screen-1' && <>
            <div className='my-16'>
              <div className='flex flex-col items-center gap-3'>
                <h1 className='text-3xl font-semibold text-[#fe570b]'>Welcome</h1>
                <p className='text-white'>Sign In/Create an account to start using BreakTheSilence</p>
              </div>
            </div>
            <div className='mt-8 flex flex-col justify-center items-center'>
              <form autoComplete='off' onSubmit={handleScreen1FormSubmit} className='flex w-[80%] flex-col items-center justify-center'>
                <div className='flex flex-col w-full items-center'>
                  <div className='w-full '>
                    <label className='text-white font-semibold'>Phone Number</label>
                    <input onChange={(e) => setPhoneNumber(e.target.value)} name='phone' className='border-2 rounded-md focus:outline-none bg-[#222222] border-transparent  focus:border-[#333333] px-3 py-2 w-full my-3 text-white' type="tel" placeholder="Enter your phone number" />
                  </div>
                </div>
                <div className='my-6 flex justify-end w-full'>
                  <button className='bg-[#fe570b] flex gap-2 items-center text-white text-sm px-8 py-3 rounded-md uppercase'>Next <AiOutlineArrowRight /></button>
                </div>
              </form>
            </div>
          </>
            || viewPage == 'screen-2' && <>
              <div className='my-16'>
                <div className='flex flex-col items-center gap-3'>
                  <h1 className='text-3xl font-semibold text-[#fe570b]'>Welcome - OTP Verification</h1>
                  <p className='text-white'>We’ve sent an OTP to your number via SMS</p>
                </div>
              </div>
              <div className='mt-8 flex flex-col justify-center items-center'>
                <form onSubmit={handleScreen2FormSubmit} className='flex w-[80%] flex-col items-center justify-center'>
                  <div className='flex flex-col w-full items-center'>
                    <div className='w-full '>
                      <label className='text-white font-semibold'>Enter your OTP</label>
                      <div className='grid grid-cols-4 gap-6 w-[50%]'>
                        <input id="otp-box" onChange={(e) => { changeFocus(e); }} maxLength={1} className='border-[1px] text-white text-center bg-[#222222] border-[#0E1B2E] focus:outline-none rounded-md px-3 py-2 mt-2 h-12 w-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" placeholder="_" />
                        <input id="otp-box" onChange={(e) => { changeFocus(e); }} maxLength={1} className='border-[1px] text-white text-center bg-[#222222] border-[#0E1B2E] focus:outline-none rounded-md px-3 py-2 mt-2 h-12 w-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" placeholder="_" />
                        <input id="otp-box" onChange={(e) => { changeFocus(e); }} maxLength={1} className='border-[1px] text-white text-center bg-[#222222] border-[#0E1B2E] focus:outline-none rounded-md px-3 py-2 mt-2 h-12 w-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" placeholder="_" />
                        <input id="otp-box" onChange={(e) => { changeFocus(e, false); }} maxLength={1} className='border-[1px] text-white text-center bg-[#222222] border-[#0E1B2E] focus:outline-none rounded-md px-3 py-2 mt-2 h-12 w-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" placeholder="_" />
                      </div>
                    </div>
                  </div>
                  <div className='my-6 flex justify-end w-full'>
                    <button id="submit-btn" className='bg-[#fe570b] flex gap-2 items-center text-white text-sm px-8 py-3 rounded-md uppercase'>Verify otp <AiOutlineArrowRight /></button>
                  </div>
                </form>
              </div>
            </>}
          {
            page_message != false && <div className='w-full flex justify-center my-24'>
              <div className='flex w-[80%] justify-center items-center'>
                <Alert className='w-full' type={page_message.type || "info"} showIcon={true} message={page_message.message || ""} description={page_message.description || ""} />
              </div>
            </div>
          }
        </div>
      </div>
      <Modal open={modalVisibility} centered={true} width={650} footer={false} closeIcon={<></>}>
        <div className='my-4 flex flex-col gap-4'>
          <h1 className='text-xl font-bold '>Create a new account</h1>
          <div>
            No accounts are linked with this <span className='font-bold'>phone number</span>. Would you like to create a new one?
          </div>
        </div>
        <div className='flex gap-2 justify-end'>
          <button onClick={() => setModalVisibility(false)} className='px-2 py-1 text-sm mr-2 font-semibold'>Cancel</button>
          <button onClick={() => createNewAccount()} className='border-2 border-gray-900 px-4 py-1 text-sm mr-2 rounded-lg font-semibold hover:text-white hover:bg-black'>Yes</button>
        </div>
      </Modal>
    </>
  );
}

export default AuthPage;